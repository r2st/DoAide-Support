import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SLACalculatorPage from "../pages/SLACalculatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/track", () => ({ track: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: () => "#",
  twitterUrl: () => "#",
  copyToClipboard: vi.fn(),
}));

describe("SLACalculatorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><SLACalculatorPage /></MemoryRouter>);
    expect(screen.getByText("SLA Calculator")).toBeInTheDocument();
  });

  it("shows business hours section", () => {
    render(<MemoryRouter><SLACalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Business Hours")).toBeInTheDocument();
  });

  it("calculates compliance on button click", async () => {
    render(<MemoryRouter><SLACalculatorPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Calculate"));
    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(screen.getByText("SLA Compliance Rate")).toBeInTheDocument();
  });

  it("shows compliance rate as percentage", async () => {
    render(<MemoryRouter><SLACalculatorPage /></MemoryRouter>);
    await userEvent.click(screen.getByText("Calculate"));
    expect(screen.getByText("95.0%")).toBeInTheDocument();
  });
});
