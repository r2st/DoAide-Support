import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Send, Lock, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Avatar from '../components/ui/Avatar';
import { getTicket, updateTicket, addMessage } from '../services/ticketService';
import { suggestReply } from '../services/aiService';
import { searchCannedResponses } from '../services/cannedResponseService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cannedResults, setCannedResults] = useState([]);
  const [cannedQuery, setCannedQuery] = useState('');

  const fetchTicket = async () => {
    try {
      const { data } = await getTicket(id);
      setTicket(data);
    } catch {
      toast.error('Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await addMessage(id, { body: reply, sender_type: 'agent', is_internal: isInternal });
      setReply('');
      setIsInternal(false);
      fetchTicket();
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    try {
      const { data } = await suggestReply(id);
      setReply(data.suggested_reply);
      toast.success('AI suggestion ready');
    } catch {
      toast.error('AI suggestion failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateTicket(id, { status });
      fetchTicket();
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const searchCanned = async (q) => {
    setCannedQuery(q);
    if (q.length < 2) { setCannedResults([]); return; }
    try {
      const { data } = await searchCannedResponses(q);
      setCannedResults(data);
    } catch {}
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!ticket) return <p className="text-center text-[var(--color-text-secondary)] py-20">Ticket not found</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <h2 className="text-xl font-semibold mb-1">{ticket.subject}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">#{ticket.id.slice(0, 8)} &middot; Created {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}</p>
        </Card>

        <div className="space-y-3">
          {(ticket.messages || []).map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender_type === 'customer' ? '' : 'flex-row-reverse'}`}>
              <Avatar name={msg.sender_type === 'customer' ? 'Customer' : msg.sender_type === 'ai' ? 'AI' : user?.full_name} size="sm" />
              <div className={`max-w-[70%] rounded-xl px-4 py-3 ${
                msg.sender_type === 'customer' ? 'bg-[var(--color-surface)] border border-[var(--color-border)]'
                : msg.sender_type === 'ai' ? 'bg-purple-600/20 border border-purple-600/30'
                : msg.is_internal ? 'bg-yellow-600/20 border border-yellow-600/30'
                : 'bg-rose-600/20 border border-rose-600/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium capitalize text-[var(--color-text-secondary)]">
                    {msg.sender_type}{msg.is_internal ? ' (Internal)' : ''}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{format(new Date(msg.created_at), 'HH:mm')}</span>
                </div>
                <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{msg.body}</p>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <div className="space-y-3">
            <div className="relative">
              <Input label="Canned Response" placeholder="Search /shortcut..." value={cannedQuery} onChange={(e) => searchCanned(e.target.value)} />
              {cannedResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {cannedResults.map((cr) => (
                    <button key={cr.id} onClick={() => { setReply(cr.content); setCannedResults([]); setCannedQuery(''); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-hover)]">
                      <span className="font-medium text-rose-400">{cr.shortcut}</span> — {cr.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <textarea
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-rose-600 min-h-[120px] resize-y"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleAiSuggest} loading={aiLoading}>
                  <Bot className="h-4 w-4" /> AI Suggest
                </Button>
                <button onClick={() => setIsInternal(!isInternal)} className={`flex items-center gap-1 text-sm ${isInternal ? 'text-yellow-400' : 'text-[var(--color-text-secondary)]'}`}>
                  <Lock className="h-4 w-4" /> Internal Note
                </button>
              </div>
              <Button onClick={handleSend} loading={sending}><Send className="h-4 w-4" /> Send</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-4">Ticket Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)]">Status</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {['open', 'pending', 'resolved', 'closed'].map((s) => (
                  <button key={s} onClick={() => handleStatusChange(s)}>
                    <Badge status={s} className={ticket.status === s ? 'ring-2 ring-rose-600' : 'opacity-50'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)]">Priority</label>
              <div className="mt-1"><Badge status={ticket.priority} /></div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)]">Channel</label>
              <p className="text-sm text-[var(--color-text)] capitalize mt-1">{ticket.channel}</p>
            </div>
            {ticket.tags?.length > 0 && (
              <div>
                <label className="text-xs text-[var(--color-text-secondary)]">Tags</label>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {ticket.tags.map((tag) => <Badge key={tag} status="default">{tag}</Badge>)}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-4">SLA Status</h3>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[var(--color-text-secondary)]" />
            {ticket.first_response_at
              ? <span className="text-green-400">First response sent</span>
              : <span className="text-yellow-400">Awaiting first response</span>
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
