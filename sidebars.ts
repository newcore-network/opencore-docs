import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'why-opencore',
    'roadmap',
    'releases',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/first-server',
        'getting-started/setup',
      ],
    },
    {
      type: 'category',
      label: 'Decorators',
      items: [
        'decorators/introduction',
        {
          type: 'category',
          label: 'Server',
          items: [
            'decorators/server/controller',
            'decorators/server/bind',
            'decorators/server/service',
            'decorators/server/repo',
            'decorators/server/command',
            'decorators/server/on-net',
            'decorators/server/on-tick',
            'decorators/server/on-framework-event',
            'decorators/server/on-runtime-event',
            'decorators/server/requires-state',
            'decorators/server/throttle',
            'decorators/server/export',
            'decorators/server/guard',
            'decorators/server/public',
          ],
        },
        {
          type: 'category',
          label: 'Client',
          items: [
            'decorators/client/controller',
            'decorators/client/on-net',
            'decorators/client/local-event',
            'decorators/client/game-event',
            'decorators/client/on-tick',
            'decorators/client/interval',
            'decorators/client/key',
            'decorators/client/on-view',
            'decorators/client/export',
            'decorators/client/on-resource-start',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Services',
      items: [
        'services/introduction',
        {
          type: 'category',
          label: 'Server',
          items: [
            'services/server/chat-service',
            'services/server/vehicle-service',
            'services/server/vehicle-modification-service',
            'services/server/persistence-service',
            'services/server/rate-limiter.service',
            'services/server/parallel-service',
          ],
        },
        {
          type: 'category',
          label: 'Client',
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
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Contracts',
      items: [
        'contracts/introduction',
        'contracts/player-persistence',
        'contracts/repository',
        {
          type: 'category',
          label: 'Security',
          items: [
            'contracts/security/principal-provider',
            'contracts/security/security-handler',
            'contracts/security/net-event-security-observer',
            'contracts/security/command-security-observer',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Controllers',
      items: [
        'controllers/introduction',
        {
          type: 'category',
          label: 'Client',
          items: [
            'controllers/client/spawner',
          ],
        },
        {
          type: 'category',
          label: 'Server',
          items: [
            'controllers/server/chat',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Entities',
      items: [
        'entities/introduction',
        'entities/player',
        'entities/vehicle',
      ],
    },
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
      label: 'Dev Mode',
      items: [
        'dev-mode/about',
      ],
    },
    {
      type: 'category',
      label: 'Tooling',
      items: [
        {
          type: 'category',
          label: 'CLI',
          items: [
            'cli/introduction',
            'cli/commands',
          ],
        },
        'compiler/about',
      ],
    },
    {
      type: 'category',
      label: 'Ecosystem',
      items: [
        'libraries/about',
        'templates/about',
      ],
    },
    'contributions',
  ],
};

export default sidebars;
