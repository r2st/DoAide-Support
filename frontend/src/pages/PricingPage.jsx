import { Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['Up to 100 tickets/mo', '1 Agent', 'Email support', 'Basic reports', 'Customer portal'], cta: 'Get Started' },
  { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited tickets', '10 Agents', 'AI auto-response', 'Live chat widget', 'SLA tracking', 'Advanced reports', 'Knowledge base', 'Canned responses', 'Email integration'], cta: 'Start Free Trial', featured: true },
  { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Unlimited agents', 'Custom integrations', 'Priority support', 'SSO/SAML', 'Dedicated account manager', 'Custom branding', 'API access', '99.9% SLA guarantee'], cta: 'Contact Sales' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">Start free, scale as you grow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`p-8 rounded-xl border ${plan.featured ? 'border-rose-600 ring-1 ring-rose-600' : 'border-[var(--color-border)]'} bg-[var(--color-surface)]`}>
              {plan.featured && <p className="text-xs font-semibold text-rose-500 uppercase mb-4">Most Popular</p>}
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{plan.name}</h3>
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
    </div>
  );
}
