import { useEffect, useState } from 'react';
import { Plus, Search, Eye, ThumbsUp, Pencil, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { getArticles, createArticle, updateArticle, deleteArticle, getCategories, createCategory } from '../services/knowledgeService';
import toast from 'react-hot-toast';

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'draft', category_id: '' });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category_id = selectedCategory;
      const [artRes, catRes] = await Promise.all([getArticles(params), getCategories()]);
      setArticles(artRes.data);
      setCategories(catRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [search, selectedCategory]);

  const handleSave = async () => {
    try {
      const data = { ...form };
      if (!data.category_id) delete data.category_id;
      if (editing) {
        await updateArticle(editing, data);
        toast.success('Article updated');
      } else {
        await createArticle(data);
        toast.success('Article created');
      }
      setShowEditor(false);
      setEditing(null);
      setForm({ title: '', slug: '', content: '', status: 'draft', category_id: '' });
      fetchData();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (article) => {
    setForm({ title: article.title, slug: article.slug, content: article.content, status: article.status, category_id: article.category_id || '' });
    setEditing(article.id);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      toast.success('Article deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory);
      toast.success('Category created');
      setShowCategoryModal(false);
      setNewCategory({ name: '', slug: '', description: '' });
      fetchData();
    } catch { toast.error('Failed to create category'); }
  };

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Article' : 'New Article'}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setPreview(!preview)}><Eye className="h-4 w-4" /> {preview ? 'Edit' : 'Preview'}</Button>
            <Button variant="ghost" onClick={() => { setShowEditor(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
        {preview ? (
          <Card>
            <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
            <div className="prose prose-invert max-w-none text-[var(--color-text)]">
              <ReactMarkdown>{form.content}</ReactMarkdown>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" type="select" options={[{ value: '', label: 'None' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
              <Input label="Status" type="select" options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'archived', label: 'Archived' }]} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Content (Markdown)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full h-96 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-rose-600 resize-y"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="w-48 flex-shrink-0 hidden lg:block space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Categories</h3>
          <button onClick={() => setShowCategoryModal(true)} className="text-rose-500 hover:text-rose-400"><Plus className="h-4 w-4" /></button>
        </div>
        <button onClick={() => setSelectedCategory('')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!selectedCategory ? 'bg-rose-600/10 text-rose-500' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}`}>All</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === cat.id ? 'bg-rose-600/10 text-rose-500' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}`}>{cat.name}</button>
        ))}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Input icon={Search} placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={() => { setShowEditor(true); setEditing(null); setForm({ title: '', slug: '', content: '', status: 'draft', category_id: '' }); }}><Plus className="h-4 w-4" /> New Article</Button>
        </div>

        {loading ? <LoadingSpinner className="py-20" /> : articles.length === 0 ? (
          <EmptyState title="No articles" description="Create your first knowledge base article" action="New Article" onAction={() => setShowEditor(true)} />
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Card key={article.id} hover className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-[var(--color-text)] truncate">{article.title}</h4>
                    <Badge status={article.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.view_count}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{article.helpful_count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(article)} className="p-2 hover:bg-[var(--color-surface-hover)] rounded-lg"><Pencil className="h-4 w-4 text-[var(--color-text-secondary)]" /></button>
                  <button onClick={() => handleDelete(article.id)} className="p-2 hover:bg-[var(--color-surface-hover)] rounded-lg"><Trash2 className="h-4 w-4 text-red-400" /></button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="New Category" actions={<><Button variant="ghost" onClick={() => setShowCategoryModal(false)}>Cancel</Button><Button onClick={handleCreateCategory}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <Input label="Slug" value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} />
          <Input label="Description" type="textarea" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
