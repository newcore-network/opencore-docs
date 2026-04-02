const fs = require("fs");
const path = require("path");

module.exports = function searchIndexPlugin(context) {
  const docsDir = path.join(context.siteDir, "docs");
  const outputDir = path.join(context.siteDir, "static", "search");

  return {
    name: "oc-search-index",

    async loadContent() {
      const entries = [];
      crawl(docsDir, docsDir, entries);
      return entries;
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData({ index: content });
    },

    async postBuild({ content }) {
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(
        path.join(outputDir, "index.json"),
        JSON.stringify(content),
      );
    },

    getPathsToWatch() {
      return [`${docsDir}/**/*.{md,mdx}`];
    },
  };
};

function crawl(dir, docsRoot, entries) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      crawl(full, docsRoot, entries);
    } else if (/\.mdx?$/.test(name)) {
      const raw = fs.readFileSync(full, "utf-8");
      const parsed = parseFrontmatter(raw);
      const relPath = path
        .relative(docsRoot, full)
        .replace(/\\/g, "/")
        .replace(/\.mdx?$/, "")
        .replace(/\/index$/, "");

      const slug = `/docs/${relPath}`;
      const sections = extractSections(parsed.body);
      const plainText = stripMarkdown(parsed.body);
      const codeBlocks = extractCodeBlocks(parsed.body);

      entries.push({
        title: parsed.frontmatter.title || formatTitle(relPath),
        description: parsed.frontmatter.description || "",
        slug,
        sections,
        content: plainText.slice(0, 3000),
        code: codeBlocks.slice(0, 1500),
        category: relPath.split("/")[0] || "",
      });
    }
  }
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const fm = {};
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
      fm[key] = value;
    }
  }
  return { frontmatter: fm, body: match[2] };
}

function extractSections(body) {
  const sections = [];
  const lines = body.split("\n");
  let currentHeading = null;
  let currentContent = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          content: stripMarkdown(currentContent.join("\n")).slice(0, 500),
        });
      }
      currentHeading = headingMatch[2].replace(/[`*_~]/g, "");
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      content: stripMarkdown(currentContent.join("\n")).slice(0, 500),
    });
  }
  return sections;
}

function extractCodeBlocks(body) {
  const blocks = [];
  const regex = /```[\w]*\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(body)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks.join("\n");
}

function stripMarkdown(text) {
  return text
    .replace(/```[\w]*\n[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/>\s?/g, "")
    .replace(/[-*+]\s/g, "")
    .replace(/\d+\.\s/g, "")
    .replace(/\|/g, " ")
    .replace(/---+/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatTitle(relPath) {
  const last = relPath.split("/").pop();
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
