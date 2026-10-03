import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShareButtons from "../components/ShareButtons";

vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  twitterUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  copyToClipboard: vi.fn(),
}));

const mockTrack = vi.fn();
vi.mock("../lib/track", () => ({ track: (...args) => mockTrack(...args) }));

import { copyToClipboard } from "../lib/share";

function renderShare(props = {}) {
  return render(
    <MemoryRouter>
      <ShareButtons path="/calculator" text="Check this out" {...props} />
    </MemoryRouter>,
  );
}

describe("ShareButtons", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders WhatsApp, Twitter and Copy link actions", () => {
    renderShare();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });

  it("builds the correct WhatsApp href", () => {
    renderShare();
    const link = screen.getByText("WhatsApp").closest("a");
    expect(link.getAttribute("href")).toContain("wa.me");
  });

  it("builds the correct Twitter href", () => {
    renderShare();
    const link = screen.getByText("Twitter").closest("a");
    expect(link.getAttribute("href")).toContain("twitter.com/intent/tweet");
  });

  it("shows Copied! after clicking copy", async () => {
    copyToClipboard.mockResolvedValue(true);
    renderShare();
    await userEvent.click(screen.getByText("Copy link"));
    expect(copyToClipboard).toHaveBeenCalledWith("http://localhost/calculator");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
