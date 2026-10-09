import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const SURVEY_TYPES = {
  csat: {
    label: "CSAT (Customer Satisfaction)",
    questions: [
      { text: "How satisfied are you with the support you received?", type: "scale", scale: "1-5" },
      { text: "Was your issue resolved?", type: "yesno" },
      { text: "How would you rate the agent's communication?", type: "scale", scale: "1-5" },
      { text: "Any additional feedback?", type: "text" },
    ],
  },
  nps: {
    label: "NPS (Net Promoter Score)",
    questions: [
      { text: "How likely are you to recommend us to a friend or colleague?", type: "scale", scale: "0-10" },
      { text: "What is the primary reason for your score?", type: "text" },
    ],
  },
  ces: {
    label: "CES (Customer Effort Score)",
    questions: [
      { text: "How easy was it to get your issue resolved?", type: "scale", scale: "1-7" },
      { text: "How many times did you contact us about this issue?", type: "choice", options: ["Once", "Twice", "3+ times"] },
      { text: "What could we do to make it easier?", type: "text" },
    ],
  },
  postResolution: {
    label: "Post-Resolution Survey",
    questions: [
      { text: "How satisfied are you with the resolution?", type: "scale", scale: "1-5" },
      { text: "Was the resolution timely?", type: "yesno" },
      { text: "Did the agent understand your issue?", type: "yesno" },
      { text: "How likely are you to contact us again for help?", type: "scale", scale: "1-5" },
      { text: "Anything else you'd like us to know?", type: "text" },
    ],
  },
};

function generateSurvey(surveyType, companyName, customQuestions) {
  const survey = SURVEY_TYPES[surveyType];
  if (!survey) return null;
  const company = companyName || "Your Company";
  const allQuestions = [
    ...survey.questions,
    ...customQuestions.filter((q) => q.trim()).map((q) => ({ text: q, type: "text" })),
  ];
  return {
    title: `${company} — ${survey.label} Survey`,
    type: survey.label,
    questions: allQuestions,
  };
}

function formatQuestionType(q) {
  if (q.type === "scale") return `Rating scale (${q.scale})`;
  if (q.type === "yesno") return "Yes / No";
  if (q.type === "choice") return `Multiple choice: ${q.options.join(", ")}`;
  return "Open text";
}

export default function CSATSurveyCreatorPage() {
  usePageTitle("Free Customer Satisfaction Survey Creator");
  const [surveyType, setSurveyType] = useState("csat");
  const [companyName, setCompanyName] = useState("");
  const [customQuestions, setCustomQuestions] = useState(["", ""]);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const updateCustomQuestion = (idx, value) => {
    const updated = [...customQuestions];
    updated[idx] = value;
    setCustomQuestions(updated);
  };

  const handleGenerate = () => {
    setResult(generateSurvey(surveyType, companyName.trim(), customQuestions));
  };

  const handleCopy = async () => {
    if (!result) return;
    const lines = [result.title, `Type: ${result.type}`, ""];
    result.questions.forEach((q, i) => {
      lines.push(`${i + 1}. ${q.text}`);
      lines.push(`   Type: ${formatQuestionType(q)}`);
      lines.push("");
    });
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
          <h1 className="tool-title">Customer Satisfaction Survey Creator</h1>
          <p className="tool-subtitle">
            Build CSAT, NPS, or CES surveys for your support team in seconds — no sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Survey Type
              <select className="calc-input" value={surveyType} onChange={(e) => setSurveyType(e.target.value)}>
                {Object.entries(SURVEY_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </label>
            <label className="calc-label">
              Company Name (optional)
              <input className="calc-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme Inc" />
            </label>
            <div>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--color-text)", display: "block", marginBottom: "0.35rem" }}>
                Custom Questions (optional)
              </span>
              {customQuestions.map((q, i) => (
                <input
                  key={i}
                  className="calc-input"
                  style={{ marginBottom: "0.5rem" }}
                  value={q}
                  onChange={(e) => updateCustomQuestion(i, e.target.value)}
                  placeholder={`Custom question ${i + 1}`}
                />
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleGenerate}>Create Survey</button>
          </div>

          {result && (
            <div className="calc-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
                  {result.title}
                </h2>
                <button className="btn btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy Survey"}
                </button>
              </div>
              {result.questions.map((q, i) => (
                <div key={i} style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : "none", paddingTop: i > 0 ? "0.75rem" : 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)" }}>
                    {i + 1}. {q.text}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                    {formatQuestionType(q)}
                  </p>
                </div>
              ))}
              <ShareButtons path="/tools/csat-survey" text="Create customer satisfaction surveys in seconds — free tool by DoAide Support" />
            </div>
          )}

          <section className="tool-info">
            <h2>Choosing the Right Survey</h2>
            <ul>
              <li><strong>CSAT</strong> — best for measuring satisfaction after a specific interaction</li>
              <li><strong>NPS</strong> — best for measuring overall loyalty and likelihood to recommend</li>
              <li><strong>CES</strong> — best for measuring how easy it was to get help</li>
              <li><strong>Post-Resolution</strong> — combines multiple metrics for comprehensive feedback</li>
            </ul>
            <h3>Survey Best Practices</h3>
            <ul>
              <li>Send surveys within 24 hours of resolution</li>
              <li>Keep surveys under 5 questions for higher completion rates</li>
              <li>Always include one open-text question for qualitative feedback</li>
              <li>Track trends over time, not just individual scores</li>
            </ul>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want automated CSAT surveys sent after every ticket resolution?</p>
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
            name: "Customer Satisfaction Survey Creator",
            description: "Create CSAT, NPS, and CES customer satisfaction surveys for your support team — free, no sign-up required.",
            url: "https://support.doaide.com/tools/csat-survey",
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
