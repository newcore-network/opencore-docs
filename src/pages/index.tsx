import { JSX, useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';
import { HeroCode } from '../components/HeroCode';

const CODE_EXAMPLE = `
const TransferSchema = z.object({
  targetId: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
})

@Controller()
export class BankController {
  @Command({ command: 'transfer', usage: '/transfer <id> <amount>', schema: TransferSchema })
  @Guard({ permission: 'bank.transfer' })
  @Throttle(1, 2000)
  async transfer(player: Player, targetId: number, amount: number) {
    await this.bankService.move(player.clientID, targetId, amount)
    player.send('Transfer completed', 'success')
  }
}`;

const COMPARISON_TABS = [
    {
        id: 'opencore',
        label: 'OpenCore',
        lang: 'InventoryController.ts',
        code: `
const GiveItemSchema = z.object({
  targetId: z.coerce.number().int().positive(),
  item: z.string().min(1),
  amount: z.coerce.number().int().positive(),
})

@Controller()
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}
 
  @Command({ command: 'giveitem', usage: '/giveitem <id> <item> <amount>', schema: GiveItemSchema })
  @Guard({ permission: 'inventory.give' })
  @Throttle(5, 1000)
  async giveItem(player: Player, targetId: number, item: string, amount: number) {
    await this.inventory.addItem(targetId, item, amount)
    player.send('Item given!', 'success')
  }
}`
    },
    {
        id: 'typescript',
        label: 'TypeScript Only',
        lang: 'inventory.ts',
        code: `RegisterCommand('giveitem', async (source: number, args: string[]) => {
  const targetId = parseInt(args[0])
  const item = args[1]
  const amount = parseInt(args[2])
 
  if (isNaN(targetId) || !item || isNaN(amount)) {
    emitNet('chat:addMessage', source, { args: ['Error', 'Invalid'] })
    return
  }
 
  const hasPermission = await checkPermission(source, 'inventory.give')
  if (!hasPermission) return
 
  await addItem(targetId, item, amount)
}, false)`
    },
    {
        id: 'lua',
        label: 'Lua',
        lang: 'inventory.lua',
        code: `RegisterCommand('giveitem', function(source, args)
  local targetId = tonumber(args[1])
  local item = args[2]
  local amount = tonumber(args[3])
 
  if not targetId or not item or not amount then
    TriggerClientEvent('chat:addMessage', source, {
      args = { 'Error', 'Invalid usage' }
    })
    return
  end
 
  -- No type safety, no IDE support
  -- Manual permission check needed
 
  exports['inventory']:AddItem(targetId, item, amount)
end, false)`
    }
];

const FEATURES_DATA = [
    {
        id: 'commands',
        icon: '⌨️',
        title: 'Commands',
        description: 'Declarative handlers with Zod validation and Player injection by default',
        code: `
@Command('heal', z.tuple([z.coerce.number().int().positive()]))
async heal(player: Player, targetId: number) {
  const target = this.players.getById(targetId)
  target.setHealth(200)
  player.send('Healed ' + target.name, 'success')
}`,
        filename: 'HealthController.ts'
    },
    {
        id: 'netevents',
        icon: '📡',
        title: 'Network Events',
        description: 'Typed event handlers with Player context and payload validation',
        code: `
const BankActionSchema = z.object({
  action: z.enum(['deposit', 'withdraw']),
  amount: z.coerce.number().int().positive(),
})

@Controller()
export class BankEventsController {
  @OnNet('bank:action', BankActionSchema)
  async onAction(player: Player, payload: z.infer<typeof BankActionSchema>) {
    await this.bank.handle(player.clientID, payload)
  }
}`,
        filename: 'BankEventsController.ts'
    },
    {
        id: 'libraries',
        icon: '🧩',
        title: 'Library Events',
        description: 'Emit domain events between modules without coupling resources together',
        code: `
const characters = Server.createServerLibrary('characters')

@Controller()
export class CharacterListeners {
  @OnLibraryEvent('characters', 'session:created')
  onSessionCreated(payload: { sessionId: string; playerId: number }) {
    this.audit.log('character session ready', payload)
  }
}

characters.emit('session:created', { sessionId: 's-42', playerId: 12 })`,
        filename: 'CharacterListeners.ts'
    },
    {
        id: 'guards',
        icon: '🛡️',
        title: 'Guards & Permissions',
        description: 'Role-based access control via decorators',
        code: `
@Guard({ rank: 3 })
@Command('ban')
async ban(player: Player, targetId: number, reason: string) {
  await this.moderation.ban(targetId, reason)
}
 
@Guard({ permission: 'admin.teleport' })
@Command('tp')
async teleport(player: Player, x: number, y: number, z: number) {
  player.teleport({ x, y, z })
}`,
        filename: 'AdminController.ts'
    },
    {
        id: 'throttle',
        icon: '⏱️',
        title: 'Rate Limiting',
        description: 'Built-in throttling per player, per method',
        code: `
@Throttle(5, 2000)
@Command('search')
async search(player: Player, query: string) {
  return this.market.search(query)
}
 
@Throttle({ limit: 1, windowMs: 5000, message: 'Too fast!' })
@Command('buy')
async placeOrder(player: Player, itemId: string) {
  await this.market.purchase(player, itemId)
}`,
        filename: 'MarketController.ts'
    },
    {
        id: 'player',
        icon: '👤',
        title: 'Player Entity',
        description: 'Rich player API: state, communication, health',
        code: `player.emit('client:notify', { message: 'Hello!' })
player.send('Private message', 'info')
 
player.setMeta('job', 'police')
player.addState('on_duty')
 
player.teleport({ x: 100, y: 200, z: 30 })
player.setHealth(150)
player.kick('AFK timeout')`,
        filename: 'PlayerEntity.ts'
    },
    {
        id: 'binary',
        icon: '🔧',
        title: 'Binary Services',
        description: 'Use binaries easily from your favorite compiled languages',
        code: `
@BinaryService({ 
  name: 'image-processor', 
  binary: 'img_worker',
  timeoutMs: 30000 
})
export class ImageService {
  @BinaryCall()
  async resize(path: string, width: number, height: number): Promise<{ success: boolean; url: string }> {
    return null as any
  }

  @BinaryCall({ action: 'watermark' })
  async applyWatermark(path: string, text: string): Promise<{ success: boolean }> {
    return null as any
  }
}`,
        filename: 'BinaryService.ts'
    },
    {
        id: 'adapters',
        icon: '🔌',
        title: 'Adapters',
        description: 'Target FiveM and RageMP today, with RedM support on the way',
        code: `
export default defineConfig({
  name: 'my-server',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
})

// RageMP uses the same adapter-first model.
// RedM is tracked in the same architecture and landing next.`,
        filename: 'opencore.config.ts'
    },
    {
        id: 'devmode',
        icon: '🔍',
        title: 'Dev Mode',
        description: 'Runtime inspection with event history and virtual players',
        code: `
await init({
  mode: 'CORE',
  devMode: {
    enabled: true,
    interceptor: {
      enabled: true,
      recordHistory: true,
      maxHistorySize: 1000,
    },
    simulator: {
      enabled: true,
      autoConnectPlayers: 2,
    },
  },
})`,
        filename: 'DevMode.ts'
    },
    {
        id: 'cli',
        icon: '⚡',
        title: 'OpenCore CLI',
        description: 'Monorepo build, watcher, scaffolding, restart and adapter tooling',
        code: `$ opencore build    # Parallel production builds
$ opencore dev      # Watch mode + restart flow
$ opencore create resource inventory --with-client
$ opencore doctor   # Validate project configuration
$ opencore adapter check
$ opencore clone starter-fivem
 
# opencore.config.ts
dev: {
  bridge: { port: 3847 },
  restart: { mode: 'auto' },
}`,
        filename: 'terminal'
    },
    {
        id: 'protection',
        icon: '🔒',
        title: 'Security by Default',
        description: 'Guards, throttles, validation out of the box',
        code: `
const SpawnCarSchema = z.object({
  model: z.string().min(1).max(32),
})

@Guard({ permission: 'admin.spawn' })
@Throttle(2, 10000)
@RequiresState({ has: ['spawned'], missing: ['dead'] })
@Command({ command: 'spawncar', schema: SpawnCarSchema })
async spawnCar(player: Player, model: string) {
  await this.vehicles.spawn(player, model)
}`,
        filename: 'SecurityExample.ts'
    },
];
const PLATFORMS = [
    { name: 'FiveM', style: 'gradientText' },
    { name: 'RedM', style: 'redMText' },
    { name: 'Rage Multiplayer', style: 'rageMPText' }
] as const;

const RELEASE_URL = 'https://api.github.com/repos/newcore-network/opencore/releases/latest';

type GitHubRelease = { tag_name: string };

export default function Home(): JSX.Element {
    const [tag, setTag] = useState<string>('—');
    const [selectedFeature, setSelectedFeature] = useState(FEATURES_DATA[0]);
    const [comparisonTab, setComparisonTab] = useState(COMPARISON_TABS[0]);
    const [platformIndex, setPlatformIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        fetch(RELEASE_URL, { headers: { Accept: 'application/vnd.github+json' } })
            .then(res => res.json())
            .then((data: GitHubRelease) => setTag(data.tag_name ?? '—'))
            .catch(() => setTag('v0.3.x'));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setPlatformIndex(prev => (prev + 1) % PLATFORMS.length);
                setIsTransitioning(false);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout title="OpenCore Framework" description="The TypeScript-first multiplayer runtime for adapter-driven servers">
            <main className={styles.homeContainer}>
                <section className={styles.topNotice}>
                    <div className={styles.topNoticeInner}>
                        <span className={styles.topNoticeIcon}>★</span>
                        <p className={styles.topNoticeText}>
                            Enjoying OpenCore? Don&apos;t forget to leave us a star on GitHub.
                        </p>
                        <Link className={styles.topNoticeLink} href="https://github.com/newcore-network/opencore">
                            Star the repo
                        </Link>
                    </div>
                </section>

                {/* HERO */}
                <section className={styles.hero}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>
                                <span className={styles.badgeDot}></span>
                                {tag}
                            </div>
                            <h1 className={styles.heroTitle}>
                                The Industrial <br />
                                <span className={styles.gradientText}>Runtime for</span>{' '}
                                <span
                                    className={clsx(
                                        styles[PLATFORMS[platformIndex].style],
                                        isTransitioning && styles.fadeOut
                                    )}
                                >
                                    {PLATFORMS[platformIndex].name}
                                </span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                TypeScript-first framework with Dependency Injection, validation,
                                and security primitives. Built for FiveM and RageMP today, with RedM following the same adapter-first path.
                            </p>
                            <div className={styles.heroActions}>
                                <Link className={clsx('button button--lg', styles.primaryBtn)} to="/docs/intro">
                                    Get Started
                                </Link>
                                <Link className={clsx('button button--lg', styles.secondaryBtn)} href="https://github.com/newcore-network/opencore">
                                    GitHub
                                </Link>
                                <Link className={clsx('button button--lg', styles.secondaryBtn)} href="https://discord.gg/hDG25CPwpM">
                                    Discord
                                </Link>
                            </div>
                        </div>
                        <div className={styles.heroCode}>
                            <div className={styles.codeWindow}>
                                <div className={styles.codeHeader}>
                                    <div className={styles.dots}>
                                        <div className={styles.dotRed}></div>
                                        <div className={styles.dotYellow}></div>
                                        <div className={styles.dotGreen}></div>
                                    </div>
                                    <div className={styles.filename}>BankController.ts</div>
                                </div>
                                <HeroCode code={CODE_EXAMPLE} className={styles.heroCodeBlock} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CODE COMPARISON WITH TABS */}
                <section className={styles.comparison}>
                    <div className={styles.sectionHeader}>
                        <h2>Code Comparison</h2>
                        <p>See the difference between raw runtime code and the framework approach</p>
                    </div>
                    <div className={styles.tabsRow}>
                        {COMPARISON_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={clsx(styles.tab, comparisonTab.id === tab.id && styles.active)}
                                onClick={() => setComparisonTab(tab)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.comparisonSingle}>
                        <div className={clsx(styles.comparisonPane, comparisonTab.id === 'opencore' && styles.after)}>
                            <div className={styles.paneHeader}>
                                <span className={clsx(styles.paneLabel, comparisonTab.id === 'opencore' && styles.accent)}>
                                    {comparisonTab.label}
                                </span>
                                <span className={styles.paneLang}>{comparisonTab.lang}</span>
                            </div>
                            <HeroCode code={comparisonTab.code} className={styles.paneCode} />
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className={styles.features}>
                    <div className={styles.sectionHeader}>
                        <h2>Everything You Need</h2>
                        <p>Built-in primitives for secure, scalable, adapter-first server development</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        {FEATURES_DATA.map((feature) => (
                            <div
                                key={feature.id}
                                className={clsx(styles.featureItem, selectedFeature.id === feature.id && styles.active)}
                                onClick={() => setSelectedFeature(feature)}
                            >
                                <div className={styles.featureIcon}>{feature.icon}</div>
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.featurePreview}>
                        <div className={styles.previewWindow}>
                            <div className={styles.previewHeader}>
                                <div className={styles.dots}>
                                    <div className={styles.dotRed}></div>
                                    <div className={styles.dotYellow}></div>
                                    <div className={styles.dotGreen}></div>
                                </div>
                                <span className={styles.previewTitle}>{selectedFeature.filename}</span>
                            </div>
                            <HeroCode code={selectedFeature.code} className={styles.previewCode} />
                        </div>
                    </div>
                </section>

                {/* STATS - BENCHMARKS */}
                <section className={styles.stats}>
                    <div className={styles.sectionHeader}>
                        <h2>Performance</h2>
                        <p>Internal benchmarks - 26/02/2026</p>
                    </div>
                    <div className={styles.statGrid}>
                        <StatItem value="17.78M" label="EventInterceptor ops/sec" sublabel="getStatistics, ~0.056 us mean" />
                        <StatItem value="10.49M" label="RuntimeConfig ops/sec" sublabel="resolve CORE, ~0.095 us mean" />
                        <StatItem value="80.14K" label="Commands throughput" sublabel="500 players (simple), p95 0.226 ms" />
                        <StatItem value="251.10K" label="RPC throughput" sublabel="500 parallel RPCs, p95 1.83 ms" />
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <h2>Ready to build?</h2>
                    <p>OpenCore is free, open source, and ready for serious multiplayer projects.</p>
                    <Link className={styles.primaryBtn} to="/docs/intro">
                        Read the docs
                    </Link>
                </section>
            </main>
        </Layout>
    );
}

function StatItem({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
    return (
        <div className={styles.statItem}>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
            {sublabel && <div className={styles.statSublabel}>{sublabel}</div>}
        </div>
    );
}
