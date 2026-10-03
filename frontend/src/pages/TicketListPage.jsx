import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getTickets, createTicket } from '../services/ticketService';
import { getCustomers } from '../services/customerService';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TicketListPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ customer_id: '', subject: '', body: '', priority: 'medium' });
  const [customers, setCustomers] = useState([]);

  const debouncedSearch = useDebounce(search);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 20 };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await getTickets(params);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [page, statusFilter, priorityFilter, debouncedSearch]);

  const handleCreate = async () => {
    try {
      await createTicket(newTicket);
      toast.success('Ticket created');
      setShowCreate(false);
      setNewTicket({ customer_id: '', subject: '', body: '', priority: 'medium' });
      fetchTickets();
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const openCreateModal = async () => {
    try {
      const { data } = await getCustomers({});
      setCustomers(data);
    } catch {}
    setShowCreate(true);
  };

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="font-mono text-xs">#{row.id.slice(0, 8)}</span> },
    { key: 'subject', label: 'Subject', render: (row) => <span className="font-medium">{row.subject}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    { key: 'priority', label: 'Priority', render: (row) => <Badge status={row.priority} /> },
    { key: 'channel', label: 'Channel', render: (row) => <span className="capitalize text-[var(--color-text-secondary)]">{row.channel}</span> },
    { key: 'created_at', label: 'Created', render: (row) => <span className="text-[var(--color-text-secondary)]">{format(new Date(row.created_at), 'MMM d, HH:mm')}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input icon={Search} placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]">
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]">
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <Button onClick={openCreateModal}><Plus className="h-4 w-4" /> New Ticket</Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {loading ? <LoadingSpinner className="py-20" /> : (
          <Table
            columns={columns}
            data={tickets}
            onRowClick={(row) => navigate(`/tickets/${row.id}`)}
            page={page}
            totalPages={Math.ceil(total / 20)}
            onPageChange={setPage}
            emptyMessage="No tickets found"
          />
        )}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Ticket"
        actions={<><Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="Customer" type="select" options={[{ value: '', label: 'Select customer...' }, ...customers.map((c) => ({ value: c.id, label: `${c.name || c.email}` }))]} value={newTicket.customer_id} onChange={(e) => setNewTicket({ ...newTicket, customer_id: e.target.value })} />
          <Input label="Subject" placeholder="What's the issue?" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
          <Input label="Priority" type="select" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} />
          <Input label="Description" type="textarea" placeholder="Describe the issue..." value={newTicket.body} onChange={(e) => setNewTicket({ ...newTicket, body: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
