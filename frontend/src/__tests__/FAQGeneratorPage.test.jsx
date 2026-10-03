import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import FAQGeneratorPage from "../pages/FAQGeneratorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("FAQGeneratorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><FAQGeneratorPage /></MemoryRouter>);
    expect(screen.getByText("FAQ Generator")).toBeInTheDocument();
  });

  it("shows input fields", () => {
    render(<MemoryRouter><FAQGeneratorPage /></MemoryRouter>);
    expect(screen.getByText("Product / Service Name")).toBeInTheDocument();
    expect(screen.getByText("Business Type")).toBeInTheDocument();
  });

  it("generates FAQs on button click", async () => {
    render(<MemoryRouter><FAQGeneratorPage /></MemoryRouter>);
    const nameInput = screen.getByPlaceholderText("e.g. DoAide Support");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "TestApp");
    await userEvent.click(screen.getByText("Generate FAQ"));
    expect(screen.getByText(/Generated FAQ/)).toBeInTheDocument();
    expect(screen.getByText(/What is TestApp/)).toBeInTheDocument();
  });

  it("does not generate when name is empty", async () => {
    render(<MemoryRouter><FAQGeneratorPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Generate FAQ"));
    expect(screen.queryByText(/Generated FAQ/)).not.toBeInTheDocument();
  });
});
