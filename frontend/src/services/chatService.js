import api from './api';

export const createSession = (data) => api.post('/chat/sessions', data);
export const getSessions = () => api.get('/chat/sessions');
export const endSession = (id) => api.put(`/chat/sessions/${id}/end`);

export function connectWebSocket(sessionId, onMessage) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/api/chat/ws/${sessionId}`);
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  return ws;
}
