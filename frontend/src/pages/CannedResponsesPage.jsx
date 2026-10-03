import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Copy } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getCannedResponses, createCannedResponse, updateCannedResponse, deleteCannedResponse } from '../services/cannedResponseService';
import toast from 'react-hot-toast';

export default function CannedResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', shortcut: '', category: '' });
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCannedResponses();
      setResponses(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = responses.filter((r) =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.shortcut?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (editing) {
        await updateCannedResponse(editing, form);
        toast.success('Updated');
      } else {
        await createCannedResponse(form);
        toast.success('Created');
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', content: '', shortcut: '', category: '' });
      fetchData();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (r) => {
    setForm({ title: r.title, content: r.content, shortcut: r.shortcut || '', category: r.category || '' });
    setEditing(r.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try { await deleteCannedResponse(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input icon={Search} placeholder="Search responses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => { setShowModal(true); setEditing(null); setForm({ title: '', content: '', shortcut: '', category: '' }); }}>
          <Plus className="h-4 w-4" /> New Response
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No canned responses" description="Create templates for common replies" action="New Response" onAction={() => setShowModal(true)} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text)]">{r.title}</h4>
                  {r.shortcut && <p className="text-xs text-rose-400 font-mono">{r.shortcut}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(r.content)} className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded"><Copy className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" /></button>
                  <button onClick={() => handleEdit(r)} className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded"><Pencil className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3">{r.content}</p>
              <div className="flex items-center justify-between mt-3">
                {r.category && <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-0.5 rounded">{r.category}</span>}
                <span className="text-xs text-[var(--color-text-secondary)]">Used {r.use_count} times</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Response' : 'New Response'} actions={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Greeting response" />
          <Input label="Shortcut" value={form.shortcut} onChange={(e) => setForm({ ...form, shortcut: e.target.value })} placeholder="/greeting" />
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General" />
          <Input label="Content" type="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Hello! Thank you for reaching out..." />
        </div>
      </Modal>
    </div>
  );
}
