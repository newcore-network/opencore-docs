import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenCore',
  tagline: 'Framework',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://opencorejs.dev',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'newcore-network', // Usually your GitHub org/user name.
  projectName: 'opencore', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          editUrl: 'https://github.com/newcore-network/opencore-docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenCore',
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/newcore-network/opencore',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Framework',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Decorators',
              to: '/docs/decorators/introduction',
            },
            {
              label: 'Services',
              to: '/docs/services/introduction',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/hDG25CPwpM',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/newcore-network/opencore',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Release Notes',
              href: 'https://github.com/newcore-network/opencore/releases',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenCore Framework. Built with passion for the Cfx ecosystem.`
    },
    prism: {
      theme: prismThemes.github,          
      darkTheme: prismThemes.vsDark,       
      additionalLanguages: ['typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
