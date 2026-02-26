import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'why-opencore',
    'features',

    // ── Getting Started ───────────────────────────────────────────
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/first-project',
        'getting-started/project-structure',
        'getting-started/setups',
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
        'core-concepts/controllers',
        'core-concepts/decorators-overview',
        'core-concepts/contracts',
        'decorators/introduction',
      ],
    },

    // ── Communication ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Communication',
      items: [
        'communication/overview',
        {
          type: 'category',
          label: 'Events',
          items: [
            'communication/events-api',
            'decorators/server/on-net',
            'decorators/client/on-net',
            'decorators/server/on-framework-event',
            'decorators/server/on-library-event',
            'decorators/client/on-library-event',
            'decorators/server/on-runtime-event',
            'decorators/client/local-event',
            'decorators/client/game-event',
            'decorators/client/on-view',
          ],
        },
        {
          type: 'category',
          label: 'RPC',
          items: [
            'communication/rpc',
            'communication/rpc-api',
            'decorators/server/on-rpc',
            'decorators/client/on-rpc',
          ],
        },
        {
          type: 'category',
          label: 'Binary Protocol',
          items: [
            'communication/binary-protocol',
            'decorators/server/binary-service',
            'decorators/server/binary-call',
            'decorators/server/binary-event',
          ],
        },
        {
          type: 'category',
          label: 'Exports',
          items: [
            'decorators/server/export',
            'decorators/client/export',
          ],
        },
      ],
    },

    // ── Client Runtime ────────────────────────────────────────────
    {
      type: 'category',
      label: 'Client Runtime',
      items: [
        'client/overview',
        'decorators/client/controller',
        'decorators/client/key',
        'decorators/client/on-tick',
        'decorators/client/interval',
        'decorators/client/on-resource-start',
        'decorators/client/on-resource-stop',
        'client/nui-bridge',
      ],
    },

    // ── Gameplay ──────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Gameplay',
      items: [
        {
          type: 'category',
          label: 'Entities',
          items: [
            'entities/introduction',
            'entities/base-entity',
            'entities/player',
            'entities/vehicle',
            'entities/npc',
            'entities/channel',
          ],
        },
        'decorators/server/command',
        'decorators/server/requires-state',
        'decorators/server/on-tick',
        {
          type: 'category',
          label: 'APIs',
          items: [
            'apis/chat',
            'apis/vehicles',
            'apis/npcs',
            'apis/vehicle-modifications',
            'apis/appearance',
            'apis/parallel-compute',
            'apis/channels',
          ],
        },
        {
          type: 'category',
          label: 'Client APIs',
          items: [
            'apis/client/spawn',
            'apis/client/appearance',
            'apis/client/camera',
            'apis/client/cinematic',
            'apis/client/notifications',
            'apis/client/blips',
            'apis/client/markers',
            'apis/client/peds',
            'apis/client/textui',
            'apis/client/streaming',
            'apis/client/progress',
            'apis/client/vehicle',
          ],
        },
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
        'security/security-handler',
        'security/net-event-observer',
        'security/command-error-observer',
      ],
    },

    {
      type: 'category',
      label: 'Ports & Contracts',
      items: [
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
            'contracts/security/security-handler',
            'contracts/security/net-event-security-observer',
            'contracts/security/principal-provider',
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
        {
          type: 'category',
          label: 'Dev Mode',
          items: [
            'dev-mode/about',
            'dev-mode/event-interceptor',
            'dev-mode/player-simulator',
            'dev-mode/state-inspector',
          ],
        },
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
        'api-reference/server-decorators',
        'api-reference/client-decorators',
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
        'libraries/library-api-usage',
        'libraries/plugin-api-usage',
        {
          type: 'category',
          label: 'Official Libraries',
          items: [
            'libraries/official-libraries/opencore-identity',
            'libraries/official-libraries/opencore-characters',
          ],
        },
        'templates/about',
      ],
    },

    'roadmap',
    'releases',
    'contributions',
  ],
};

export default sidebars;
