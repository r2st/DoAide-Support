import { useState, useEffect } from 'react';
import { Search, Send, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function CustomerPortalPage() {
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', body: '' });
  const [reply, setReply] = useState('');
  const [tab, setTab] = useState('tickets');
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (email && businessId) setAuthenticated(true);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchTickets();
    fetchArticles();
  }, [authenticated]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/portal/tickets', { params: { email, business_id: businessId } });
      setTickets(data);
    } catch {} finally { setLoading(false); }
  };

  const fetchArticles = async () => {
    try {
      const params = { business_id: businessId };
      if (search) params.search = search;
      const { data } = await api.get('/portal/knowledge', { params });
      setArticles(data);
    } catch {}
  };

  useEffect(() => { if (authenticated) fetchArticles(); }, [search]);

  const handleCreate = async () => {
    try {
      await api.post('/portal/tickets', { email, name, business_id: businessId, subject: newTicket.subject, body: newTicket.body });
      toast.success('Ticket submitted');
      setShowCreate(false);
      setNewTicket({ subject: '', body: '' });
      fetchTickets();
    } catch { toast.error('Failed to submit'); }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      await api.post(`/portal/tickets/${selectedTicket.id}/messages`, { body: reply });
      setReply('');
      const { data } = await api.get(`/portal/tickets/${selectedTicket.id}`);
      setSelectedTicket(data);
      toast.success('Reply sent');
    } catch { toast.error('Failed to send'); }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              <span className="text-rose-500">Do</span><span className="text-[var(--color-text)]">Aide</span>
              <span className="text-[var(--color-text-secondary)] text-sm ml-1 font-normal">Customer Portal</span>
            </h1>
            <p className="text-[var(--color-text-secondary)]">Track your support tickets</p>
          </div>
          <Card>
            <div className="space-y-4">
              <Input label="Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              <Input label="Business ID" value={businessId} onChange={(e) => setBusinessId(e.target.value)} placeholder="Business UUID" />
              <Button onClick={handleLogin} className="w-full">Access Portal</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => setSelectedTicket(null)}>Back to tickets</Button>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{selectedTicket.subject}</h2>
            <Badge status={selectedTicket.status} />
          </div>
          <div className="space-y-3 mb-6">
            {(selectedTicket.messages || []).map((msg) => (
              <div key={msg.id} className={`p-3 rounded-lg ${msg.sender_type === 'customer' ? 'bg-[var(--color-bg)]' : 'bg-rose-600/10'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium capitalize text-[var(--color-text-secondary)]">{msg.sender_type}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{format(new Date(msg.created_at), 'MMM d, HH:mm')}</span>
                </div>
                <p className="text-sm text-[var(--color-text)]">{msg.body}</p>
              </div>
            ))}
          </div>
          {selectedTicket.status !== 'closed' && (
            <div className="flex gap-2">
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply..." className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-600" />
              <Button onClick={handleReply}><Send className="h-4 w-4" /></Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={tab === 'tickets' ? 'primary' : 'ghost'} size="sm" onClick={() => setTab('tickets')}>My Tickets</Button>
          <Button variant={tab === 'kb' ? 'primary' : 'ghost'} size="sm" onClick={() => setTab('kb')}>Knowledge Base</Button>
        </div>
        {tab === 'tickets' && <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New Ticket</Button>}
      </div>

      {tab === 'tickets' ? (
        loading ? <LoadingSpinner className="py-20" /> : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Card key={t.id} hover onClick={() => setSelectedTicket(t)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{t.subject}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{format(new Date(t.created_at), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge status={t.status} />
                </div>
              </Card>
            ))}
            {tickets.length === 0 && <p className="text-center text-[var(--color-text-secondary)] py-12">No tickets yet</p>}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <Input icon={Search} placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {articles.map((a) => (
            <Card key={a.id}>
              <h3 className="text-sm font-semibold mb-2 text-[var(--color-text)]">{a.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{a.content.slice(0, 200)}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Submit a Ticket" actions={<><Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate}>Submit</Button></>}>
        <div className="space-y-4">
          <Input label="Subject" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Brief description" />
          <Input label="Description" type="textarea" value={newTicket.body} onChange={(e) => setNewTicket({ ...newTicket, body: e.target.value })} placeholder="Describe your issue..." />
        </div>
      </Modal>
    </div>
  );
}
