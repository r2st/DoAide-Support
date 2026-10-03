const ORIGIN = "https://support.doaide.com";

export function origin() {
  return typeof window !== "undefined" && window.location.origin !== "null"
    ? window.location.origin
    : ORIGIN;
}

export function fullUrl(path) {
  return `${origin()}${path}`;
}

export function whatsappUrl(text, url) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

export function twitterUrl(text, url) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}

export function embedSnippet(tool) {
  const paths = { checker: "/checker", templates: "/templates-gallery", calculator: "/calculator" };
  const path = paths[tool] || "/checker";
  return `<iframe src="${ORIGIN}${path}" width="100%" height="500" style="border:none;border-radius:12px" title="DoAide Support – ${tool}"></iframe>`;
}
