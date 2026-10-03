import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ToolsIndexPage from "../pages/ToolsIndexPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("ToolsIndexPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    expect(screen.getByText("Free Support Tools")).toBeInTheDocument();
  });

  it("lists all tool cards", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    expect(screen.getByText("FAQ Generator")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Base Template")).toBeInTheDocument();
    expect(screen.getByText("Ticket Priority Matrix")).toBeInTheDocument();
    expect(screen.getByText("Response Quality Checker")).toBeInTheDocument();
    expect(screen.getByText("Support ROI Calculator")).toBeInTheDocument();
  });

  it("renders tool cards as links", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    const faqLink = screen.getByText("FAQ Generator").closest("a");
    expect(faqLink).toHaveAttribute("href", "/tools/faq-generator");
  });
});
