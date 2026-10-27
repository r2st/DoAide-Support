import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLES } from "../data/blogArticles";
import { jsonLdFor, metaForPath, routes } from "../routeMeta";

const appSrc = readFileSync(resolve(process.cwd(), "src/App.jsx"), "utf-8");

describe("routeMeta", () => {
  it("has unique paths, titles and descriptions", () => {
    for (const key of ["path", "title", "description"]) {
      const values = routes.map((r) => r[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("only lists public routes the router serves", () => {
    const publicPaths = new Set(
      [...appSrc.matchAll(/<Route\s+path="(\/[^"]*)"\s+element=\{(?!\s*<Protected)/g)].map((m) => m[1])
    );
    for (const r of routes) {
      if (!r.path.startsWith("/blog/")) expect(publicPaths.has(r.path), r.path).toBe(true);
    }
    for (const p of ["/login", "/register", "/portal", "/dashboard", "/tickets"]) expect(metaForPath(p)).toBeUndefined();
  });

  it("dates every blog post", () => {
    for (const a of ARTICLES) {
      expect(jsonLdFor(metaForPath(`/blog/${a.slug}`)).datePublished).toBe(a.published);
    }
  });

  it("keeps titles within 70 chars unless the article title alone is longer", () => {
    for (const r of routes) if (r.title.length > 70) expect(r.title, r.path).toBe(r.h1);
  });

  it("puts the product schema on the home page only", () => {
    expect(jsonLdFor(metaForPath("/"))["@graph"][0]["@type"]).toBe("SoftwareApplication");
    expect(JSON.stringify(jsonLdFor(metaForPath("/calculator")))).not.toContain("SoftwareApplication");
  });
});
