import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmbedPage from "../pages/EmbedPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/share", () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
  embedSnippet: (tool) => `<iframe src="http://localhost/embed/${tool}" title="DoAide Support"></iframe>`,
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import { copyToClipboard } from "../lib/share";

function renderEmbed() {
  return render(
    <MemoryRouter initialEntries={["/embed"]}>
      <EmbedPage />
    </MemoryRouter>,
  );
}

describe("EmbedPage", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders title", () => {
    renderEmbed();
    expect(screen.getByRole("heading", { name: /Embed Support Tools/i })).toBeInTheDocument();
  });

  it("shows tool selector buttons", () => {
    renderEmbed();
    expect(screen.getAllByText(/Response Checker/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ROI Calculator/).length).toBeGreaterThan(0);
  });

  it("shows embed snippet", () => {
    renderEmbed();
    expect(screen.getByText(/iframe/)).toBeInTheDocument();
  });

  it("copies embed code when button clicked", async () => {
    renderEmbed();
    await userEvent.click(screen.getByText("Copy embed code"));
    expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining("<iframe"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("switches tool when selector is clicked", async () => {
    renderEmbed();
    const toolGroup = screen.getByRole("group", { name: /Choose tool/ });
    expect(toolGroup).toBeInTheDocument();
    const calcBtn = toolGroup.querySelector("button:nth-child(3)");
    await userEvent.click(calcBtn);
    await userEvent.click(screen.getByText("Copy embed code"));
    expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining("calculator"));
  });
});
