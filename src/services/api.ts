import axios from 'axios';
import { Idea, IdeasResponse, CreateIdeaRequest, Category, Tag } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ideasApi = {
  // Get all ideas with optional filters
  getIdeas: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<IdeasResponse> => {
    const response = await api.get('/ideas', { params });
    return response.data;
  },

  // Get single idea by id
  getIdea: async (id: string): Promise<Idea> => {
    const response = await api.get(`/ideas/${id}`);
    return response.data;
  },

  // Create new idea
  createIdea: async (idea: CreateIdeaRequest): Promise<Idea> => {
    const response = await api.post('/ideas', idea);
    return response.data;
  },

  // Vote on an idea
  voteOnIdea: async (id: string, direction: 'up' | 'down'): Promise<Idea> => {
    const response = await api.post(`/ideas/${id}/vote`, { direction });
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get popular tags
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data;
  },
};

export default api;