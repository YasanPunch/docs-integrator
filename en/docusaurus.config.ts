import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WSO2 Integrator Documentation',
  tagline: 'Build integrations with low-code simplicity and pro-code power',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://integrator.docs.wso2.com',
  baseUrl: process.env.BASE_URL || '/',

  organizationName: 'wso2',
  projectName: 'docs-integrator',

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './src/plugins/connector-versions',
    './plugins/docusaurus-plugin-markdown-export',
    './src/plugins/expose-sidebars',
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
        indexPages: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/docs-integrator/tree/main/en/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        // Collapse sibling categories whenever a category expands. With
        // `useAutoExpandActiveCategory`, this means navigating to a page
        // collapses every other top-level category and only leaves the
        // current path expanded.
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'WSO2 Integration Platform',
      logo: {
        alt: 'WSO2 Integration Platform Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
        href: '/',
      },
      items: [
        {
          href: 'https://github.com/wso2/docs-integrator',
          label: 'GitHub',
          position: 'right',
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get started',
          items: [
            { label: 'Overview', to: '/docs/get-started/introduction' },
            { label: 'Install', to: '/docs/get-started/setup/local-setup' },
            { label: 'Quick starts', to: '/docs/get-started/build-automation' },
          ],
        },
        {
          title: 'Develop',
          items: [
            { label: 'Integration artifacts', to: '/docs/develop/integration-artifacts' },
            { label: 'Transform', to: '/docs/develop/integration-artifacts/supporting/data-mapper/' },
            { label: 'Test', to: '/docs/develop/test/built-in-try-it-tool' },
            { label: 'Connectors', to: '/docs/connectors/overview' },
            { label: 'AI Integrations', to: '/docs/genai/overview' },
          ],
        },
        {
          title: 'Deploy',
          items: [
            { label: 'Docker and Kubernetes', to: '/docs/deploy/self-hosted/kubernetes' },
            { label: 'CI/CD', to: '/docs/deploy-operate/cicd/github-actions' },
            { label: 'Observe', to: '/docs/deploy-operate/observe/observability-overview' },
            { label: 'Secure', to: '/docs/deploy-operate/secure/authentication' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'WSO2 Integrator: MI', href: 'https://mi.docs.wso2.com' },
            { label: 'WSO2 Integrator: SI', href: 'https://si.docs.wso2.com/latest/' },
            { label: 'Ballerina Central', href: 'https://central.ballerina.io' },
            { label: 'Community Forums', href: 'https://discord.com/invite/wso2' },
            { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/wso2' },
            { label: 'GitHub', href: 'https://github.com/wso2' },
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'json', 'yaml', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
