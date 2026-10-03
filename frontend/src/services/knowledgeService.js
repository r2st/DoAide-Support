import api from './api';

export const getArticles = (params) => api.get('/knowledge/articles', { params });
export const getArticle = (slug) => api.get(`/knowledge/articles/${slug}`);
export const createArticle = (data) => api.post('/knowledge/articles', data);
export const updateArticle = (id, data) => api.put(`/knowledge/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/knowledge/articles/${id}`);
export const getCategories = () => api.get('/knowledge/categories');
export const createCategory = (data) => api.post('/knowledge/categories', data);
export const deleteCategory = (id) => api.delete(`/knowledge/categories/${id}`);
export const markHelpful = (id) => api.post(`/knowledge/articles/${id}/helpful`);
