import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'why-opencore',

    // ── Getting Started ───────────────────────────────────────────
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/project-structure',
        'getting-started/first-server',
        'getting-started/setup',
        'getting-started/runtime-modes',
      ],
    },

    // ── Core Concepts ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/runtime-lifecycle',
        'core-concepts/dependency-injection',
        'core-concepts/controllers-and-services',
        'decorators/introduction',
        'core-concepts/ports-and-contracts',
        {
          type: 'category',
          label: 'Ports',
          items: [
            'ports/introduction',
            'ports/player-directory',
            'ports/principal',
            'ports/command-execution',
            'ports/session-lifecycle',
          ],
        },
        {
          type: 'category',
          label: 'Contracts',
          items: [
            'contracts/introduction',
            'contracts/player-persistence',
            'contracts/repository',
          ],
        },
      ],
    },

    // ── Communication ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Communication',
      items: [
        'communication/overview',
        'decorators/server/on-net',
        'decorators/client/on-net',
        'communication/rpc',
        'decorators/server/on-framework-event',
        'decorators/server/on-runtime-event',
        'decorators/client/local-event',
        {
          type: 'category',
          label: 'Binary Protocol',
          items: [
            'communication/binary-protocol',
            'decorators/server/binary-service',
            'decorators/server/binary-call',
          ],
        },
        'decorators/server/export',
        'decorators/client/export',
      ],
    },

    // ── Client Runtime ────────────────────────────────────────────
    {
      type: 'category',
      label: 'Client Runtime',
      items: [
        'decorators/client/controller',
        'decorators/client/on-view',
        'decorators/client/game-event',
        'decorators/client/key',
        'decorators/client/on-tick',
        'decorators/client/interval',
        'decorators/client/on-resource-start',
        'decorators/client/on-resource-stop',
      ],
    },

    // ── Gameplay Logic ────────────────────────────────────────────
    {
      type: 'category',
      label: 'Gameplay Logic',
      items: [
        {
          type: 'category',
          label: 'Entities',
          items: [
            'entities/introduction',
            'entities/player',
            'entities/vehicle',
          ],
        },
        'decorators/server/command',
        'decorators/server/requires-state',
        'decorators/server/on-tick',
      ],
    },

    // ── Server Services ───────────────────────────────────────────
    {
      type: 'category',
      label: 'Server Services',
      items: [
        'services/introduction',
        'services/server/chat-service',
        'services/server/vehicle-service',
        'services/server/vehicle-modification-service',
        'services/server/persistence-service',
        'services/server/rate-limiter.service',
        'services/server/parallel-service',
        'services/server/auth-service',
      ],
    },

    // ── Client Services ───────────────────────────────────────────
    {
      type: 'category',
      label: 'Client Services',
      items: [
        'services/client/introduction',
        'services/client/spawn-service',
        'services/client/appearance-service',
        'services/client/notification-service',
        'services/client/blip-service',
        'services/client/marker-service',
        'services/client/ped-service',
        'services/client/textui-service',
        'services/client/streaming-service',
        'services/client/progress-service',
        'services/client/vehicle-client-service',
        'services/client/vehicle-low-level-service',
        'services/client/some-service',
      ],
    },

    // ── Built-in Controllers ──────────────────────────────────────
    {
      type: 'category',
      label: 'Built-in Controllers',
      items: [
        'controllers/introduction',
        'controllers/server/chat',
        'controllers/client/spawner',
      ],
    },

    // ── Security ──────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
        'decorators/server/guard',
        'decorators/server/throttle',
        'decorators/server/public',
        'security/input-validation',
        {
          type: 'category',
          label: 'Security Contracts',
          items: [
            'contracts/security/principal-provider',
            'contracts/security/security-handler',
            'contracts/security/net-event-security-observer',
            'contracts/security/command-security-observer',
          ],
        },
      ],
    },

    // ── Advanced Topics ───────────────────────────────────────────
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced/performance',
        'advanced/scaling-resources',
        'advanced/session-recovery',
        'dev-mode/about',
      ],
    },

    // ── Tooling ───────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Tooling',
      items: [
        'cli/introduction',
        'cli/commands',
        'compiler/about',
      ],
    },

    // ── API Reference ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'category',
          label: 'Server Decorators',
          items: [
            'api-reference/server-decorators',
            'decorators/server/controller',
            'decorators/server/bind',
            'decorators/server/service',
            'decorators/server/repo',
          ],
        },
        {
          type: 'category',
          label: 'Client Decorators',
          items: [
            'api-reference/client-decorators',
          ],
        },
        'api-reference/runtime-apis',
        'api-reference/configuration',
      ],
    },

    // ── Ecosystem ─────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Ecosystem',
      items: [
        'libraries/about',
        'libraries/official-libraries/opencore-identity',
        'templates/about',
      ],
    },

    // ── Bottom-level pages ────────────────────────────────────────
    'features',
    'roadmap',
    'releases',
    'contributions',
  ],
};

export default sidebars;
