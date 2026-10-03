import { Link } from "react-router-dom";
import ShareButtons from "../../components/ShareButtons";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function SupportMetricsGuide() {
  usePageTitle("CSAT vs NPS vs CES — Which Support Metric Should You Track?");

  return (
    <article className="blog-article">
      <h1>CSAT vs NPS vs CES — Which Support Metric Should You Track?</h1>
      <p className="blog-meta">Updated October 2026 · 7 min read</p>

      <section>
        <h2>The Three Core Metrics</h2>
        <p>
          Customer satisfaction measurement boils down to three widely used metrics. Each answers
          a different question, and most teams should track at least two.
        </p>
      </section>

      <section>
        <h2>CSAT — Customer Satisfaction Score</h2>
        <p>
          <strong>Question:</strong> &quot;How satisfied were you with this interaction?&quot; (1-5 scale)
        </p>
        <p>
          <strong>Formula:</strong> (Satisfied responses / Total responses) &times; 100
        </p>
        <ul>
          <li>Best for: measuring individual interactions</li>
          <li>Benchmark: 75-85% is good, 90%+ is excellent</li>
          <li>Limitation: only captures the moment, not long-term loyalty</li>
        </ul>
      </section>

      <section>
        <h2>NPS — Net Promoter Score</h2>
        <p>
          <strong>Question:</strong> &quot;How likely are you to recommend us?&quot; (0-10 scale)
        </p>
        <p>
          <strong>Formula:</strong> % Promoters (9-10) &minus; % Detractors (0-6)
        </p>
        <ul>
          <li>Best for: measuring overall brand loyalty and advocacy</li>
          <li>Benchmark: 30+ is good, 50+ is excellent, 70+ is world-class</li>
          <li>Limitation: too broad for diagnosing specific support issues</li>
        </ul>
      </section>

      <section>
        <h2>CES — Customer Effort Score</h2>
        <p>
          <strong>Question:</strong> &quot;How easy was it to resolve your issue?&quot; (1-7 scale)
        </p>
        <p>
          <strong>Formula:</strong> Average of all responses
        </p>
        <ul>
          <li>Best for: identifying friction in your support process</li>
          <li>Benchmark: 5+ out of 7 is good</li>
          <li>Strongest predictor of customer loyalty among the three</li>
        </ul>
      </section>

      <section>
        <h2>Which Should You Use?</h2>
        <ul>
          <li><strong>Support teams:</strong> CSAT after each ticket + CES monthly</li>
          <li><strong>Product teams:</strong> NPS quarterly + CES after onboarding</li>
          <li><strong>Small teams:</strong> Start with CSAT — it&apos;s the simplest to implement</li>
        </ul>
      </section>

      <p>
        Check your support response quality with our <Link to="/checker">free response checker</Link> to
        improve the metrics that matter.
      </p>

      <ShareButtons
        path="/blog/support-metrics-csat-nps-ces"
        text="CSAT vs NPS vs CES — which support metric should you track? — DoAide Support"
      />
    </article>
  );
}
