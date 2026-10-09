import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TIERS = [
  { name: "Critical (P1)", defaultResponse: 15, defaultResolution: 240 },
  { name: "High (P2)", defaultResponse: 60, defaultResolution: 480 },
  { name: "Medium (P3)", defaultResponse: 240, defaultResolution: 1440 },
  { name: "Low (P4)", defaultResponse: 480, defaultResolution: 4320 },
];

function formatMinutes(m) {
  if (m < 60) return `${m} min`;
  if (m < 1440) return `${(m / 60).toFixed(m % 60 === 0 ? 0 : 1)} hr`;
  return `${(m / 1440).toFixed(m % 1440 === 0 ? 0 : 1)} days`;
}

function calcCompliance(totalTickets, metSLA) {
  if (totalTickets === 0) return 0;
  return ((metSLA / totalTickets) * 100).toFixed(1);
}

export default function SLACalculatorPage() {
  usePageTitle("Free SLA Calculator — Calculate Response & Resolution Targets");
  const [tiers, setTiers] = useState(
    TIERS.map((t) => ({ ...t, responseMin: t.defaultResponse, resolutionMin: t.defaultResolution }))
  );
  const [businessHoursPerDay, setBusinessHoursPerDay] = useState(8);
  const [businessDaysPerWeek, setBusinessDaysPerWeek] = useState(5);
  const [totalTickets, setTotalTickets] = useState(1000);
  const [metSLA, setMetSLA] = useState(950);
  const [showResults, setShowResults] = useState(false);

  const updateTier = (idx, field, value) => {
    const updated = [...tiers];
    updated[idx] = { ...updated[idx], [field]: parseInt(value, 10) || 0 };
    setTiers(updated);
  };

  const compliance = calcCompliance(totalTickets, metSLA);
  const businessMinutesPerDay = businessHoursPerDay * 60;

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">SLA Calculator</h1>
          <p className="tool-subtitle">
            Define SLA targets, calculate business-hours deadlines, and measure compliance rates — no sign-up required.
          </p>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Business Hours</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label className="calc-label">
                Hours per day
                <input className="calc-input" type="number" min="1" max="24" value={businessHoursPerDay} onChange={(e) => setBusinessHoursPerDay(parseInt(e.target.value, 10) || 8)} />
              </label>
              <label className="calc-label">
                Days per week
                <input className="calc-input" type="number" min="1" max="7" value={businessDaysPerWeek} onChange={(e) => setBusinessDaysPerWeek(parseInt(e.target.value, 10) || 5)} />
              </label>
            </div>
          </div>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>SLA Targets (minutes)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Priority</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Response</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Resolution</span>
              {tiers.map((t, i) => (
                <>
                  <span key={`name-${i}`} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>{t.name}</span>
                  <input key={`resp-${i}`} className="calc-input" style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }} type="number" min="1" value={t.responseMin} onChange={(e) => updateTier(i, "responseMin", e.target.value)} />
                  <input key={`res-${i}`} className="calc-input" style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }} type="number" min="1" value={t.resolutionMin} onChange={(e) => updateTier(i, "resolutionMin", e.target.value)} />
                </>
              ))}
            </div>
          </div>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Compliance Calculator</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label className="calc-label">
                Total tickets
                <input className="calc-input" type="number" min="0" value={totalTickets} onChange={(e) => setTotalTickets(parseInt(e.target.value, 10) || 0)} />
              </label>
              <label className="calc-label">
                Tickets meeting SLA
                <input className="calc-input" type="number" min="0" value={metSLA} onChange={(e) => setMetSLA(parseInt(e.target.value, 10) || 0)} />
              </label>
            </div>
            <button className="btn btn-primary" onClick={() => setShowResults(true)}>Calculate</button>
          </div>

          {showResults && (
            <div className="calc-card">
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>Results</h2>
              <div className="calc-result">
                <div className="calc-result-row calc-total">
                  <span>SLA Compliance Rate</span>
                  <strong style={{ color: parseFloat(compliance) >= 95 ? "#22C55E" : parseFloat(compliance) >= 90 ? "#F0B429" : "#EF4444" }}>
                    {compliance}%
                  </strong>
                </div>
                <div className="calc-result-row">
                  <span>Tickets breaching SLA</span>
                  <strong>{totalTickets - metSLA}</strong>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)" }}>Business-Hours Breakdown</h3>
                {tiers.map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--color-text-secondary)", padding: "0.25rem 0" }}>
                    <span>{t.name}</span>
                    <span>
                      Response: <strong style={{ color: "var(--color-text)" }}>{formatMinutes(t.responseMin)}</strong>
                      {" · "}
                      Resolution: <strong style={{ color: "var(--color-text)" }}>{formatMinutes(t.resolutionMin)}</strong>
                      {" · "}
                      <span style={{ fontSize: "0.8rem" }}>
                        ({(t.resolutionMin / businessMinutesPerDay).toFixed(1)} business days)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <ShareButtons path="/tools/sla-calculator" text="Calculate SLA targets and compliance rates — free tool by DoAide Support" />
            </div>
          )}

          <section className="tool-info">
            <h2>Understanding SLA Metrics</h2>
            <p>
              Service Level Agreements define the expected response and resolution times for support tickets.
              Tracking SLA compliance helps you identify bottlenecks, justify staffing decisions, and set
              customer expectations accurately.
            </p>
            <h3>Industry Benchmarks</h3>
            <ul>
              <li>95%+ compliance is considered excellent</li>
              <li>90-95% is acceptable for most B2B companies</li>
              <li>Below 90% signals a staffing or process gap</li>
              <li>Enterprise contracts typically require 99%+ for P1 tickets</li>
            </ul>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want automated SLA tracking with real-time alerts?</p>
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
            name: "SLA Calculator",
            description: "Calculate SLA response and resolution targets, measure compliance rates, and convert to business hours — free, no sign-up required.",
            url: "https://support.doaide.com/tools/sla-calculator",
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
