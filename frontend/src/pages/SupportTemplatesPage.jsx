import { Link } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TEMPLATES = [
  {
    name: "Billing Inquiry",
    desc: "Handle billing questions, payment issues, and invoice requests professionally.",
    tags: ["Payment", "Invoice", "Refund", "Subscription", "Pricing"],
    example: "Thank you for reaching out about your billing concern. I've reviewed your account and can see [specific issue]. Here's what I can do to help...",
  },
  {
    name: "Technical Issue",
    desc: "Troubleshoot technical problems with structured diagnosis and resolution steps.",
    tags: ["Bug Report", "Error", "Troubleshooting", "Steps to Reproduce", "Resolution"],
    example: "I'm sorry you're experiencing this issue. To help resolve it quickly, could you share [specific details]? In the meantime, here are some steps to try...",
  },
  {
    name: "Refund Request",
    desc: "Process refund requests with clear policies and empathetic communication.",
    tags: ["Refund Policy", "Processing Time", "Alternative Solutions", "Confirmation"],
    example: "I understand your request for a refund and I appreciate you reaching out. Let me review your case and walk you through our process...",
  },
  {
    name: "Onboarding Welcome",
    desc: "Welcome new customers with setup guidance and resource links.",
    tags: ["Welcome", "Getting Started", "Setup Guide", "Resources", "Next Steps"],
    example: "Welcome to [Product]! We're excited to have you. Here's a quick guide to get started in under 5 minutes...",
  },
  {
    name: "Escalation",
    desc: "Escalate complex issues to specialists while keeping the customer informed.",
    tags: ["Priority", "Specialist", "Timeline", "Follow-up", "Case Number"],
    example: "I've reviewed your case and I want to make sure you get the best possible help. I'm escalating this to our [specialist team] who will...",
  },
  {
    name: "Feedback Response",
    desc: "Respond to customer feedback — positive, negative, or feature requests.",
    tags: ["Acknowledgment", "Action Plan", "Feature Request", "Thank You", "Follow-up"],
    example: "Thank you for taking the time to share your feedback — it genuinely helps us improve. Regarding your suggestion about [topic]...",
  },
];

export default function SupportTemplatesPage() {
  usePageTitle("Free Support Response Templates — 6 Professional Templates");

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 800 }}>
          <h1 className="tool-title">Support Response Templates</h1>
          <p className="tool-subtitle">
            Copy and customize these templates for common support scenarios.
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            {TEMPLATES.map((t) => (
              <div key={t.name} className="calc-card">
                <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", color: "var(--ink-strong, #fff)" }}>
                  {t.name}
                </h2>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>
                  {t.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {t.tags.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(240,180,41,0.1)",
                        color: "#F0B429",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ padding: "0.75rem", borderRadius: "6px", background: "rgba(10,10,11,0.5)", fontSize: "0.85rem", color: "#9CA3AF", lineHeight: 1.5, fontStyle: "italic", marginBottom: "0.75rem" }}>
                  {t.example}
                </div>
                <Link
                  to="/"
                  style={{
                    display: "inline-block",
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    background: "#F0B429",
                    color: "#0A0A0B",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Use this template
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <ShareButtons
              path="/templates-gallery"
              text="Free support response templates for billing, technical, refund, and more — DoAide Support"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
