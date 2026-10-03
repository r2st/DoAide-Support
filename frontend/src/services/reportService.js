import api from './api';

export const getTicketVolume = (params) => api.get('/reports/ticket-volume', { params });
export const getResponseTime = (params) => api.get('/reports/response-time', { params });
export const getSatisfaction = (params) => api.get('/reports/satisfaction', { params });
export const getAgentPerformance = (params) => api.get('/reports/agent-performance', { params });
