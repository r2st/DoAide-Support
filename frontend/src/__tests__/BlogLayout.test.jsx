import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BlogIndex } from "../pages/BlogLayout";

describe("BlogIndex", () => {
  it("renders all article cards", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Response Time Matters/)).toBeInTheDocument();
    expect(screen.getByText(/Building a Knowledge Base/)).toBeInTheDocument();
    expect(screen.getByText(/CSAT vs NPS vs CES/)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Deflection Strategies/)).toBeInTheDocument();
    expect(screen.getByText(/SLA Best Practices/)).toBeInTheDocument();
    expect(screen.getByText(/AI in Customer Support/)).toBeInTheDocument();
  });

  it("renders read more links", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>,
    );
    const links = screen.getAllByText(/Read more/);
    expect(links).toHaveLength(9);
  });
});
