import api from './api';

export const getCannedResponses = () => api.get('/canned-responses');
export const searchCannedResponses = (q) => api.get('/canned-responses/search', { params: { q } });
export const createCannedResponse = (data) => api.post('/canned-responses', data);
export const updateCannedResponse = (id, data) => api.put(`/canned-responses/${id}`, data);
export const deleteCannedResponse = (id) => api.delete(`/canned-responses/${id}`);
