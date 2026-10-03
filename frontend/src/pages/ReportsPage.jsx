import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getTicketVolume, getResponseTime, getSatisfaction, getAgentPerformance } from '../services/reportService';

const COLORS = ['#e11d48', '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6'];

export default function ReportsPage() {
  const [tab, setTab] = useState('volume');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const [vol, resp, sat, perf] = await Promise.all([
        getTicketVolume(params), getResponseTime(params), getSatisfaction(params), getAgentPerformance(params),
      ]);
      setData({ volume: vol.data, response: resp.data, satisfaction: sat.data, performance: perf.data });
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [startDate, endDate]);

  const tabs = [
    { key: 'volume', label: 'Volume' },
    { key: 'response', label: 'Response Time' },
    { key: 'satisfaction', label: 'Satisfaction' },
    { key: 'performance', label: 'Agent Performance' },
  ];

  const satDist = data.satisfaction?.distribution
    ? Object.entries(data.satisfaction.distribution).map(([k, v]) => ({ name: `${k} star`, value: v }))
    : [];

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]" />
          <span className="text-[var(--color-text-secondary)]">to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]" />
        </div>
      </div>

      {tab === 'volume' && (
        <Card>
          <h3 className="text-lg font-semibold mb-2">Ticket Volume</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Total: {data.volume?.total || 0} tickets</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.volume?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#e11d48" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {tab === 'response' && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Avg First Response', value: `${data.response?.avg_first_response_hours?.toFixed(1) || 0}h` },
            { label: 'Avg Resolution', value: `${data.response?.avg_resolution_hours?.toFixed(1) || 0}h` },
            { label: 'Median First Response', value: `${data.response?.median_first_response_hours?.toFixed(1) || 0}h` },
            { label: 'Median Resolution', value: `${data.response?.median_resolution_hours?.toFixed(1) || 0}h` },
          ].map(({ label, value }) => (
            <Card key={label}>
              <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
              <p className="text-3xl font-bold text-[var(--color-text)] mt-1">{value}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'satisfaction' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <p className="text-sm text-[var(--color-text-secondary)]">Average Rating</p>
            <p className="text-4xl font-bold text-[var(--color-text)] mt-1">{data.satisfaction?.average_rating?.toFixed(1) || 'N/A'}<span className="text-lg text-[var(--color-text-secondary)]">/5</span></p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">{data.satisfaction?.total_ratings || 0} total ratings</p>
          </Card>
          <Card>
            <h4 className="text-sm font-semibold mb-4">Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={satDist} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" label>
                    {satDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {tab === 'performance' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Resolved</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Avg Response</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {(data.performance?.agents || []).map((a) => (
                  <tr key={a.agent_id} className="border-b border-[var(--color-border)]">
                    <td className="px-4 py-3 text-[var(--color-text)] font-medium">{a.agent_name}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]">{a.tickets_resolved}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]">{a.avg_response_hours.toFixed(1)}h</td>
                    <td className="px-4 py-3 text-[var(--color-text)]">{a.satisfaction_avg ? `${a.satisfaction_avg.toFixed(1)}/5` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
