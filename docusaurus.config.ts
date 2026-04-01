import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "OpenCore",
  tagline: "Framework",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: "https://opencorejs.dev",
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "newcore-network", // Usually your GitHub org/user name.
  projectName: "opencore", // Usually your repo name.

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/docs",
          editUrl: "https://github.com/newcore-network/opencore-docs",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: "/docs",
        language: ["en"],
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        searchBarPosition: "right",
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "OpenCore",
      hideOnScroll: false,
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://discord.gg/hDG25CPwpM",
          position: "right",
          className: "navbar__link--discord",
          "aria-label": "Discord",
          html: '<svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2.04a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2.04a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53.05s5-12.68 11.45-12.68S53.99 46.06 53.9 53.05c0 6.95-5.11 12.64-11.45 12.64Zm42.24 0C78.41 65.69 73.25 60 73.25 53.05s5-12.68 11.44-12.68 11.56 5.73 11.45 12.68c0 6.95-5.1 12.64-11.45 12.64Z"/></svg><span>Discord</span>',
        },
        {
          href: "https://github.com/newcore-network/opencore",
          position: "right",
          className: "navbar__link--github",
          "aria-label": "GitHub",
          html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg><span>GitHub</span>',
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Framework",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
            {
              label: "Decorators",
              to: "/docs/decorators/introduction",
            },
            {
              label: "Gameplay APIs",
              to: "/docs/apis/vehicles",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/hDG25CPwpM",
            },
            {
              label: "GitHub",
              href: "https://github.com/newcore-network/opencore",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Release Notes",
              href: "https://github.com/newcore-network/opencore/releases",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} OpenCore — Built for the multiplayer ecosystem.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["typescript", "lua", "bash", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
