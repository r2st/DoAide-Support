import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TEMPLATES = {
  saas: [
    { q: "What is {product}?", a: "{product} is a {desc}." },
    { q: "How do I get started with {product}?", a: "Sign up on our website, follow the onboarding wizard, and you'll be up and running in minutes." },
    { q: "What pricing plans are available?", a: "We offer a free tier plus paid plans. Visit our pricing page for current details." },
    { q: "Is there a free trial?", a: "Yes — you can try {product} free with no credit card required." },
    { q: "How do I cancel my subscription?", a: "Go to Settings → Billing and click 'Cancel plan'. Your access continues until the end of the billing period." },
    { q: "Is my data secure?", a: "We use encryption at rest and in transit, with regular security audits and SOC 2 compliance." },
    { q: "How do I contact support?", a: "Reach us via the in-app chat widget, email support@{domain}, or our help center." },
    { q: "Can I export my data?", a: "Yes — go to Settings → Data and click 'Export'. You'll receive a downloadable file within minutes." },
  ],
  ecommerce: [
    { q: "How do I place an order?", a: "Browse our catalog, add items to your cart, and proceed to checkout." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay." },
    { q: "What is your return policy?", a: "Returns are accepted within 30 days of delivery. Items must be unused and in original packaging." },
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express options are available at checkout." },
    { q: "How do I track my order?", a: "You'll receive a tracking link via email once your order ships. You can also check order status in your account." },
    { q: "Do you ship internationally?", a: "Yes — we ship to over 50 countries. Shipping costs and times vary by destination." },
    { q: "How do I contact customer support?", a: "Email us at support@{domain} or use the live chat on our website." },
    { q: "Can I change or cancel my order?", a: "Orders can be modified or canceled within 1 hour of placing them. Contact support for help." },
  ],
  service: [
    { q: "What services does {product} offer?", a: "{product} provides {desc}." },
    { q: "How do I book an appointment?", a: "Use our online booking form or call us directly to schedule." },
    { q: "What are your business hours?", a: "We're available Monday–Friday, 9 AM–6 PM in your local time zone." },
    { q: "How much do your services cost?", a: "Pricing depends on the scope of work. Contact us for a free quote." },
    { q: "Do you offer consultations?", a: "Yes — we offer a free initial consultation to understand your needs." },
    { q: "What is your cancellation policy?", a: "Cancel up to 24 hours before your appointment at no charge." },
    { q: "How do I pay?", a: "We accept credit cards, bank transfers, and invoicing for ongoing engagements." },
    { q: "How do I reach support?", a: "Email support@{domain}, call our office, or use the contact form on our website." },
  ],
};

function generateFAQs(name, description, domain, type) {
  const template = TEMPLATES[type] || TEMPLATES.saas;
  const desc = description.toLowerCase().replace(/\.$/, "");
  return template.map((item) => ({
    q: item.q.replace(/{product}/g, name),
    a: item.a.replace(/{product}/g, name).replace(/{desc}/g, desc).replace(/{domain}/g, domain || "example.com"),
  }));
}

export default function FAQGeneratorPage() {
  usePageTitle("Free FAQ Generator — Create FAQs Instantly");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("saas");
  const [faqs, setFaqs] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const handleGenerate = () => {
    if (!name.trim()) return;
    setFaqs(generateFAQs(name.trim(), description.trim() || name.trim(), domain.trim(), type));
  };

  const handleCopyAll = async () => {
    if (!faqs) return;
    const text = faqs.map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(-2);
      setTimeout(() => setCopiedIdx(-1), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">FAQ Generator</h1>
          <p className="tool-subtitle">
            Enter your product or service details and get a structured FAQ ready to publish — no sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Product / Service Name
              <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DoAide Support" />
            </label>
            <label className="calc-label">
              Short Description
              <input className="calc-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. AI-powered customer support platform" />
            </label>
            <label className="calc-label">
              Domain (optional)
              <input className="calc-input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. doaide.com" />
            </label>
            <label className="calc-label">
              Business Type
              <select className="calc-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="saas">SaaS / Software</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="service">Service Business</option>
              </select>
            </label>
            <button className="btn btn-primary" onClick={handleGenerate}>Generate FAQ</button>
          </div>

          {faqs && (
            <div className="calc-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
                  Generated FAQ ({faqs.length} questions)
                </h2>
                <button className="btn btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} onClick={handleCopyAll}>
                  {copiedIdx === -2 ? "Copied!" : "Copy All"}
                </button>
              </div>
              {faqs.map((f, i) => (
                <div key={i} style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : "none", paddingTop: i > 0 ? "1rem" : 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)" }}>Q: {f.q}</p>
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>A: {f.a}</p>
                </div>
              ))}
              <ShareButtons path="/tools/faq-generator" text="Generate a FAQ for your product in seconds — free tool by DoAide Support" />
            </div>
          )}

          <section className="tool-info">
            <h2>Why You Need a FAQ Page</h2>
            <p>
              A well-structured FAQ reduces ticket volume by 20-40%, improves customer self-service,
              and boosts SEO with long-tail keyword coverage. This generator creates a starter FAQ
              you can customize and publish on your site.
            </p>
          </section>

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>Want AI-powered answers that learn from your knowledge base?</p>
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
            name: "FAQ Generator",
            description: "Generate a structured FAQ for your product or service instantly — free, no sign-up required.",
            url: "https://support.doaide.com/tools/faq-generator",
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
