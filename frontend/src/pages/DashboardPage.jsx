import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Clock, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getTickets } from '../services/ticketService';
import { getTicketVolume, getResponseTime, getSatisfaction } from '../services/reportService';
import { getSLABreaches } from '../services/slaService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ open: 0, avgResponse: 0, satisfaction: 0, today: 0 });
  const [volumeData, setVolumeData] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [breaches, setBreaches] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [ticketsRes, volumeRes, responseRes, satRes, breachRes] = await Promise.all([
          getTickets({ status: 'open', per_page: 5 }),
          getTicketVolume({}),
          getResponseTime({}),
          getSatisfaction({}),
          getSLABreaches(),
        ]);
        setRecentTickets(ticketsRes.data.tickets || []);
        setVolumeData(volumeRes.data.data || []);
        setBreaches(breachRes.data || []);
        setStats({
          open: ticketsRes.data.total || 0,
          avgResponse: responseRes.data.avg_first_response_hours || 0,
          satisfaction: satRes.data.average_rating || 0,
          today: volumeRes.data.total || 0,
        });
      } catch {
        /* dashboard loads gracefully with defaults */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const statCards = [
    { label: 'Open Tickets', value: stats.open, icon: Ticket, color: 'text-blue-400' },
    { label: 'Avg Response', value: `${stats.avgResponse.toFixed(1)}h`, icon: Clock, color: 'text-yellow-400' },
    { label: 'Satisfaction', value: stats.satisfaction ? `${stats.satisfaction.toFixed(1)}/5` : 'N/A', icon: Star, color: 'text-green-400' },
    { label: 'Tickets (30d)', value: stats.today, icon: TrendingUp, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color} opacity-80`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Ticket Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#e11d48" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">SLA Alerts</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          {breaches.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">No SLA breaches</p>
          ) : (
            <div className="space-y-3">
              {breaches.slice(0, 5).map((b) => (
                <div key={b.ticket_id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text)] truncate flex-1">{b.subject}</span>
                  <Badge status={b.priority} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
        <div className="space-y-3">
          {recentTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{t.subject}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">#{t.id.slice(0, 8)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={t.priority} />
                <Badge status={t.status} />
              </div>
            </div>
          ))}
          {recentTickets.length === 0 && <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No tickets yet</p>}
        </div>
      </Card>
    </div>
  );
}
