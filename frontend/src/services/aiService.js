import api from './api';

export const suggestReply = (ticketId) => api.post(`/ai/suggest-reply?ticket_id=${ticketId}`);
export const categorizeTicket = (ticketId) => api.post(`/ai/categorize?ticket_id=${ticketId}`);
export const summarizeTicket = (ticketId) => api.post(`/ai/summarize?ticket_id=${ticketId}`);
