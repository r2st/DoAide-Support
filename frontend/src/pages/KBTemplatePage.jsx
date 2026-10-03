import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const ARTICLE_TYPES = [
  { value: "how-to", label: "How-To Guide", sections: ["Overview", "Prerequisites", "Steps", "Expected Result", "Troubleshooting", "Related Articles"] },
  { value: "troubleshooting", label: "Troubleshooting", sections: ["Problem Description", "Symptoms", "Cause", "Solution", "If the Issue Persists", "Related Articles"] },
  { value: "faq", label: "FAQ Entry", sections: ["Question", "Short Answer", "Detailed Explanation", "Related Questions"] },
  { value: "getting-started", label: "Getting Started", sections: ["Welcome", "What You'll Need", "Step 1: Setup", "Step 2: Configuration", "Step 3: First Use", "Next Steps"] },
  { value: "policy", label: "Policy / Process", sections: ["Policy Overview", "Scope", "Guidelines", "Exceptions", "Contact for Questions"] },
];

function generateTemplate(title, type, product, audience) {
  const articleType = ARTICLE_TYPES.find((t) => t.value === type) || ARTICLE_TYPES[0];
  const audienceNote = audience ? ` This article is for ${audience}.` : "";
  const productRef = product || "the product";

  const sectionContent = {
    "Overview": `Provide a brief overview of what this article covers and why it matters for ${productRef} users.${audienceNote}`,
    "Prerequisites": `List what users need before following this guide:\n- [ ] Requirement 1\n- [ ] Requirement 2\n- [ ] Requirement 3`,
    "Steps": `### Step 1: [Action]\nDescribe the first step clearly.\n\n### Step 2: [Action]\nDescribe the second step.\n\n### Step 3: [Action]\nDescribe the third step.`,
    "Expected Result": `Describe what the user should see after completing the steps successfully.`,
    "Troubleshooting": `**Issue:** [Describe common issue]\n**Solution:** [Describe fix]\n\n**Issue:** [Describe another issue]\n**Solution:** [Describe fix]`,
    "Related Articles": `- [Related article 1](link)\n- [Related article 2](link)`,
    "Problem Description": `Describe the problem users are experiencing with ${productRef}.`,
    "Symptoms": `- Symptom 1\n- Symptom 2\n- Symptom 3`,
    "Cause": `Explain the root cause of this issue.`,
    "Solution": `### Fix\n1. First step to resolve\n2. Second step\n3. Verify the fix`,
    "If the Issue Persists": `If the steps above don't resolve the issue:\n1. Collect relevant logs or screenshots\n2. Contact support with your account details\n3. Reference this article ID`,
    "Question": `[Write the exact question users commonly ask]`,
    "Short Answer": `[Provide a 1-2 sentence answer]`,
    "Detailed Explanation": `[Expand with context, examples, or edge cases]`,
    "Related Questions": `- [Related question 1](link)\n- [Related question 2](link)`,
    "Welcome": `Welcome to ${productRef}! This guide will help you get started quickly.${audienceNote}`,
    "What You'll Need": `- [ ] An account on ${productRef}\n- [ ] Access credentials\n- [ ] 10 minutes`,
    "Step 1: Setup": `Describe initial setup instructions.`,
    "Step 2: Configuration": `Walk through key configuration options.`,
    "Step 3: First Use": `Guide the user through their first meaningful action.`,
    "Next Steps": `Now that you're set up, explore:\n- [Feature 1](link)\n- [Feature 2](link)\n- [Advanced guide](link)`,
    "Policy Overview": `State the purpose of this policy clearly.`,
    "Scope": `Describe who this policy applies to and in what contexts.`,
    "Guidelines": `1. Guideline one\n2. Guideline two\n3. Guideline three`,
    "Exceptions": `Document any exceptions or special circumstances.`,
    "Contact for Questions": `For questions about this policy, contact [team/email].`,
  };

  const markdown = [`# ${title || "Article Title"}`, `*Type: ${articleType.label}*\n`];
  for (const section of articleType.sections) {
    markdown.push(`## ${section}\n`);
    markdown.push((sectionContent[section] || `[Add content for ${section}]`) + "\n");
  }
  markdown.push(`---\n*Last updated: ${new Date().toLocaleDateString()}*`);
  return markdown.join("\n");
}

export default function KBTemplatePage() {
  usePageTitle("Free Knowledge Base Template Generator");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("how-to");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setResult(generateTemplate(title.trim(), type, product.trim(), audience.trim()));
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Knowledge Base Template</h1>
          <p className="tool-subtitle">
            Generate a structured knowledge base article template in Markdown — ready to fill in and publish.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Article Title
              <input className="calc-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to Reset Your Password" />
            </label>
            <label className="calc-label">
              Article Type
              <select className="calc-input" value={type} onChange={(e) => setType(e.target.value)}>
                {ARTICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="calc-label">
              Product / Service Name (optional)
              <input className="calc-input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. DoAide Support" />
            </label>
            <label className="calc-label">
              Target Audience (optional)
              <input className="calc-input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. new users, administrators" />
            </label>
            <button className="btn btn-primary" onClick={handleGenerate}>Generate Template</button>
          </div>

          {result && (
            <div className="calc-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
                  Generated Template
                </h2>
                <button className="btn btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: "1rem",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowX: "auto",
                maxHeight: "500px",
              }}>
                {result}
              </pre>
              <ShareButtons path="/tools/kb-template" text="Generate knowledge base article templates instantly — free tool by DoAide Support" />
            </div>
          )}

          <section className="tool-info">
            <h2>Build a Better Knowledge Base</h2>
            <p>
              Consistent article structure makes your knowledge base easier to navigate and maintain.
              Templates ensure every article covers the essentials — reducing follow-up tickets and
              improving self-service success rates.
            </p>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want a full knowledge base with AI search and analytics?</p>
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
            name: "Knowledge Base Template Generator",
            description: "Generate structured knowledge base article templates in Markdown — free, no sign-up required.",
            url: "https://support.doaide.com/tools/kb-template",
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
