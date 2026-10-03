import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

function scoreResponse(text) {
  if (!text.trim()) return null;

  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;

  let tone = 0;
  const politeWords = ["please", "thank", "appreciate", "sorry", "apolog", "understand", "happy", "glad"];
  const harshWords = ["can't", "won't", "impossible", "never", "wrong", "fault"];
  politeWords.forEach((w) => { if (text.toLowerCase().includes(w)) tone += 12; });
  harshWords.forEach((w) => { if (text.toLowerCase().includes(w)) tone -= 15; });
  tone = Math.min(100, Math.max(0, 50 + tone));

  let completeness = Math.min(100, Math.round((words / 80) * 100));
  if (sentences >= 3) completeness = Math.min(100, completeness + 15);
  if (text.includes("?")) completeness = Math.min(100, completeness + 10);

  let empathy = 0;
  const empathyPhrases = ["i understand", "i can see", "that must be", "i hear you", "let me help", "we care", "i appreciate"];
  empathyPhrases.forEach((p) => { if (text.toLowerCase().includes(p)) empathy += 15; });
  empathy = Math.min(100, Math.max(0, 30 + empathy));

  const overall = Math.round((tone + completeness + empathy) / 3);

  const tips = [];
  if (tone < 60) tips.push("Add empathetic language like 'I understand' or 'Thank you for your patience'");
  if (completeness < 60) tips.push("Provide more detail — aim for at least 3-4 sentences with specific next steps");
  if (empathy < 50) tips.push("Acknowledge the customer's frustration before jumping to the solution");
  if (!text.includes("?")) tips.push("Ask a follow-up question to confirm the customer's needs");
  if (words < 30) tips.push("Your response is quite short — more context helps build trust");

  return { tone, completeness, empathy, overall, tips };
}

function ScoreBar({ label, value }) {
  const color = value >= 70 ? "#22C55E" : value >= 40 ? "#F0B429" : "#EF4444";
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>{label}</span>
        <strong style={{ fontSize: "0.85rem", color }}>{value}/100</strong>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: "100%", borderRadius: 3, background: color, width: `${value}%`, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

export default function ResponseCheckerPage() {
  usePageTitle("Free Support Response Checker — Score Your Replies");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const score = scoreResponse(text);
    setResult(score);
    if (score) track("response_check", { overall: score.overall });
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Response Quality Checker</h1>
          <p className="tool-subtitle">
            Paste a support reply and get instant feedback on tone, completeness, and empathy.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Your Support Response
              <textarea
                className="calc-input"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your support reply here..."
                style={{ resize: "vertical", marginTop: "0.4rem" }}
              />
            </label>

            <button className="btn btn-primary" onClick={handleCheck} style={{ marginTop: "0.5rem" }}>
              Check Response
            </button>

            {result && (
              <div className="calc-result" aria-live="polite">
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 700, color: result.overall >= 70 ? "#22C55E" : result.overall >= 40 ? "#F0B429" : "#EF4444" }}>
                    {result.overall}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#9CA3AF" }}> / 100 overall</span>
                </div>

                <ScoreBar label="Tone" value={result.tone} />
                <ScoreBar label="Completeness" value={result.completeness} />
                <ScoreBar label="Empathy" value={result.empathy} />

                {result.tips.length > 0 && (
                  <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px", background: "rgba(240,180,41,0.08)" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#F0B429", display: "block", marginBottom: "0.5rem" }}>Suggestions</strong>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "#9CA3AF" }}>
                      {result.tips.map((tip, i) => <li key={i} style={{ marginBottom: "0.35rem" }}>{tip}</li>)}
                    </ul>
                  </div>
                )}

                <ShareButtons path="/checker" text="Check your support response quality for free — tone, completeness, empathy scores on DoAide Support" />
              </div>
            )}
          </div>

          <section className="tool-info">
            <h2>Why Response Quality Matters</h2>
            <p>
              Customer support responses directly impact satisfaction, retention, and brand perception.
              A well-crafted reply resolves the issue AND makes the customer feel heard. This tool helps
              you catch tone issues before hitting send.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
