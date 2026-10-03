import { Link } from "react-router-dom";
import ShareButtons from "../../components/ShareButtons";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function KnowledgeBaseGuide() {
  usePageTitle("Building a Knowledge Base That Actually Reduces Tickets");

  return (
    <article className="blog-article">
      <h1>Building a Knowledge Base That Actually Reduces Tickets</h1>
      <p className="blog-meta">Updated October 2026 · 9 min read</p>

      <section>
        <h2>Why Most Knowledge Bases Fail</h2>
        <p>
          A knowledge base that nobody reads is worse than not having one — it costs maintenance effort
          without deflecting tickets. The most common failures: poor search, outdated articles, and
          content written for internal teams instead of customers.
        </p>
      </section>

      <section>
        <h2>What to Document First</h2>
        <p>
          Start with your top 10 ticket categories. These typically account for 60-80% of total volume.
          Check your ticket tags or manually review the last 100 tickets to find patterns.
        </p>
        <ul>
          <li>Account setup and onboarding steps</li>
          <li>Billing, payment, and subscription questions</li>
          <li>Password reset and account recovery</li>
          <li>Feature how-tos for the most-used features</li>
          <li>Known issues and workarounds</li>
        </ul>
      </section>

      <section>
        <h2>Article Structure</h2>
        <p>
          Every article should follow the same structure: clear title as a question or task,
          one-paragraph summary, step-by-step instructions with screenshots, and a &quot;still need
          help?&quot; link to contact support.
        </p>
      </section>

      <section>
        <h2>Measuring Deflection</h2>
        <p>
          Deflection rate = (knowledge base views that did NOT lead to a ticket) / total views.
          A good deflection rate is 40-60%. Track which articles have low ratings and high ticket
          follow-ups — those need rewriting.
        </p>
      </section>

      <section>
        <h2>Keeping Content Fresh</h2>
        <ul>
          <li>Review all articles quarterly — mark each as current, needs update, or archive</li>
          <li>Assign article ownership to team members</li>
          <li>Add &quot;last updated&quot; dates visible to customers</li>
          <li>Set up alerts when products change that affect documented features</li>
        </ul>
      </section>

      <p>
        Use our <Link to="/templates-gallery">support response templates</Link> alongside your
        knowledge base for consistent, professional replies.
      </p>

      <ShareButtons
        path="/blog/building-a-knowledge-base-that-works"
        text="How to build a knowledge base that actually reduces support tickets — DoAide Support"
      />
    </article>
  );
}
