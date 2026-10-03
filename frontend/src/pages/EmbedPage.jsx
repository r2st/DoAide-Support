import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { copyToClipboard, embedSnippet } from "../lib/share";
import { track } from "../lib/track";

const TOOLS = [
  { key: "checker", label: "Response Checker", desc: "Let visitors check support response quality" },
  { key: "templates", label: "Response Templates", desc: "Showcase support response templates" },
  { key: "calculator", label: "ROI Calculator", desc: "Let visitors calculate support automation savings" },
];

export default function EmbedPage() {
  usePageTitle("Embed Support Tools on Your Website — Free Widget");
  const [tool, setTool] = useState("checker");
  const [copied, setCopied] = useState(false);

  const snippet = embedSnippet(tool);

  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet);
    if (ok) {
      track("embed_copy", { tool });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Embed Support Tools on Your Website</h1>
          <p className="tool-subtitle">
            Add a free response checker, templates gallery, or ROI calculator to your
            website with one line of code.
          </p>

          <div className="calc-card">
            <div className="embed-tools" role="group" aria-label="Choose tool to embed">
              {TOOLS.map((t) => (
                <button
                  key={t.key}
                  className={`embed-tool-btn${tool === t.key ? " active" : ""}`}
                  onClick={() => setTool(t.key)}
                >
                  <strong>{t.label}</strong>
                  <span>{t.desc}</span>
                </button>
              ))}
            </div>

            <label className="calc-label">
              Copy this code to your website
              <pre className="embed-code">{snippet}</pre>
            </label>

            <button onClick={handleCopy} className="btn btn-primary">
              {copied ? "Copied!" : "Copy embed code"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
