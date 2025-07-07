# 🚀 10,000 Ideas - Creative Platform

A modern web platform for sharing, discovering, and voting on creative ideas. Built with React, TypeScript, Node.js, Express, and MongoDB.

## ✨ Features

- **Idea Sharing**: Submit creative ideas with categories and tags
- **Voting System**: Upvote and downvote ideas from the community
- **Search & Filter**: Find ideas by keyword, category, and sort options
- **Masonry Grid Layout**: Beautiful Pinterest-style card layout
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic voting and content updates

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** for the REST API
- **MongoDB** with **Mongoose** for data storage
- **CORS** for cross-origin requests
- **UUID** for unique idea IDs

### Frontend
- **React 19** with **TypeScript** for type safety
- **React Masonry CSS** for grid layout
- **Axios** for API communication
- **CSS3** with modern animations and gradients

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service)

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd 10000ideas-clone/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React app**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
10000ideas/
├── server.js                 # Express server and API routes
├── package.json              # Backend dependencies
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
│
├── 10000ideas-clone/frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── Header.tsx        # Navigation and search component
│   │   ├── Header.css        # Header styling
│   │   ├── IdeasGrid.tsx     # Masonry grid component
│   │   ├── IdeasGrid.css     # Grid styling
│   │   ├── IdeaCard.tsx      # Individual idea card
│   │   ├── IdeaCard.css      # Card styling
│   │   ├── services/
│   │   │   └── api.ts        # API service layer
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── App.tsx           # Main application component
│   │   ├── App.css           # Global application styles
│   │   └── index.tsx         # React entry point
│   └── package.json          # Frontend dependencies
```

## 🔧 API Endpoints

### Ideas
- `GET /api/ideas` - Get all ideas with pagination and filtering
- `GET /api/ideas/:id` - Get single idea by ID
- `POST /api/ideas` - Create new idea
- `POST /api/ideas/:id/vote` - Vote on an idea (up/down)

### Categories & Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get popular tags

### Query Parameters
- `page` - Page number for pagination
- `limit` - Number of ideas per page
- `category` - Filter by category
- `search` - Search in title, description, and tags
- `sortBy` - Sort by field (createdAt, votes, title)
- `sortOrder` - Sort order (asc, desc)

## 🎨 Features in Detail

### Masonry Grid Layout
The ideas are displayed in a Pinterest-style masonry grid that automatically adjusts to different screen sizes:
- **Desktop**: 4 columns
- **Tablet**: 3 columns  
- **Mobile**: 2 columns
- **Small Mobile**: 1 column

### Search and Filtering
- **Real-time search** across titles, descriptions, and tags
- **Category filtering** with dynamic category loading
- **Multiple sort options** including date, votes, and alphabetical
- **Infinite scroll** with "Load More" functionality

### Voting System
- **Upvote/Downvote** with real-time updates
- **Vote persistence** in MongoDB
- **Optimistic UI updates** for better user experience

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Touch-friendly interface** on mobile devices
- **Hamburger menu** for mobile navigation
- **Optimized performance** across all devices

## 🔮 Sample Data

The application comes with 6 sample ideas across different categories:
- **Technology**: AI-Powered Dream Recorder, Plant Communication App
- **Food & Dining**: Spotify for Food
- **Environment**: Urban Beehive Subscription  
- **Entertainment**: Virtual Reality Time Travel
- **Transportation**: Mood-Based Traffic Lights

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud database
2. Update `MONGODB_URI` in production environment
3. Deploy to Heroku, Railway, or other Node.js hosting platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or other static hosting platform
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Inspired by the concept of democratizing idea sharing
- Built with modern web technologies for optimal performance
- Designed with user experience and accessibility in mind