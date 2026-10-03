import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getSLAPolicies, createSLAPolicy, updateSLAPolicy, deleteSLAPolicy, getSLABreaches } from '../services/slaService';
import toast from 'react-hot-toast';

export default function SLAConfigPage() {
  const [policies, setPolicies] = useState([]);
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', priority: 'medium', first_response_hours: 1, resolution_hours: 24 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [polRes, brRes] = await Promise.all([getSLAPolicies(), getSLABreaches()]);
      setPolicies(polRes.data);
      setBreaches(brRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await updateSLAPolicy(editing, form);
        toast.success('Policy updated');
      } else {
        await createSLAPolicy(form);
        toast.success('Policy created');
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, priority: p.priority, first_response_hours: p.first_response_hours, resolution_hours: p.resolution_hours });
    setEditing(p.id);
    setShowModal(true);
  };

  const handleToggle = async (p) => {
    try {
      await updateSLAPolicy(p.id, { is_active: !p.is_active });
      fetchData();
    } catch { toast.error('Failed to toggle'); }
  };

  const handleDelete = async (id) => {
    try { await deleteSLAPolicy(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">SLA Policies</h2>
        <Button onClick={() => { setShowModal(true); setEditing(null); setForm({ name: '', priority: 'medium', first_response_hours: 1, resolution_hours: 24 }); }}>
          <Plus className="h-4 w-4" /> New Policy
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {policies.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-[var(--color-text)]">{p.name}</h4>
                <Badge status={p.priority} />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggle(p)} className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded"><Pencil className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--color-text-secondary)]">First Response</p>
                <p className="text-[var(--color-text)] font-medium">{p.first_response_hours}h</p>
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)]">Resolution</p>
                <p className="text-[var(--color-text)] font-medium">{p.resolution_hours}h</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {breaches.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">SLA Breaches ({breaches.length})</h3>
          </div>
          <div className="space-y-2">
            {breaches.map((b) => (
              <div key={b.ticket_id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg)]">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{b.subject}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">#{b.ticket_id.slice(0, 8)}</p>
                </div>
                <div className="flex gap-2">
                  {b.first_response_breached && <span className="text-xs text-red-400">Response breached</span>}
                  {b.resolution_breached && <span className="text-xs text-red-400">Resolution breached</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit SLA Policy' : 'New SLA Policy'} actions={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Urgent SLA" />
          <Input label="Priority" type="select" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
          <Input label="First Response (hours)" type="number" value={form.first_response_hours} onChange={(e) => setForm({ ...form, first_response_hours: parseFloat(e.target.value) })} />
          <Input label="Resolution (hours)" type="number" value={form.resolution_hours} onChange={(e) => setForm({ ...form, resolution_hours: parseFloat(e.target.value) })} />
        </div>
      </Modal>
    </div>
  );
}
