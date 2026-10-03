import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

function parseParams(search) {
  const p = new URLSearchParams(search);
  return {
    tickets: parseInt(p.get("tickets"), 10) || 500,
    handleTime: parseInt(p.get("handleTime"), 10) || 15,
    agentCost: parseInt(p.get("agentCost"), 10) || 25,
    automationRate: parseInt(p.get("automationRate"), 10) || 40,
  };
}

function calcUrl(tickets, handleTime, agentCost, automationRate) {
  return `/calculator?tickets=${tickets}&handleTime=${handleTime}&agentCost=${agentCost}&automationRate=${automationRate}`;
}

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function ROICalculatorPage() {
  usePageTitle("Free Support ROI Calculator — Measure AI Automation Savings");
  const location = useLocation();
  const navigate = useNavigate();

  const initial = parseParams(location.search);
  const [tickets, setTickets] = useState(initial.tickets);
  const [handleTime, setHandleTime] = useState(initial.handleTime);
  const [agentCost, setAgentCost] = useState(initial.agentCost);
  const [automationRate, setAutomationRate] = useState(initial.automationRate);

  const totalHoursMonth = Math.round((tickets * handleTime) / 60);
  const currentCostMonth = Math.round(totalHoursMonth * agentCost);
  const automatedTickets = Math.round(tickets * (automationRate / 100));
  const savedHoursMonth = Math.round((automatedTickets * handleTime) / 60);
  const savingsMonth = Math.round(savedHoursMonth * agentCost);
  const savingsYear = savingsMonth * 12;

  useEffect(() => {
    const url = calcUrl(tickets, handleTime, agentCost, automationRate);
    if (location.search !== url.replace("/calculator", "")) {
      navigate(url, { replace: true });
    }
  }, [tickets, handleTime, agentCost, automationRate, navigate, location.search]);

  useEffect(() => {
    track("roi_calculate", { tickets, handleTime, automationRate, savingsMonth });
  }, [tickets, handleTime, automationRate, savingsMonth]);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Support ROI Calculator</h1>
          <p className="tool-subtitle">
            Calculate how much AI automation can save your support team. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Monthly Ticket Volume
              <input type="number" className="calc-input" value={tickets} onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" />
            </label>

            <label className="calc-label">
              Avg Handle Time (minutes)
              <input type="number" className="calc-input" value={handleTime} onChange={(e) => setHandleTime(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" max="120" />
            </label>

            <label className="calc-label">
              Agent Cost per Hour ($)
              <input type="number" className="calc-input" value={agentCost} onChange={(e) => setAgentCost(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" step="5" />
            </label>

            <label className="calc-label">
              AI Automation Rate (%)
              <input type="range" value={automationRate} onChange={(e) => setAutomationRate(parseInt(e.target.value, 10))} min="10" max="80" step="5" style={{ width: "100%", marginTop: "0.4rem" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#9CA3AF" }}>
                <span>10%</span>
                <strong style={{ color: "#F0B429" }}>{automationRate}%</strong>
                <span>80%</span>
              </div>
            </label>

            <div className="calc-result" aria-live="polite">
              <div className="calc-result-row">
                <span>Current Support Hours/Month</span>
                <strong>{totalHoursMonth.toLocaleString()}</strong>
              </div>
              <div className="calc-result-row">
                <span>Current Monthly Cost</span>
                <strong>{fmt(currentCostMonth)}</strong>
              </div>
              <div className="calc-result-row">
                <span>Tickets Automated ({automationRate}%)</span>
                <strong>{automatedTickets.toLocaleString()}</strong>
              </div>
              <div className="calc-result-row">
                <span>Hours Saved/Month</span>
                <strong>{savedHoursMonth.toLocaleString()}</strong>
              </div>
              <div className="calc-result-row calc-total">
                <span>Monthly Savings</span>
                <strong>{fmt(savingsMonth)}</strong>
              </div>
              <div className="calc-result-row calc-total">
                <span>Annual Savings</span>
                <strong>{fmt(savingsYear)}</strong>
              </div>

              <ShareButtons
                path={calcUrl(tickets, handleTime, agentCost, automationRate)}
                text={`Our support team could save ${fmt(savingsYear)}/year with AI automation — calculate yours free on DoAide Support`}
              />
            </div>
          </div>

          <section className="tool-info">
            <h2>Understanding Support ROI</h2>
            <p>
              AI-powered support tools can automate 30-60% of common tickets — password resets,
              order status, FAQ answers, and simple troubleshooting. The savings come from reduced
              handle time, fewer tickets requiring human agents, and faster first-response times.
            </p>
            <h3>What Can Be Automated?</h3>
            <ul>
              <li>FAQ and knowledge base lookups</li>
              <li>Order status and tracking inquiries</li>
              <li>Password resets and account access</li>
              <li>Basic troubleshooting flows</li>
              <li>Ticket routing and categorization</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
