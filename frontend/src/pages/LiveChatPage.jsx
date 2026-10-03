import { useEffect, useState } from 'react';
import { Send, PhoneOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import useWebSocket from '../hooks/useWebSocket';
import { getSessions, endSession } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LiveChatPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);

  const wsUrl = activeSession
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/chat/ws/${activeSession.id}`
    : null;

  const { messages: wsMessages, connected, send } = useWebSocket(wsUrl);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wsMessages.length > 0) {
      setLocalMessages((prev) => [...prev, wsMessages[wsMessages.length - 1]]);
    }
  }, [wsMessages]);

  const fetchSessions = async () => {
    try {
      const { data } = await getSessions();
      setSessions(data);
    } catch {}
  };

  const handleSend = () => {
    if (!input.trim() || !activeSession) return;
    const msg = { sender_type: 'agent', sender_id: user?.id, body: input, timestamp: new Date().toISOString() };
    send(msg);
    setLocalMessages((prev) => [...prev, msg]);
    setInput('');
  };

  const handleEnd = async () => {
    if (!activeSession) return;
    try {
      await endSession(activeSession.id);
      setActiveSession(null);
      setLocalMessages([]);
      fetchSessions();
      toast.success('Chat ended');
    } catch { toast.error('Failed to end chat'); }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="w-72 flex-shrink-0 space-y-2 overflow-y-auto">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-3">Active Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No active chats</p>
        ) : sessions.map((s) => (
          <Card key={s.id} hover padding={false} onClick={() => { setActiveSession(s); setLocalMessages([]); }}
            className={`p-3 ${activeSession?.id === s.id ? 'ring-1 ring-rose-600' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="Customer" size="sm" status={s.status === 'active' ? 'online' : undefined} />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Session</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">#{s.id.slice(0, 8)}</p>
                </div>
              </div>
              <Badge status={s.status} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {!activeSession ? (
          <EmptyState title="Select a chat" description="Choose an active chat session from the sidebar" />
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Avatar name="Customer" size="sm" status="online" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Chat #{activeSession.id.slice(0, 8)}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{connected ? 'Connected' : 'Connecting...'}</p>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={handleEnd}><PhoneOff className="h-4 w-4" /> End</Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {localMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender_type === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] rounded-xl px-4 py-2 ${msg.sender_type === 'customer' ? 'bg-[var(--color-bg)]' : 'bg-rose-600/20'}`}>
                    <p className="text-sm text-[var(--color-text)]">{msg.body}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..." className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-600" />
                <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
