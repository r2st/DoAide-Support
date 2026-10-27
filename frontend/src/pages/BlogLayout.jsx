import { Link, Outlet, useLocation } from "react-router-dom";
import { ARTICLES } from "../data/blogArticles";

export { ARTICLES };

export default function BlogLayout() {
  // Posts render their own h1, so the blog name is only the h1 on /blog.
  const isIndex = useLocation().pathname.replace(/\/+$/, "") === "/blog";
  const Title = isIndex ? "h1" : "p";
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">&larr; Back to DoAide Support</Link>
        <Title className="blog-title">DoAide Support Blog</Title>
        <p className="blog-subtitle">Guides and resources for customer support teams</p>
      </header>
      <Outlet />
    </div>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <span className="blog-read-more">Read more &rarr;</span>
        </Link>
      ))}
    </div>
  );
}
