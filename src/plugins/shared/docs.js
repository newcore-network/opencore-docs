const fs = require("fs");
const path = require("path");

/**
 * Shared helpers for plugins that derive data from the `docs/` tree.
 * Used by both the search-index and llms-txt plugins.
 */

// Parse a leading `--- ... ---` YAML-ish frontmatter block. Handles flat
// `key: value` pairs with optional surrounding quotes. Returns the remaining
// markdown as `body`.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }
  return { frontmatter, body: match[2] };
}

// Recursively visit every .md/.mdx file under `dir`, calling
// `visit(relPath, raw)` for each. `relPath` is normalized to the doc route
// shape: posix separators, no extension, no trailing `/index`.
function crawlDocs(dir, root, visit) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      crawlDocs(full, root, visit);
    } else if (dirent.isFile() && /\.mdx?$/.test(dirent.name)) {
      const relPath = path
        .relative(root, full)
        .replace(/\\/g, "/")
        .replace(/\.mdx?$/, "")
        .replace(/\/index$/, "");
      visit(relPath, fs.readFileSync(full, "utf-8"));
    }
  }
}

// Turn a slug (or its last segment) into a Title Case label.
function formatTitle(slug) {
  const last = (slug || "").split("/").pop();
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = { parseFrontmatter, crawlDocs, formatTitle };
