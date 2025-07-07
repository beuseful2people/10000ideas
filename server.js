const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (using in-memory for demo purposes)
// In production, you would use: mongoose.connect(process.env.MONGODB_URI)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/10000ideas';

// Idea Schema
const ideaSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  category: { type: String, required: true },
  tags: [String],
  author: { type: String, default: 'Anonymous' },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Idea = mongoose.model('Idea', ideaSchema);

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Sample data for demo
const sampleIdeas = [
  {
    id: uuidv4(),
    title: "AI-Powered Dream Recorder",
    description: "A wearable device that uses brainwave monitoring and AI algorithms to generate visualizations of your dreams. Wake up and see what your subconscious created!",
    category: "Technology",
    tags: ["AI", "Wearable", "Dreams", "Neuroscience"],
    author: "TechDreamer",
    votes: 142,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Spotify for Food",
    description: "An app that creates personalized meal playlists based on your taste preferences, dietary restrictions, and mood. Get recipe recommendations like music recommendations!",
    category: "Food & Dining",
    tags: ["Food", "AI", "Personalization", "Recipes"],
    author: "FoodieBot",
    votes: 89,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Urban Beehive Subscription",
    description: "A service that installs and maintains beehives on urban rooftops. Subscribers get fresh honey monthly while supporting local bee populations and urban agriculture.",
    category: "Environment",
    tags: ["Sustainability", "Agriculture", "Subscription", "Urban"],
    author: "BeeKeeper2024",
    votes: 203,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Virtual Reality Time Travel",
    description: "Immersive VR experiences that let you visit and interact with historical periods. Walk through ancient Rome, attend Shakespeare's plays, or witness the moon landing!",
    category: "Entertainment",
    tags: ["VR", "History", "Education", "Experience"],
    author: "TimeTraveler",
    votes: 156,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Mood-Based Traffic Lights",
    description: "Smart traffic lights that detect driver stress levels through facial recognition and adjust timing to reduce road rage and improve overall traffic flow.",
    category: "Transportation",
    tags: ["Smart City", "AI", "Traffic", "Mental Health"],
    author: "CityPlanner",
    votes: 67,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Plant Communication App",
    description: "Using IoT sensors to translate plant health data into human-readable notifications. Your plants can now 'text' you when they need water, sunlight, or nutrients!",
    category: "Technology",
    tags: ["IoT", "Plants", "Agriculture", "Smart Home"],
    author: "PlantWhisperer",
    votes: 134,
    createdAt: new Date()
  }
];

// Initialize database with sample data
async function initializeDB() {
  try {
    const count = await Idea.countDocuments();
    if (count === 0) {
      await Idea.insertMany(sampleIdeas);
      console.log('Sample ideas inserted into database');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// API Routes

// Get all ideas with pagination and filtering
app.get('/api/ideas', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const ideas = await Idea.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Idea.countDocuments(query);
    
    res.json({
      ideas,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single idea
app.get('/api/ideas/:id', async (req, res) => {
  try {
    const idea = await Idea.findOne({ id: req.params.id });
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { title, description, category, tags, author } = req.body;
    
    const idea = new Idea({
      id: uuidv4(),
      title,
      description,
      category,
      tags: tags || [],
      author: author || 'Anonymous'
    });
    
    const savedIdea = await idea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vote on an idea
app.post('/api/ideas/:id/vote', async (req, res) => {
  try {
    const { direction } = req.body; // 'up' or 'down'
    const idea = await Idea.findOne({ id: req.params.id });
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    if (direction === 'up') {
      idea.votes += 1;
    } else if (direction === 'down') {
      idea.votes -= 1;
    }
    
    const updatedIdea = await idea.save();
    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Idea.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular tags
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Idea.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDB();
});