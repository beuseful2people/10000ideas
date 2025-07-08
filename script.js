document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    const modal = document.getElementById('add-idea-modal');
    const addIdeaBtn = document.getElementById('add-idea-btn');
    const addIdeaForm = document.getElementById('add-idea-form');
    const ideaCategorySelect = document.getElementById('idea-category');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    const ideaDetailsModal = document.getElementById('idea-details-modal');
    const ideaDetailsContent = document.getElementById('idea-details-content');
    const commentsList = document.getElementById('comments-list');
    const addCommentForm = document.getElementById('add-comment-form');
    let currentOpenIdeaId = null;

    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    let ideaToDeleteId = null;


    let allIdeas = [];
    let allCategories = [];
    let editingIdeaId = null;

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }

    darkModeToggle.addEventListener('change', () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });

    async function fetchData() {
        try {
            const [ideasRes, categoriesRes] = await Promise.all([
                fetch('http://localhost:8000/api/ideas'),
                fetch('http://localhost:8000/api/categories')
            ]);
            allIdeas = await ideasRes.json();
            allCategories = await categoriesRes.json();
            
            populateCategories();
            // Only render if the grid is empty
            if (grid.children.length === 0) {
                renderIdeas(allIdeas, true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function populateCategories() {
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        ideaCategorySelect.innerHTML = '<option value="">Select a Category</option>';

        allCategories.forEach(category => {
            const option1 = document.createElement('option');
            option1.value = category.id;
            option1.textContent = category.name;
            categoryFilter.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = category.id;
            option2.textContent = category.name;
            ideaCategorySelect.appendChild(option2);
        });
    }

    // Toast notification utility
    function showToast(message, isError = false) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.background = isError ? '#e74c3c' : '#2ecc71';
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
    }

    function renderIdeas(ideas, fromFetch = false) {
        if (fromFetch) {
            grid.innerHTML = '';
            ideas.forEach(idea => {
                const category = allCategories.find(c => c.id === idea.categoryId);
                const item = document.createElement('div');
                item.className = 'grid-item';
                item.innerHTML = `
                    ${idea.imageUrl ? `<img src="${idea.imageUrl}" alt="${idea.title}">` : ''}
                    <div class="grid-item-content">
                        <h3>${idea.title}</h3>
                        <p>${idea.description}</p>
                        <div class="tags">
                           ${idea.tags.map(tag => `<span class='tag' data-tag='${tag}'>${tag}</span>`).join('')}
                        </div>
                        <span class="category">${category ? category.name : 'Uncategorized'}</span>
                        <button class="like-btn" data-id="${idea.id}">❤️ ${idea.likes || 0}</button>
                        <button class="edit-btn" data-id="${idea.id}">✎</button>
                        <button class="delete-btn" data-id="${idea.id}">&times;</button>
                    </div>
                `;
                grid.appendChild(item);
            });
        }

    }

    function filterIdeas() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategoryId = parseInt(categoryFilter.value, 10);

        let filteredIdeas = allIdeas;

        if (selectedCategoryId) {
            filteredIdeas = filteredIdeas.filter(idea => idea.categoryId === selectedCategoryId);
        }

        if (searchTerm) {
            filteredIdeas = filteredIdeas.filter(idea =>
                idea.title.toLowerCase().includes(searchTerm) ||
                idea.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        renderIdeas(filteredIdeas, true);
    }

    searchBar.addEventListener('input', filterIdeas);
    categoryFilter.addEventListener('change', filterIdeas);

    grid.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            ideaToDeleteId = parseInt(e.target.dataset.id, 10);
            confirmDeleteModal.style.display = 'block';
        } else if (e.target.classList.contains('edit-btn')) {
            const ideaId = parseInt(e.target.dataset.id, 10);
            const idea = allIdeas.find(i => i.id === ideaId);
            if (idea) {
                document.getElementById('idea-title').value = idea.title;
                document.getElementById('idea-description').value = idea.description;
                document.getElementById('idea-image-url').value = idea.imageUrl;
                document.getElementById('idea-category').value = idea.categoryId;
                document.getElementById('idea-tags').value = idea.tags.join(', ');
                editingIdeaId = ideaId;
                modal.style.display = 'block';
            }
        } else if (e.target.classList.contains('like-btn')) {
            const ideaId = parseInt(e.target.dataset.id, 10);
            try {
                const res = await fetch(`http://localhost:8000/api/ideas/${ideaId}/like`, { method: 'POST' });
                const updatedIdea = await res.json();
                allIdeas = allIdeas.map(idea => idea.id === ideaId ? updatedIdea : idea);
                renderIdeas(allIdeas, true);
            } catch (error) {
                showToast('Error liking idea', true);
            }
        } else if (e.target.classList.contains('tag')) {
            const tag = e.target.dataset.tag;
            searchBar.value = tag;
            filterIdeas();
        } else if (e.target.closest('.grid-item-content h3')) {
            const ideaId = parseInt(e.target.closest('.grid-item').querySelector('.edit-btn').dataset.id, 10);
            openIdeaDetails(ideaId);
        }
    });

    function openIdeaDetails(ideaId) {
        currentOpenIdeaId = ideaId;
        const idea = allIdeas.find(i => i.id === ideaId);
        if (!idea) return;

        ideaDetailsContent.innerHTML = `
            <h2>${idea.title}</h2>
            ${idea.imageUrl ? `<img src="${idea.imageUrl}" alt="${idea.title}" style="width:100%; border-radius: 8px; margin-bottom: 15px;">` : ''}
            <p>${idea.description}</p>
        `;

        renderComments(idea.comments || []);
        ideaDetailsModal.style.display = 'block';
    }

    function renderComments(comments) {
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>No comments yet.</p>';
            return;
        }
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.classList.add('comment');
            commentEl.textContent = comment.text;
            commentsList.appendChild(commentEl);
        });
    }

    addCommentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = document.getElementById('comment-text').value;
        if (!commentText.trim() || !currentOpenIdeaId) return;

        try {
            const res = await fetch(`http://localhost:8000/api/ideas/${currentOpenIdeaId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText })
            });
            const updatedIdea = await res.json();
            allIdeas = allIdeas.map(idea => idea.id === currentOpenIdeaId ? updatedIdea : idea);
            renderComments(updatedIdea.comments);
            addCommentForm.reset();
        } catch (error) {
            showToast('Error adding comment', true);
        }
    });


    ideaDetailsModal.querySelector('.close-btn').onclick = () => {
        ideaDetailsModal.style.display = 'none';
        currentOpenIdeaId = null;
    };


    addIdeaBtn.onclick = () => {
        editingIdeaId = null;
        addIdeaForm.reset();
        modal.style.display = 'block';
    };
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal || event.target == ideaDetailsModal || event.target == confirmDeleteModal) {
            modal.style.display = 'none';
            ideaDetailsModal.style.display = 'none';
            confirmDeleteModal.style.display = 'none';
        }
    }

    async function deleteIdea() {
        if (!ideaToDeleteId) return;
        try {
            await fetch(`http://localhost:8000/api/ideas/${ideaToDeleteId}`, {
                method: 'DELETE'
            });
            allIdeas = allIdeas.filter(idea => idea.id !== ideaToDeleteId);
            renderIdeas(allIdeas, true);
            showToast('Idea deleted!');
        } catch (error) {
            showToast('Error deleting idea', true);
        } finally {
            confirmDeleteModal.style.display = 'none';
            ideaToDeleteId = null;
        }
    }

    confirmDeleteBtn.onclick = deleteIdea;
    cancelDeleteBtn.onclick = () => {
        confirmDeleteModal.style.display = 'none';
        ideaToDeleteId = null;
    };

    addIdeaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newIdea = {
            title: document.getElementById('idea-title').value,
            description: document.getElementById('idea-description').value,
            imageUrl: document.getElementById('idea-image-url').value,
            categoryId: parseInt(document.getElementById('idea-category').value, 10),
            tags: document.getElementById('idea-tags').value.split(',').map(tag => tag.trim()),
        };

        try {
            if (editingIdeaId) {
                // Edit existing idea
                const res = await fetch(`http://localhost:8000/api/ideas/${editingIdeaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIdea)
                });
                const updatedIdea = await res.json();
                allIdeas = allIdeas.map(idea => idea.id === editingIdeaId ? { ...updatedIdea, id: editingIdeaId } : idea);
                showToast('Idea updated!');
                renderIdeas(allIdeas, true);
            } else {
                // Add new idea
                const res = await fetch('http://localhost:8000/api/ideas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIdea)
                });
                const savedIdea = await res.json();
                allIdeas.push(savedIdea);
                showToast('Idea added!');
                renderIdeas(allIdeas, true);
            }
            modal.style.display = 'none';
            addIdeaForm.reset();
            editingIdeaId = null;
        } catch (error) {
            showToast('Error saving idea', true);
        }
    });

    // Initial setup
    fetchData();

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});