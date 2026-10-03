import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TicketPriorityMatrixPage from "../pages/TicketPriorityMatrixPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("TicketPriorityMatrixPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><TicketPriorityMatrixPage /></MemoryRouter>);
    expect(screen.getByText("Ticket Priority Matrix")).toBeInTheDocument();
  });

  it("shows the priority matrix table", () => {
    render(<MemoryRouter><TicketPriorityMatrixPage /></MemoryRouter>);
    expect(screen.getByText("Priority Matrix")).toBeInTheDocument();
    expect(screen.getAllByText("P1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("P4").length).toBeGreaterThan(0);
  });

  it("shows SLA customization inputs", () => {
    render(<MemoryRouter><TicketPriorityMatrixPage /></MemoryRouter>);
    expect(screen.getByText("Customize SLA Targets")).toBeInTheDocument();
  });

  it("shows priority definitions", () => {
    render(<MemoryRouter><TicketPriorityMatrixPage /></MemoryRouter>);
    expect(screen.getByText(/P1 — Emergency/)).toBeInTheDocument();
    expect(screen.getByText(/P4 — Low/)).toBeInTheDocument();
  });

  it("shows copy as CSV button", () => {
    render(<MemoryRouter><TicketPriorityMatrixPage /></MemoryRouter>);
    expect(screen.getByText("Copy as CSV")).toBeInTheDocument();
  });
});
