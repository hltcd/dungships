/**
 * Strips basic Markdown syntax from a string to return plain text.
 * Useful for summaries, meta tags, and alt text.
 */
export function stripMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return "";

  return markdown
    // Remove headers (e.g., # Header)
    .replace(/^#+\s+/gm, "")
    // Remove bold/italic (e.g., **bold**, *italic*, __bold__, _italic_)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove inline code (e.g., `code`)
    .replace(/`([^`]+)`/g, "$1")
    // Remove links (e.g., [text](url))
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    // Remove images (e.g., ![alt](url))
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    // Remove blockquotes (e.g., > quote)
    .replace(/^\s*>\s+/gm, "")
    // Remove horizontal rules
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    // Remove list markers
    .replace(/^\s*[\*\-\+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Cleanup extra spaces and newlines
    .replace(/\s+/g, " ")
    .trim();
}
