import { Link } from 'react-router-dom';
import { Ticket, Bot, BookOpen, MessageCircle, Clock, BarChart3, ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: Ticket, title: 'Ticket Management', desc: 'Create, assign, track, and resolve support tickets with powerful filtering and SLA tracking.' },
  { icon: Bot, title: 'AI Auto-Response', desc: 'Leverage AI to suggest replies based on your knowledge base and ticket context.' },
  { icon: BookOpen, title: 'Knowledge Base', desc: 'Build a searchable library of articles to help customers find answers on their own.' },
  { icon: MessageCircle, title: 'Live Chat', desc: 'Real-time chat widget with WebSocket-powered messaging for instant support.' },
  { icon: Clock, title: 'SLA Tracking', desc: 'Set response and resolution time policies. Get alerts when SLAs are at risk.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Track ticket volume, response times, satisfaction scores, and agent performance.' },
];

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['Up to 100 tickets/mo', '1 Agent', 'Email support', 'Basic reports'], cta: 'Get Started' },
  { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited tickets', '10 Agents', 'AI auto-response', 'Live chat', 'SLA tracking', 'Advanced reports'], cta: 'Start Free Trial', featured: true },
  { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Unlimited agents', 'Custom integrations', 'Priority support', 'SSO/SAML', 'Dedicated account manager'], cta: 'Contact Sales' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-rose-500">Do</span>
            <span className="text-[var(--color-text)]">Aide</span>
            <span className="text-[var(--color-text-secondary)] text-sm ml-1 font-normal">Support</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">Pricing</Link>
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">AI-Powered</span>
            <br />Customer Support
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            Resolve tickets faster with AI-suggested replies, real-time chat, and a self-service knowledge base. Everything your support team needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register"><Button size="lg">Get Started Free <ArrowRight className="h-5 w-5" /></Button></Link>
            <Link to="/portal"><Button variant="outline" size="lg">Customer Portal</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">Everything You Need</h3>
          <p className="text-[var(--color-text-secondary)] text-center mb-16 max-w-xl mx-auto">A complete customer support platform with powerful features to keep your customers happy.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-rose-600/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-rose-600/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-rose-500" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-[var(--color-text)]">{title}</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">Simple Pricing</h3>
          <p className="text-[var(--color-text-secondary)] text-center mb-16">Start free, upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`p-8 rounded-xl border ${plan.featured ? 'border-rose-600 ring-1 ring-rose-600' : 'border-[var(--color-border)]'} bg-[var(--color-surface)]`}>
                {plan.featured && <p className="text-xs font-semibold text-rose-500 uppercase mb-4">Most Popular</p>}
                <h4 className="text-xl font-bold text-[var(--color-text)] mb-2">{plan.name}</h4>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[var(--color-text)]">{plan.price}</span>
                  <span className="text-[var(--color-text-secondary)]">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Check className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button variant={plan.featured ? 'primary' : 'outline'} className="w-full">{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} DoAide Support. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--color-text-secondary)]">
            <a href="#" className="hover:text-[var(--color-text)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-text)]">Terms</a>
            <a href="#" className="hover:text-[var(--color-text)]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
