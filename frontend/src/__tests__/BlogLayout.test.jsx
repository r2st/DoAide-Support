import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BlogLayout, { BlogIndex } from "../pages/BlogLayout";

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

describe("BlogLayout headings", () => {
  const renderAt = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<p>index</p>} />
            <Route path="post" element={<h1>Post title</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it("uses the blog name as the h1 on the index", () => {
    renderAt("/blog");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("DoAide Support Blog");
  });

  it("leaves the only h1 to the post on article pages", () => {
    renderAt("/blog/post");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Post title");
  });
});
