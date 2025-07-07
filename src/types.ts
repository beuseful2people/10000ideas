export interface Idea {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeasResponse {
  ideas: Idea[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface Category {
  name: string;
  count?: number;
}

export interface Tag {
  name: string;
  count: number;
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
  category: string;
  tags: string[];
  author?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}