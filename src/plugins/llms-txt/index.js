const fs = require("fs");
const path = require("path");
const { parseFrontmatter, crawlDocs, formatTitle } = require("../shared/docs");

/**
 * Generates a `/llms.txt` file at build time from the real Docusaurus routes
 * (https://llmstxt.org/). Routes are taken from `routesPaths` (the authoritative
 * list Docusaurus generates), and titles/descriptions are enriched from the docs
 * frontmatter — so the file stays in sync automatically with no manual upkeep.
 */
module.exports = function llmsTxtPlugin(context) {
  const docsDir = path.join(context.siteDir, "docs");

  return {
    name: "oc-llms-txt",

    async loadContent() {
      // Map: route slug -> { title, description } from the docs frontmatter.
      const meta = {};
      crawlDocs(docsDir, docsDir, (relPath, raw) => {
        const { frontmatter } = parseFrontmatter(raw);
        meta[relPath] = {
          title: frontmatter.title || formatTitle(relPath),
          description: frontmatter.description || "",
        };
      });
      return meta;
    },

    async postBuild({ content, routesPaths, outDir, siteConfig, baseUrl }) {
      const meta = content || {};
      const docsPrefix = `${baseUrl}docs`;

      // Only document pages — drop internal routes (404, tag pages...).
      const docRoutes = routesPaths
        .filter((route) => route === docsPrefix || route.startsWith(`${docsPrefix}/`))
        .sort();

      // Group by top-level docs category for a readable structure.
      const groups = new Map();
      for (const route of docRoutes) {
        const slug = route.slice(docsPrefix.length).replace(/^\/|\/$/g, "") || "intro";
        const info = meta[slug] || { title: formatTitle(slug), description: "" };
        const category = categoryOf(slug);
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push({
          ...info,
          url: `${siteConfig.url.replace(/\/$/, "")}${route}`,
        });
      }

      const lines = [`# ${siteConfig.title}`, ""];
      if (siteConfig.tagline) {
        lines.push(`> ${siteConfig.tagline}`, "");
      }

      // "intro" sorts first; everything else alphabetically.
      const sortedCategories = [...groups.keys()].sort((a, b) =>
        (a === "intro" ? "" : a).localeCompare(b === "intro" ? "" : b),
      );

      for (const category of sortedCategories) {
        lines.push(`## ${formatTitle(category)}`, "");
        for (const entry of groups.get(category)) {
          const desc = entry.description ? `: ${entry.description}` : "";
          lines.push(`- [${entry.title}](${entry.url})${desc}`);
        }
        lines.push("");
      }

      fs.writeFileSync(path.join(outDir, "llms.txt"), lines.join("\n").trim() + "\n");
    },

    getPathsToWatch() {
      return [`${docsDir}/**/*.{md,mdx}`];
    },
  };
};

function categoryOf(slug) {
  const parts = slug.split("/");
  return parts.length > 1 ? parts[0] : "intro";
}
