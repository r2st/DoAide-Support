import { Link, useLocation } from "react-router-dom";

const TOOLS = [
  { path: "/tools", label: "All Tools" },
  { path: "/checker", label: "Response Checker" },
  { path: "/templates-gallery", label: "Templates" },
  { path: "/calculator", label: "ROI Calculator" },
];

export default function ToolsNav() {
  const { pathname } = useLocation();
  return (
    <nav className="tools-nav">
      <Link to="/" className="tools-nav-brand">
        <em>DoAide</em>&nbsp;Support
      </Link>
      <div className="tools-nav-links">
        {TOOLS.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className={`tools-nav-link${pathname === t.path ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="tools-nav-cta">Get Started Free</Link>
    </nav>
  );
}
