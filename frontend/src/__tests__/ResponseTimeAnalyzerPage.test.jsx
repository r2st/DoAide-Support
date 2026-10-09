import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ResponseTimeAnalyzerPage from "../pages/ResponseTimeAnalyzerPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("ResponseTimeAnalyzerPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><ResponseTimeAnalyzerPage /></MemoryRouter>);
    expect(screen.getByText("Response Time Analyzer")).toBeInTheDocument();
  });

  it("shows add channel button", () => {
    render(<MemoryRouter><ResponseTimeAnalyzerPage /></MemoryRouter>);
    expect(screen.getByText("+ Add Channel")).toBeInTheDocument();
  });

  it("analyzes response times on button click", async () => {
    render(<MemoryRouter><ResponseTimeAnalyzerPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Analyze"));
    expect(screen.getByText("Analysis Results")).toBeInTheDocument();
    expect(screen.getByText("Volume-Weighted Avg Response")).toBeInTheDocument();
  });

  it("adds additional channels", async () => {
    render(<MemoryRouter><ResponseTimeAnalyzerPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("+ Add Channel"));
    const removeButtons = screen.getAllByLabelText("Remove channel");
    expect(removeButtons).toHaveLength(2);
  });
});
