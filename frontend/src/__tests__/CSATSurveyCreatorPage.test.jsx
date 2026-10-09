import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CSATSurveyCreatorPage from "../pages/CSATSurveyCreatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("CSATSurveyCreatorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><CSATSurveyCreatorPage /></MemoryRouter>);
    expect(screen.getByText("Customer Satisfaction Survey Creator")).toBeInTheDocument();
  });

  it("shows survey type selector", () => {
    render(<MemoryRouter><CSATSurveyCreatorPage /></MemoryRouter>);
    expect(screen.getByText("Survey Type")).toBeInTheDocument();
  });

  it("creates a CSAT survey on button click", async () => {
    render(<MemoryRouter><CSATSurveyCreatorPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Create Survey"));
    expect(screen.getByText(/How satisfied are you/)).toBeInTheDocument();
    expect(screen.getByText(/Was your issue resolved/)).toBeInTheDocument();
  });

  it("includes custom questions when provided", async () => {
    render(<MemoryRouter><CSATSurveyCreatorPage /></MemoryRouter>);
    const inputs = screen.getAllByPlaceholderText(/Custom question/);
    await userEvent.type(inputs[0], "How did you hear about us?");
    await userEvent.click(screen.getByText("Create Survey"));
    expect(screen.getByText(/How did you hear about us/)).toBeInTheDocument();
  });
});
