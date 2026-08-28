import { axiosInstance } from './axiosInstance';

export interface InstagramPostItem {
  id: string;
  title: string;
  description?: string;
  category: 'Чоловічі' | 'Жіночі' | 'Дитячі' | 'Фарбування' | string;
  imageUrl: string;
  postUrl: string;
  masterName?: string;
  likesCount: number;
  createdAt: string;
}

export interface CreateInstagramPostPayload {
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  postUrl: string;
  masterName?: string;
  likesCount?: number;
}

export const instagramApi = {
  // GET /api/instagram (Public)
  getPosts: async (): Promise<InstagramPostItem[]> => {
    const response = await axiosInstance.get('/instagram');
    return response.data;
  },

  // POST /api/instagram (Protected)
  createPost: async (payload: CreateInstagramPostPayload): Promise<InstagramPostItem> => {
    const response = await axiosInstance.post('/instagram', payload);
    return response.data;
  },

  // DELETE /api/instagram/:id (Protected)
  deletePost: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/instagram/${id}`);
    return response.data;
  },
};
