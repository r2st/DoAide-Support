import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const BENCHMARKS = {
  email: { excellent: 60, good: 240, acceptable: 480, label: "Email" },
  chat: { excellent: 1, good: 3, acceptable: 5, label: "Live Chat (minutes)" },
  phone: { excellent: 1, good: 2, acceptable: 5, label: "Phone (minutes hold)" },
  social: { excellent: 30, good: 60, acceptable: 120, label: "Social Media" },
};

function getGrade(actual, benchmark) {
  if (actual <= benchmark.excellent) return { grade: "Excellent", color: "#22C55E" };
  if (actual <= benchmark.good) return { grade: "Good", color: "#84CC16" };
  if (actual <= benchmark.acceptable) return { grade: "Acceptable", color: "#F0B429" };
  return { grade: "Needs Improvement", color: "#EF4444" };
}

function formatTime(minutes, channel) {
  if (channel === "chat" || channel === "phone") {
    return minutes < 60 ? `${minutes} min` : `${(minutes / 60).toFixed(1)} hr`;
  }
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hr`;
  return `${(minutes / 1440).toFixed(1)} days`;
}

export default function ResponseTimeAnalyzerPage() {
  usePageTitle("Free Response Time Analyzer — Benchmark Your Support Speed");
  const [entries, setEntries] = useState([
    { channel: "email", responseTime: 120, volume: 500 },
  ]);
  const [results, setResults] = useState(null);

  const addEntry = () => {
    setEntries([...entries, { channel: "email", responseTime: 60, volume: 100 }]);
  };

  const removeEntry = (idx) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx, field, value) => {
    const updated = [...entries];
    updated[idx] = { ...updated[idx], [field]: field === "channel" ? value : parseInt(value, 10) || 0 };
    setEntries(updated);
  };

  const handleAnalyze = () => {
    const analyzed = entries.map((e) => {
      const benchmark = BENCHMARKS[e.channel];
      const grading = getGrade(e.responseTime, benchmark);
      const totalVolume = entries.reduce((sum, en) => sum + en.volume, 0);
      return {
        ...e,
        channelLabel: benchmark.label,
        grade: grading.grade,
        color: grading.color,
        volumePercent: totalVolume > 0 ? ((e.volume / totalVolume) * 100).toFixed(1) : 0,
        benchmarkExcellent: benchmark.excellent,
        benchmarkGood: benchmark.good,
      };
    });

    const totalVolume = entries.reduce((sum, e) => sum + e.volume, 0);
    const weightedAvg = totalVolume > 0
      ? entries.reduce((sum, e) => sum + e.responseTime * e.volume, 0) / totalVolume
      : 0;

    setResults({ entries: analyzed, weightedAvg, totalVolume });
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Response Time Analyzer</h1>
          <p className="tool-subtitle">
            Enter your support response times by channel and get benchmarked grades, volume-weighted averages, and improvement recommendations — no sign-up required.
          </p>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Your Response Times</h2>
            {entries.map((e, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
                <label className="calc-label">
                  {i === 0 && "Channel"}
                  <select className="calc-input" style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }} value={e.channel} onChange={(ev) => updateEntry(i, "channel", ev.target.value)}>
                    {Object.entries(BENCHMARKS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </label>
                <label className="calc-label">
                  {i === 0 && "Avg response (min)"}
                  <input className="calc-input" style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }} type="number" min="0" value={e.responseTime} onChange={(ev) => updateEntry(i, "responseTime", ev.target.value)} />
                </label>
                <label className="calc-label">
                  {i === 0 && "Monthly volume"}
                  <input className="calc-input" style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }} type="number" min="0" value={e.volume} onChange={(ev) => updateEntry(i, "volume", ev.target.value)} />
                </label>
                <button
                  onClick={() => removeEntry(i)}
                  style={{ background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: "1.1rem", padding: "0.4rem" }}
                  aria-label="Remove channel"
                >
                  &times;
                </button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn" style={{ background: "var(--color-surface-hover)", color: "var(--color-text)", fontSize: "0.85rem" }} onClick={addEntry}>
                + Add Channel
              </button>
              <button className="btn btn-primary" onClick={handleAnalyze}>Analyze</button>
            </div>
          </div>

          {results && (
            <div className="calc-card">
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>Analysis Results</h2>
              <div className="calc-result">
                <div className="calc-result-row calc-total">
                  <span>Volume-Weighted Avg Response</span>
                  <strong>{formatTime(Math.round(results.weightedAvg), "email")}</strong>
                </div>
                <div className="calc-result-row">
                  <span>Total monthly volume</span>
                  <strong>{results.totalVolume.toLocaleString()} tickets</strong>
                </div>
              </div>

              {results.entries.map((e, i) => (
                <div key={i} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem", color: "var(--color-text)" }}>{e.channelLabel}</strong>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: e.color, padding: "0.15rem 0.5rem", borderRadius: "4px", background: `${e.color}15` }}>
                      {e.grade}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
                    Your avg: <strong style={{ color: "var(--color-text)" }}>{formatTime(e.responseTime, e.channel)}</strong>
                    {" · "}Excellent benchmark: {formatTime(e.benchmarkExcellent, e.channel)}
                    {" · "}Good benchmark: {formatTime(e.benchmarkGood, e.channel)}
                    {" · "}{e.volumePercent}% of volume
                  </div>
                </div>
              ))}
              <ShareButtons path="/tools/response-time-analyzer" text="Benchmark your support response times — free tool by DoAide Support" />
            </div>
          )}

          <section className="tool-info">
            <h2>How to Use This Tool</h2>
            <p>
              Enter your average response time and monthly ticket volume for each support channel.
              The analyzer benchmarks your performance against industry standards and calculates
              a volume-weighted overall score.
            </p>
            <h3>Response Time Benchmarks</h3>
            <ul>
              <li><strong>Email:</strong> Excellent under 1 hr, good under 4 hr, acceptable under 8 hr</li>
              <li><strong>Live chat:</strong> Excellent under 1 min, good under 3 min</li>
              <li><strong>Phone:</strong> Excellent under 1 min hold, good under 2 min</li>
              <li><strong>Social media:</strong> Excellent under 30 min, good under 1 hr</li>
            </ul>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want real-time response time tracking and SLA alerts?</p>
            <a href="/register" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>Sign up free</a>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Response Time Analyzer",
            description: "Benchmark your customer support response times against industry standards — free, no sign-up required.",
            url: "https://support.doaide.com/tools/response-time-analyzer",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
          }),
        }}
      />
    </div>
  );
}
