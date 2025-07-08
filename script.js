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

    const db = {
      "ideas": [
        { "id": 1, "title": "AI-Powered Personal Assistant", "description": "A personal assistant that learns from your habits.", "imageUrl": "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 1, "tags": ["ai", "productivity"], "likes": 0, "comments": [] },
        { "id": 2, "title": "Sustainable Vertical Farming", "description": "A system for growing crops in urban areas.", "imageUrl": "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e4a?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 2, "tags": ["green", "urban farming"], "likes": 0, "comments": [] },
        { "id": 3, "title": "Decentralized Social Network", "description": "A social network that gives users control over their data.", "imageUrl": "https://images.unsplash.com/photo-1687892542731-36837939361b?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 3, "tags": ["web3", "privacy"], "likes": 0, "comments": [] },
        { "id": 4, "title": "3D Printed Custom Prosthetics", "description": "Affordable and customizable prosthetics for everyone.", "imageUrl": "https://images.unsplash.com/photo-1579625481430-69a47a69594e?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 4, "tags": ["3d printing", "medical"], "likes": 0, "comments": [] },
        { "id": 5, "title": "Gamified Language Learning App", "description": "Learn a new language by playing games.", "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 5, "tags": ["learning", "gamification"], "likes": 0, "comments": [] },
        { "id": 6, "title": "Personalized Nutrition Planner", "description": "An app that creates meal plans based on your DNA.", "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 4, "tags": ["health", "nutrition", "ai"], "likes": 0, "comments": [] },
        { "id": 7, "title": "Smart Waste Management System", "description": "IoT sensors in bins to optimize collection routes.", "imageUrl": "https://images.unsplash.com/photo-1532996122724-e3c354a5b190?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 2, "tags": ["iot", "smart city", "sustainability"], "likes": 0, "comments": [] },
        { "id": 8, "title": "Virtual Reality Travel Experiences", "description": "Explore the world from the comfort of your home.", "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "categoryId": 6, "tags": ["vr", "travel", "entertainment"], "likes": 0, "comments": [] }
      ],
      "categories": [
        { "id": 1, "name": "AI" },
        { "id": 2, "name": "Sustainability" },
        { "id": 3, "name": "Blockchain" },
        { "id": 4, "name": "Healthcare" },
        { "id": 5, "name": "Education" },
        { "id": 6, "name": "Entertainment" }
      ]
    };

    let allIdeas = db.ideas;
    let allCategories = db.categories;
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

    function fetchData() {
        populateCategories();
        // Only render if the grid is empty
        if (grid.children.length === 0) {
            renderIdeas(allIdeas, true);
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
            const idea = allIdeas.find(i => i.id === ideaId);
            if(idea) {
                idea.likes = (idea.likes || 0) + 1;
                renderIdeas(allIdeas, true);
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

        const idea = allIdeas.find(i => i.id === currentOpenIdeaId);
        if (idea) {
            if (!idea.comments) {
                idea.comments = [];
            }
            idea.comments.push({ text: commentText });
            renderComments(idea.comments);
            addCommentForm.reset();
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
    document.querySelector('#add-idea-modal .close-btn').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal || event.target == ideaDetailsModal || event.target == confirmDeleteModal) {
            modal.style.display = 'none';
            ideaDetailsModal.style.display = 'none';
            confirmDeleteModal.style.display = 'none';
        }
    }

    async function deleteIdea() {
        if (!ideaToDeleteId) return;
        allIdeas = allIdeas.filter(idea => idea.id !== ideaToDeleteId);
        renderIdeas(allIdeas, true);
        showToast('Idea deleted!');
        confirmDeleteModal.style.display = 'none';
        ideaToDeleteId = null;
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

        if (editingIdeaId) {
            const ideaIndex = allIdeas.findIndex(idea => idea.id === editingIdeaId);
            if (ideaIndex > -1) {
                allIdeas[ideaIndex] = { ...allIdeas[ideaIndex], ...newIdea };
            }
            showToast('Idea updated!');
            renderIdeas(allIdeas, true);
        } else {
            newIdea.id = allIdeas.length > 0 ? Math.max(...allIdeas.map(i => i.id)) + 1 : 1;
            newIdea.likes = 0;
            newIdea.comments = [];
            allIdeas.push(newIdea);
            showToast('Idea added!');
            renderIdeas(allIdeas, true);
        }
        modal.style.display = 'none';
        addIdeaForm.reset();
        editingIdeaId = null;
    });

    // Initial setup
    fetchData();

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});