const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let ideas = [
  {
    id: uuidv4(),
    title: "AI-Powered Dream Recorder",
    description: "A wearable device that uses brainwave monitoring and AI algorithms to generate visualizations of your dreams. Wake up and see what your subconscious created!",
    category: "Technology",
    tags: ["AI", "Wearable", "Dreams", "Neuroscience"],
    author: "TechDreamer",
    votes: 142,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Spotify for Food",
    description: "An app that creates personalized meal playlists based on your taste preferences, dietary restrictions, and mood. Get recipe recommendations like music recommendations!",
    category: "Food & Dining",
    tags: ["Food", "AI", "Personalization", "Recipes"],
    author: "FoodieBot",
    votes: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Urban Beehive Subscription",
    description: "A service that installs and maintains beehives on urban rooftops. Subscribers get fresh honey monthly while supporting local bee populations and urban agriculture.",
    category: "Environment",
    tags: ["Sustainability", "Agriculture", "Subscription", "Urban"],
    author: "BeeKeeper2024",
    votes: 203,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Virtual Reality Time Travel",
    description: "Immersive VR experiences that let you visit and interact with historical periods. Walk through ancient Rome, attend Shakespeare's plays, or witness the moon landing!",
    category: "Entertainment",
    tags: ["VR", "History", "Education", "Experience"],
    author: "TimeTraveler",
    votes: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Mood-Based Traffic Lights",
    description: "Smart traffic lights that detect driver stress levels through facial recognition and adjust timing to reduce road rage and improve overall traffic flow.",
    category: "Transportation",
    tags: ["Smart City", "AI", "Traffic", "Mental Health"],
    author: "CityPlanner",
    votes: 67,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Plant Communication App",
    description: "Using IoT sensors to translate plant health data into human-readable notifications. Your plants can now 'text' you when they need water, sunlight, or nutrients!",
    category: "Technology",
    tags: ["IoT", "Plants", "Agriculture", "Smart Home"],
    author: "PlantWhisperer",
    votes: 134,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Memory Palace VR App",
    description: "A virtual reality application that helps you build and navigate memory palaces to improve learning and recall using spatial memory techniques.",
    category: "Education",
    tags: ["VR", "Memory", "Learning", "Spatial"],
    author: "MindArchitect",
    votes: 178,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Eco-Friendly Packaging Service",
    description: "A subscription service that provides biodegradable packaging materials made from mushroom mycelium for small businesses and e-commerce.",
    category: "Business",
    tags: ["Sustainability", "Packaging", "Eco-friendly", "Subscription"],
    author: "GreenInnovator",
    votes: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions
const filterIdeas = (ideasArray, query = {}) => {
  let filtered = [...ideasArray];

  // Category filter
  if (query.category && query.category !== 'all') {
    filtered = filtered.filter(idea => idea.category === query.category);
  }

  // Search filter
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(idea =>
      idea.title.toLowerCase().includes(searchTerm) ||
      idea.description.toLowerCase().includes(searchTerm) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
};

const sortIdeas = (ideasArray, sortBy = 'createdAt', sortOrder = 'desc') => {
  return ideasArray.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });
};

const paginateIdeas = (ideasArray, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return ideasArray.slice(startIndex, endIndex);
};

// API Routes

// Get all ideas with pagination and filtering
app.get('/api/ideas', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Filter ideas
    let filteredIdeas = filterIdeas(ideas, { category, search });
    
    // Sort ideas
    filteredIdeas = sortIdeas(filteredIdeas, sortBy, sortOrder);
    
    // Paginate
    const paginatedIdeas = paginateIdeas(filteredIdeas, parseInt(page), parseInt(limit));
    
    const totalPages = Math.ceil(filteredIdeas.length / limit);
    
    res.json({
      ideas: paginatedIdeas,
      totalPages,
      currentPage: parseInt(page),
      total: filteredIdeas.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single idea
app.get('/api/ideas/:id', (req, res) => {
  try {
    const idea = ideas.find(idea => idea.id === req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new idea
app.post('/api/ideas', (req, res) => {
  try {
    const { title, description, category, tags, author } = req.body;
    
    const newIdea = {
      id: uuidv4(),
      title,
      description,
      category,
      tags: tags || [],
      author: author || 'Anonymous',
      votes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    ideas.push(newIdea);
    res.status(201).json(newIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vote on an idea
app.post('/api/ideas/:id/vote', (req, res) => {
  try {
    const { direction } = req.body; // 'up' or 'down'
    const idea = ideas.find(idea => idea.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    if (direction === 'up') {
      idea.votes += 1;
    } else if (direction === 'down') {
      idea.votes -= 1;
    }
    
    idea.updatedAt = new Date();
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(ideas.map(idea => idea.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular tags
app.get('/api/tags', (req, res) => {
  try {
    const tagCount = {};
    ideas.forEach(idea => {
      idea.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    const tags = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
      
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '10000 Ideas API is running!', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Loaded ${ideas.length} sample ideas`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});