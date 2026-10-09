import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TicketTemplateGeneratorPage from "../pages/TicketTemplateGeneratorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("TicketTemplateGeneratorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><TicketTemplateGeneratorPage /></MemoryRouter>);
    expect(screen.getByText("Ticket Template Generator")).toBeInTheDocument();
  });

  it("shows category selector", () => {
    render(<MemoryRouter><TicketTemplateGeneratorPage /></MemoryRouter>);
    expect(screen.getByText("Ticket Category")).toBeInTheDocument();
  });

  it("generates a bug report template", async () => {
    render(<MemoryRouter><TicketTemplateGeneratorPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Generate Template"));
    expect(screen.getByText("Generated Template")).toBeInTheDocument();
    expect(screen.getByText(/Steps to Reproduce/)).toBeInTheDocument();
  });

  it("includes internal fields when checked", async () => {
    render(<MemoryRouter><TicketTemplateGeneratorPage /></MemoryRouter>);
    await userEvent.click(screen.getByLabelText("Include internal agent fields"));
    await userEvent.click(screen.getByText("Generate Template"));
    expect(screen.getByText(/Internal Fields/)).toBeInTheDocument();
  });
});
