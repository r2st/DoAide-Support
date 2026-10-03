import api from './api';

export const getSLAPolicies = () => api.get('/sla');
export const createSLAPolicy = (data) => api.post('/sla', data);
export const updateSLAPolicy = (id, data) => api.put(`/sla/${id}`, data);
export const deleteSLAPolicy = (id) => api.delete(`/sla/${id}`);
export const getSLABreaches = () => api.get('/sla/breaches');
