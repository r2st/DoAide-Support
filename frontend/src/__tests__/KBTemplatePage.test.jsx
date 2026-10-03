import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import KBTemplatePage from "../pages/KBTemplatePage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("KBTemplatePage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><KBTemplatePage /></MemoryRouter>);
    expect(screen.getByText("Knowledge Base Template")).toBeInTheDocument();
  });

  it("shows article type selector", () => {
    render(<MemoryRouter><KBTemplatePage /></MemoryRouter>);
    expect(screen.getByText("Article Type")).toBeInTheDocument();
  });

  it("generates a template on button click", async () => {
    render(<MemoryRouter><KBTemplatePage /></MemoryRouter>);
    const titleInput = screen.getByPlaceholderText("e.g. How to Reset Your Password");
    await userEvent.type(titleInput, "Test Article");
    await userEvent.click(screen.getByText("Generate Template"));
    expect(screen.getByText("Generated Template")).toBeInTheDocument();
    expect(screen.getByText(/Test Article/)).toBeInTheDocument();
  });

  it("shows copy button after generation", async () => {
    render(<MemoryRouter><KBTemplatePage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Generate Template"));
    expect(screen.getByText("Copy Markdown")).toBeInTheDocument();
  });
});
