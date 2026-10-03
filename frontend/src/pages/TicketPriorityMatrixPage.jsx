import React, { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

const DEFAULT_MATRIX = {
  "Critical-Critical": { priority: "P1", label: "Emergency", color: "#EF4444", response: "15 min", resolution: "4 hours" },
  "Critical-High": { priority: "P1", label: "Emergency", color: "#EF4444", response: "15 min", resolution: "4 hours" },
  "Critical-Medium": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "Critical-Low": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "High-Critical": { priority: "P1", label: "Emergency", color: "#EF4444", response: "15 min", resolution: "4 hours" },
  "High-High": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "High-Medium": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "High-Low": { priority: "P3", label: "Medium", color: "#F0B429", response: "4 hours", resolution: "24 hours" },
  "Medium-Critical": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "Medium-High": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "Medium-Medium": { priority: "P3", label: "Medium", color: "#F0B429", response: "4 hours", resolution: "24 hours" },
  "Medium-Low": { priority: "P4", label: "Low", color: "#22C55E", response: "8 hours", resolution: "72 hours" },
  "Low-Critical": { priority: "P2", label: "High", color: "#F97316", response: "1 hour", resolution: "8 hours" },
  "Low-High": { priority: "P3", label: "Medium", color: "#F0B429", response: "4 hours", resolution: "24 hours" },
  "Low-Medium": { priority: "P4", label: "Low", color: "#22C55E", response: "8 hours", resolution: "72 hours" },
  "Low-Low": { priority: "P4", label: "Low", color: "#22C55E", response: "8 hours", resolution: "72 hours" },
};

function buildMatrix(customResponses, customResolutions) {
  const matrix = { ...DEFAULT_MATRIX };
  for (const key of Object.keys(matrix)) {
    const p = matrix[key].priority;
    if (customResponses[p]) matrix[key] = { ...matrix[key], response: customResponses[p] };
    if (customResolutions[p]) matrix[key] = { ...matrix[key], resolution: customResolutions[p] };
  }
  return matrix;
}

export default function TicketPriorityMatrixPage() {
  usePageTitle("Free Ticket Priority Matrix Builder");
  const [customResponses, setCustomResponses] = useState({ P1: "15 min", P2: "1 hour", P3: "4 hours", P4: "8 hours" });
  const [customResolutions, setCustomResolutions] = useState({ P1: "4 hours", P2: "8 hours", P3: "24 hours", P4: "72 hours" });
  const [copied, setCopied] = useState(false);

  const matrix = buildMatrix(customResponses, customResolutions);

  const handleExport = async () => {
    const lines = ["Impact,Urgency,Priority,Label,Response SLA,Resolution SLA"];
    for (const impact of IMPACT_LEVELS) {
      for (const urgency of URGENCY_LEVELS) {
        const cell = matrix[`${impact}-${urgency}`];
        lines.push(`${impact},${urgency},${cell.priority},${cell.label},${cell.response},${cell.resolution}`);
      }
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Ticket Priority Matrix</h1>
          <p className="tool-subtitle">
            Build a priority matrix to triage support tickets consistently across your team — no sign-up required.
          </p>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Customize SLA Targets</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Priority</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Response</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Resolution</span>
              {["P1", "P2", "P3", "P4"].map((p) => (
                <React.Fragment key={p}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: p === "P1" ? "#EF4444" : p === "P2" ? "#F97316" : p === "P3" ? "#F0B429" : "#22C55E" }}>{p}</span>
                  <input
                    className="calc-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
                    value={customResponses[p]}
                    onChange={(e) => setCustomResponses({ ...customResponses, [p]: e.target.value })}
                  />
                  <input
                    className="calc-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
                    value={customResolutions[p]}
                    onChange={(e) => setCustomResolutions({ ...customResolutions, [p]: e.target.value })}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="calc-card" style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Priority Matrix</h2>
              <button className="btn btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} onClick={handleExport}>
                {copied ? "Copied!" : "Copy as CSV"}
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", marginTop: "0.5rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>Impact ↓ / Urgency →</th>
                  {URGENCY_LEVELS.map((u) => (
                    <th key={u} style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>{u}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...IMPACT_LEVELS].reverse().map((impact) => (
                  <tr key={impact}>
                    <td style={{ padding: "0.5rem", fontWeight: 600, color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}>{impact}</td>
                    {URGENCY_LEVELS.map((urgency) => {
                      const cell = matrix[`${impact}-${urgency}`];
                      return (
                        <td key={urgency} style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: "#0A0A0B",
                            background: cell.color,
                          }}>
                            {cell.priority}
                          </span>
                          <div style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)", marginTop: "0.15rem" }}>
                            {cell.response} / {cell.resolution}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="calc-card">
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>Priority Definitions</h2>
            {[
              { p: "P1 — Emergency", color: "#EF4444", desc: "Service down or critical business function unavailable. Affects all or most users." },
              { p: "P2 — High", color: "#F97316", desc: "Major feature degraded or unavailable. Significant impact with no workaround." },
              { p: "P3 — Medium", color: "#F0B429", desc: "Non-critical issue with a viable workaround. Limited user impact." },
              { p: "P4 — Low", color: "#22C55E", desc: "Cosmetic issue, minor inconvenience, or general question." },
            ].map((item) => (
              <div key={item.p} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, marginTop: "0.4rem", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "var(--color-text)" }}>{item.p}</strong>
                  <p style={{ margin: "0.15rem 0 0", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <ShareButtons path="/tools/priority-matrix" text="Build a ticket priority matrix for your team — free tool by DoAide Support" />

          <section className="tool-info">
            <h2>Why a Priority Matrix Matters</h2>
            <p>
              Without a clear priority framework, agents waste time debating urgency and customers
              get inconsistent response times. A priority matrix based on impact and urgency ensures
              every ticket is triaged the same way — regardless of who handles it.
            </p>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want automated ticket prioritization with SLA tracking?</p>
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
            name: "Ticket Priority Matrix Builder",
            description: "Build a ticket priority matrix to triage support tickets consistently — free, no sign-up required.",
            url: "https://support.doaide.com/tools/priority-matrix",
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
