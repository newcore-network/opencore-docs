const fs = require("fs");
const path = require("path");
const { parseFrontmatter, crawlDocs, formatTitle } = require("../shared/docs");

module.exports = function searchIndexPlugin(context) {
  const docsDir = path.join(context.siteDir, "docs");
  const outputDir = path.join(context.siteDir, "static", "search");

  return {
    name: "oc-search-index",

    async loadContent() {
      const entries = [];
      crawlDocs(docsDir, docsDir, (relPath, raw) => {
        const { frontmatter, body } = parseFrontmatter(raw);
        entries.push({
          title: frontmatter.title || formatTitle(relPath),
          description: frontmatter.description || "",
          slug: `/docs/${relPath}`,
          sections: extractSections(body),
          content: stripMarkdown(body).slice(0, 3000),
          code: extractCodeBlocks(body).slice(0, 1500),
          category: relPath.split("/")[0] || "",
        });
      });
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
