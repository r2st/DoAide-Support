/**
 * SEO metadata for every public, indexable route. Shared by the useSEO hook
 * (wired in App) and scripts/prerender-routes.mjs (static HTML, sitemap,
 * serve.json), so keep it plain JS with no JSX or browser-only imports.
 * Sign-in pages, the customer portal and the agent app are deliberately absent.
 */

import { ARTICLES } from './data/blogArticles.js'

export const SITE = {
  name: 'DoAide Support',
  baseUrl: 'https://support.doaide.com',
  ogImage: 'https://support.doaide.com/og-support.png',
}

const ORG = { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' }

// Product structured data, home page only (moved from index.html).
const HOME_GRAPH = [
    {
      "@type": "SoftwareApplication",
      "name": "DoAide Support",
      "url": "https://support.doaide.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "AI-powered customer support with ticket management, auto-response, knowledge base, and live chat.",
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "name": "Free"
        },
        {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "USD",
          "name": "Pro"
        },
        {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "USD",
          "name": "Enterprise"
        }
      ]
    }
  ]

// Fit "<title> | DoAide Support" into ~70 chars; long titles go without it.
const withSuffix = (title) => (`${title} | DoAide Support`.length <= 70 ? `${title} | DoAide Support` : title)

const tool = (path, h1, title, description) => ({ path, h1, title: withSuffix(title), description, kind: 'tool' })

export const routes = [
  {
    path: '/',
    kind: 'home',
    h1: 'AI-Powered Customer Support',
    title: 'DoAide Support — AI Helpdesk, Ticketing & Live Chat',
    description:
      'Resolve tickets faster with AI-suggested replies, real-time chat and a self-service knowledge base. Free for up to 100 tickets a month.',
  },
  {
    path: '/pricing',
    kind: 'page',
    h1: 'Simple, Transparent Pricing',
    title: withSuffix('Pricing — Free, Pro $29 & Enterprise $99'),
    description:
      'Free: 100 tickets a month and 1 agent. Pro ($29/mo): unlimited tickets and 10 agents with AI auto-responses. Enterprise ($99/mo): unlimited agents.',
  },
  {
    path: '/tools',
    kind: 'page',
    h1: 'Free Support Tools',
    title: withSuffix('Free Customer Support Tools — No Sign-up'),
    description: 'Check response quality, calculate ROI, generate FAQs, SLAs and ticket templates, and more — no sign-up required.',
  },
  tool('/checker', 'Response Quality Checker', 'Support Response Checker — Score Your Replies',
    'Paste a support reply and get instant feedback on tone, completeness and empathy. Free response quality checker, no sign-up.'),
  tool('/calculator', 'Support ROI Calculator', 'Support ROI Calculator — AI Automation Savings',
    'Calculate how much AI automation can save your support team in agent hours and cost. Free support ROI calculator.'),
  {
    path: '/templates-gallery',
    kind: 'page',
    h1: 'Support Response Templates',
    title: withSuffix('Free Customer Support Response Templates'),
    description: 'Copy and customise six support reply templates: billing, technical issues, refunds, onboarding, escalation and feedback.',
  },
  tool('/tools/faq-generator', 'FAQ Generator', 'FAQ Generator — Create a Product FAQ Page',
    'Enter your product or service details and get a structured FAQ ready to publish. Free FAQ generator, no sign-up required.'),
  tool('/tools/kb-template', 'Knowledge Base Template', 'Knowledge Base Article Template Generator',
    'Generate a structured knowledge base article template in Markdown, ready to fill in and publish. Free, no sign-up.'),
  tool('/tools/priority-matrix', 'Ticket Priority Matrix', 'Ticket Priority Matrix Builder',
    'Build a priority matrix to triage support tickets consistently across your team, by impact and urgency. Free, no sign-up.'),
  tool('/tools/ticket-template', 'Ticket Template Generator', 'Support Ticket Template Generator',
    'Generate structured support ticket templates for bug reports, feature requests, billing issues and more. Free, no sign-up.'),
  tool('/tools/sla-calculator', 'SLA Calculator', 'SLA Calculator — Response & Resolution Targets',
    'Define SLA targets, calculate business-hours deadlines and measure compliance rates. Free SLA calculator, no sign-up required.'),
  tool('/tools/csat-survey', 'Customer Satisfaction Survey Creator', 'CSAT, NPS & CES Survey Creator',
    'Build CSAT, NPS or CES surveys for your support team in seconds and copy them into your helpdesk. Free, no sign-up.'),
  tool('/tools/response-time-analyzer', 'Response Time Analyzer', 'Support Response Time Analyzer & Benchmarks',
    'Enter response times by channel and get benchmarked grades, volume-weighted averages and improvement tips. Free, no sign-up.'),
  {
    path: '/embed',
    kind: 'page',
    h1: 'Embed Support Tools on Your Website',
    title: withSuffix('Embed Free Support Tools on Your Website'),
    description:
      'Add a free response checker, templates gallery or ROI calculator to your website with one line of code.',
  },
  {
    path: '/blog',
    kind: 'blog',
    h1: 'DoAide Support Blog',
    title: withSuffix('Customer Support Blog — Guides & Benchmarks'),
    description:
      'Guides on response times, knowledge bases, CSAT/NPS/CES, SLAs, ticket deflection and AI in customer support.',
  },
  ...ARTICLES.map((a) => ({
    path: `/blog/${a.slug}`,
    kind: 'post',
    h1: a.title,
    title: withSuffix(a.title),
    description: a.description,
    published: a.published,
  })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  const url = canonicalFor(route.path)
  switch (route.kind) {
    case 'home':
      return { '@context': 'https://schema.org', '@graph': HOME_GRAPH }
    case 'tool':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: route.h1,
        url,
        description: route.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: canonicalFor('/') },
      }
    case 'post':
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: route.h1,
        description: route.description,
        url,
        mainEntityOfPage: url,
        datePublished: route.published,
        author: ORG,
        publisher: ORG,
      }
    default:
      return {
        '@context': 'https://schema.org',
        '@type': route.kind === 'blog' ? 'Blog' : 'WebPage',
        name: route.h1,
        url,
        description: route.description,
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: canonicalFor('/') },
      }
  }
}
