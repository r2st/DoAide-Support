import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Bot, BookOpen, MessageCircle, Clock, BarChart3, Check } from 'lucide-react';

const DOAIDE_PRODUCTS = [
  { name: "Proposals", url: "https://proposals.doaide.com" },
  { name: "Scheduler", url: "https://scheduler.doaide.com" },
  { name: "Payroll", url: "https://payroll.doaide.com" },
  { name: "Inventory", url: "https://inventory.doaide.com" },
  { name: "Support", url: "https://support.doaide.com" },
  { name: "Analytics", url: "https://analytics-app.doaide.com" },
  { name: "GST", url: "https://gst.doaide.com" },
  { name: "Desk", url: "https://desk.doaide.com" },
  { name: "Jobs", url: "https://job.doaide.com" },
  { name: "409A", url: "https://409a.doaide.com" },
  { name: "Pulse", url: "https://pulse.doaide.com" },
  { name: "Med", url: "https://med.doaide.com" },
  { name: "Realty", url: "https://realty.doaide.com" },
  { name: "Reach", url: "https://reach.doaide.com" },
  { name: "Trade", url: "https://trade.doaide.com" },
];

function RobotFace({ size = 32, color = "#F0B429" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <line x1="16" y1="6" x2="16" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="1.5" r="1.5" fill={color} />
      <rect x="5" y="6" width="22" height="17" rx="5" fill={color} />
      <ellipse cx="11" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <ellipse cx="21" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <circle cx="11.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <circle cx="21.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <path d="M12 19Q16 22 20 19" stroke="#0A0A0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="1" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
      <rect x="27" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
    </svg>
  );
}

const features = [
  { icon: Ticket, title: 'Ticket Management', desc: 'Create, assign, prioritize, and resolve support tickets with powerful filtering and custom workflows.' },
  { icon: Bot, title: 'AI Auto-Response', desc: 'AI suggests replies based on your knowledge base articles and similar past resolutions. Respond faster.' },
  { icon: BookOpen, title: 'Knowledge Base', desc: 'Build a searchable library of help articles so customers find answers without waiting for an agent.' },
  { icon: MessageCircle, title: 'Live Chat', desc: 'Real-time chat widget with WebSocket-powered messaging for instant customer support on your site.' },
  { icon: Clock, title: 'SLA Tracking', desc: 'Set response and resolution time policies. Get alerts when SLAs are at risk so nothing slips.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Track ticket volume, response times, CSAT scores, and agent performance. Data-driven support.' },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Set up your helpdesk", desc: "Configure ticket categories, SLA policies, and team assignments. Add your knowledge base articles." },
  { step: "2", title: "Customers submit tickets or chat live", desc: "Customers reach you via the portal, email, or live chat widget. Everything lands in one unified inbox." },
  { step: "3", title: "AI helps your team resolve faster", desc: "AI suggests replies, surfaces relevant KB articles, and tracks SLA compliance so your team stays ahead." },
];

const plans = [
  { name: 'Free', price: '$0', period: '/month', desc: 'For small teams getting started', features: ['100 tickets/month', '1 Agent', 'Email support', 'Basic reports'], cta: 'Get Started' },
  { name: 'Pro', price: '$29', period: '/month', desc: 'For growing support teams', features: ['Unlimited tickets', '10 Agents', 'AI auto-response', 'Live chat', 'SLA tracking', 'Advanced reports'], cta: 'Start Free Trial', featured: true },
  { name: 'Enterprise', price: '$99', period: '/month', desc: 'For large organizations', features: ['Everything in Pro', 'Unlimited agents', 'Custom integrations', 'SSO/SAML', 'Priority support', 'Dedicated account manager'], cta: 'Contact Sales' },
];

const TESTIMONIALS = [
  { name: "Jennifer W.", role: "Support Lead", quote: "AI suggestions cut our average response time from 4 hours to 30 minutes. Customers are noticeably happier." },
  { name: "Carlos M.", role: "CX Manager", quote: "The knowledge base deflected 40% of our tickets. Customers find answers without waiting for an agent." },
  { name: "Anika P.", role: "Director of Support", quote: "SLA tracking keeps our team accountable. We haven't breached a response SLA in three months." },
];

