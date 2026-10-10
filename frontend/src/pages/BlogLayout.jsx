import { Link, Outlet } from "react-router-dom";

const ARTICLES = [
  {
    slug: "customer-support-response-time-guide",
    title: "Response Time Matters — How Fast Should Your Support Team Reply?",
    description: "Industry benchmarks for email, chat, and phone support response times. Learn what customers expect and how to measure and improve your team's speed.",
  },
  {
    slug: "building-a-knowledge-base-that-works",
    title: "Building a Knowledge Base That Actually Reduces Tickets",
    description: "Step-by-step guide to creating self-service documentation. What to include, how to structure articles, and how to measure deflection rates.",
  },
  {
    slug: "support-metrics-csat-nps-ces",
    title: "CSAT vs NPS vs CES — Which Support Metric Should You Track?",
    description: "Compare the three most common customer satisfaction metrics. When to use each one, how to calculate them, and benchmarks by industry.",
  },
  {
    slug: "ticket-deflection-strategies",
    title: "Ticket Deflection Strategies — Reduce Support Volume Without Losing Quality",
    description: "Practical strategies to deflect 20-50% of support tickets through self-service, AI chatbots, and smart contact forms while maintaining customer satisfaction.",
  },
  {
    slug: "sla-best-practices-guide",
    title: "SLA Best Practices — Setting and Meeting Service Level Agreements",
    description: "How to set realistic SLA targets, build escalation rules, and track compliance. Includes priority-based SLA templates and anti-patterns to avoid.",
  },
  {
    slug: "ai-customer-support-guide",
    title: "AI in Customer Support — A Practical Guide for 2026",
    description: "Where AI delivers the most ROI in support, a phased implementation playbook, and common mistakes to avoid. From agent assist to self-service chatbots.",
  },
  {
    slug: "best-helpdesk-software-india",
    title: "Best Helpdesk Software for Indian Businesses in 2026",
    description: "A comprehensive guide to choosing helpdesk software for Indian businesses — comparing features, INR pricing, multilingual support, and data residency options.",
  },
  {
    slug: "ticket-management-system-india",
    title: "Ticket Management System Guide for Indian Startups and SMBs",
    description: "Complete guide to implementing a ticket management system for Indian startups — from choosing the right tool to configuring workflows, SLAs, and automation.",
  },
  {
    slug: "customer-service-automation-ecommerce-india",
    title: "Customer Service Automation for Indian E-Commerce — A Complete Guide",
    description: "How Indian e-commerce businesses can automate customer service with WhatsApp chatbots, self-service knowledge bases, and COD-specific workflows.",
  },
];

export { ARTICLES };

export default function BlogLayout() {
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">&larr; Back to DoAide Support</Link>
        <h1 className="blog-title">DoAide Support Blog</h1>
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
