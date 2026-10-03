import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ full_name: user?.full_name || '', avatar_url: user?.avatar_url || '' });

  const handleSaveProfile = async () => {
    try {
      await api.put('/auth/me', profile);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update'); }
  };

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'team', label: 'Team' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'api', label: 'API' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'profile' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <Input label="Full Name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            <Input label="Email" value={user?.email || ''} disabled />
            <Input label="Role" value={user?.role || ''} disabled />
            <Input label="Avatar URL" value={profile.avatar_url} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} placeholder="https://..." />
            <Button onClick={handleSaveProfile}><Save className="h-4 w-4" /> Save Changes</Button>
          </div>
        </Card>
      )}

      {tab === 'team' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Team management coming soon. Invite agents and manage roles.</p>
        </Card>
      )}

      {tab === 'appearance' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Choose your preferred theme</p>
            <div className="flex gap-3">
              {(['dark', 'light', 'system']).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg border text-sm capitalize ${
                    theme === t
                      ? 'border-rose-600 bg-rose-600/10 text-rose-500'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {tab === 'api' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">API Keys</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Business ID</label>
              <div className="mt-1 px-3 py-2 bg-[var(--color-bg)] rounded-lg text-sm text-[var(--color-text)] font-mono">{user?.business_id || 'N/A'}</div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">Use your Business ID to integrate with the customer portal and API.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
