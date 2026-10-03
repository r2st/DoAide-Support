import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', business_name: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.email, form.password, form.full_name, form.business_name);
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-rose-500">Do</span>
            <span className="text-[var(--color-text)]">Aide</span>
            <span className="text-[var(--color-text-secondary)] text-sm ml-1 font-normal">Support</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">Create your account</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.full_name} onChange={set('full_name')} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
            <Input label="Business Name" placeholder="Acme Inc." value={form.business_name} onChange={set('business_name')} required />
            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-500 hover:text-rose-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