const FAQ_ITEMS = [
  { q: "How does the AI auto-response work?", a: "When an agent opens a ticket, AI analyzes the issue and suggests relevant replies based on your knowledge base articles and similar past tickets. Agents review and send with one click." },
  { q: "Can customers submit tickets without an account?", a: "Yes. The customer portal allows ticket submission with just an email address. No registration required. Customers get email updates on their ticket status." },
  { q: "Does it include live chat?", a: "Yes. Pro plans include a real-time chat widget you can embed on your website. WebSocket-powered for instant messaging between agents and customers." },
  { q: "What are SLA policies?", a: "SLA (Service Level Agreement) policies define target response and resolution times for different ticket priorities. DoAide tracks compliance and alerts your team before deadlines." },
  { q: "Is there a free plan?", a: "Yes. The Free plan includes 100 tickets per month for 1 agent with email support and basic reports. No credit card required." },
  { q: "Can I build a knowledge base?", a: "Yes. Create and organize help articles with rich text formatting, images, and search. Customers can browse the knowledge base from your support portal." },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="py-20 px-4 sm:px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
              <dt>
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                  aria-expanded={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.q}
                  <span className="ml-4 text-[#F0B429] text-xl flex-shrink-0">{openIndex === i ? "−" : "+"}</span>
                </button>
              </dt>
              {openIndex === i && (
                <dd className="px-5 pb-5 text-[var(--color-text-secondary)] leading-relaxed">{item.a}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="https://doaide.com" className="flex items-center gap-2.5 no-underline">
            <RobotFace size={28} color="#F0B429" />
            <span className="text-xl font-bold text-[var(--color-text)]">
              DoAide <span className="text-[#F0B429]">Support</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] no-underline">Pricing</Link>
            <Link to="/login" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] no-underline">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-[#F0B429] text-[#0A0A0B] text-sm font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#F0B429]">AI-Powered</span>
              <br />
              <span className="text-[var(--color-text)]">Customer Support</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Resolve tickets faster with AI-suggested replies, real-time chat,
              and a self-service knowledge base. Everything your support team needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-3.5 bg-[#F0B429] text-[#0A0A0B] text-lg font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline">
                Get Started Free
              </Link>
              <Link to="/portal" className="px-8 py-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-lg rounded-lg hover:bg-[var(--color-surface)] transition-colors no-underline">
                Customer Portal
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 border-t border-[var(--color-border)]" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-heading" className="text-3xl font-bold text-center text-[var(--color-text)] mb-4">
              Everything You Need for World-Class Support
            </h2>
            <p className="text-[var(--color-text-secondary)] text-center mb-14 max-w-xl mx-auto">
              A complete customer support platform with powerful features to keep your customers happy and your team efficient.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#F0B429]/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-[#F0B429]/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[#F0B429]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">{title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 border-t border-[var(--color-border)]" aria-labelledby="how-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="how-heading" className="text-3xl font-bold text-center text-[var(--color-text)] mb-14">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0B429] text-[#0A0A0B] text-xl font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 px-4 sm:px-6 border-t border-[var(--color-border)]" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="pricing-heading" className="text-3xl font-bold text-center text-[var(--color-text)] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[var(--color-text-secondary)] text-center mb-14">Start free. Upgrade when you need more.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.name} className={`p-8 rounded-xl border ${plan.featured ? 'border-[#F0B429] ring-2 ring-[#F0B429]/20' : 'border-[var(--color-border)]'} bg-[var(--color-surface)]`}>
                  {plan.featured && <p className="text-xs font-semibold text-[#F0B429] uppercase tracking-wide mb-2">Most Popular</p>}
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{plan.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{plan.desc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-[var(--color-text)]">{plan.price}</span>
                    <span className="text-[var(--color-text-secondary)]">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Check className="h-4 w-4 text-[#F0B429] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors no-underline ${plan.featured ? 'bg-[#F0B429] text-[#0A0A0B] hover:bg-[#D4A017]' : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]'}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 border-t border-[var(--color-border)]" aria-labelledby="testimonials-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-center text-[var(--color-text)] mb-14">
              Trusted by Support Teams Worldwide
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.name} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <footer>
                    <strong className="text-[var(--color-text)]">{t.name}</strong>
                    <span className="block text-sm text-[var(--color-text-secondary)]">{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <FaqSection />

        <section className="py-20 px-4 sm:px-6 text-center border-t border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">Ready to Transform Your Customer Support?</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">Start resolving tickets faster today. Free forever for up to 100 tickets per month.</p>
          <Link to="/register" className="inline-block px-8 py-3.5 bg-[#F0B429] text-[#0A0A0B] text-lg font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline">
            Get Started Free
          </Link>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "DoAide Support",
            description: "AI-powered customer support platform with ticket management, live chat, knowledge base, and SLA tracking.",
            url: "https://support.doaide.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: [
              { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
              { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD", billingIncrement: "P1M" },
              { "@type": "Offer", name: "Enterprise", price: "99", priceCurrency: "USD", billingIncrement: "P1M" },
            ],
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "124", bestRating: "5" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Apprend Technologies",
            url: "https://doaide.com",
            logo: "https://doaide.com/logo.png",
            sameAs: [],
            contactPoint: { "@type": "ContactPoint", email: "support@doaide.com", contactType: "customer support" },
          }),
        }}
      />

      <footer className="border-t border-[var(--color-border)] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/pricing" className="block text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline">Pricing</Link>
                <a href="#features-heading" className="block text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("features-heading")?.scrollIntoView({ behavior: "smooth" }); }}>Features</a>
                <a href="#faq-heading" className="block text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("faq-heading")?.scrollIntoView({ behavior: "smooth" }); }}>FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="https://doaide.com" className="block text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline">About DoAide</a>
                <a href="mailto:support@doaide.com" className="block text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline">Contact</a>
              </div>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">DoAide Products</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {DOAIDE_PRODUCTS.map((p) => (
                  <a key={p.name} href={p.url} className="text-[var(--color-text-secondary)] hover:text-[#F0B429] no-underline">{p.name}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
            <a href="https://doaide.com" className="flex items-center gap-2 no-underline">
              <RobotFace size={16} color="#F0B429" />
              <span className="text-sm text-[var(--color-text-secondary)]">doaide.com</span>
            </a>
            <span className="text-sm text-[var(--color-text-secondary)]">&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
