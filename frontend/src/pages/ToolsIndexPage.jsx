import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TOOLS = [
  { path: "/checker", title: "Response Quality Checker", description: "Score your support replies on tone, completeness, and empathy.", icon: "✅" },
  { path: "/calculator", title: "Support ROI Calculator", description: "Calculate how much AI automation can save your team.", icon: "💰" },
  { path: "/templates-gallery", title: "Support Templates", description: "Browse free response templates for common support scenarios.", icon: "📁" },
  { path: "/tools/faq-generator", title: "FAQ Generator", description: "Generate a structured FAQ from your product or service description.", icon: "❓" },
  { path: "/tools/kb-template", title: "Knowledge Base Template", description: "Create a ready-to-use knowledge base article template.", icon: "📖" },
  { path: "/tools/priority-matrix", title: "Ticket Priority Matrix", description: "Build a priority matrix to triage support tickets consistently.", icon: "🎯" },
];

export default function ToolsIndexPage() {
  usePageTitle("Free Support Tools — No Sign-up Required");
  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Free Support Tools</h1>
          <p className="tool-subtitle">
            Check response quality, calculate ROI, generate FAQs, and more — no sign-up required.
          </p>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <Link key={t.path} to={t.path} className="tool-card">
                <span className="tool-card-icon">{t.icon}</span>
                <h2 className="tool-card-title">{t.title}</h2>
                <p className="tool-card-desc">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Support Tools",
            description: "Free customer support tools — response checker, ROI calculator, FAQ generator, and more.",
            url: "https://support.doaide.com/tools",
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
