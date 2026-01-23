import { JSX, useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';
import { HeroCode } from '../components/HeroCode';
 
const CODE_EXAMPLE = `@Server.Controller()
export class BankController {
  @Server.Guard({ rank: 1 })
  @Server.Throttle(1, 2000)
  @Server.Command('transfer')
  async transfer(player: Server.Player, amount: number, targetId: number) {
    await this.bankService.move(player, amount, targetId)
  }
}`;
 
const COMPARISON_TABS = [
    {
        id: 'opencore',
        label: 'OpenCore',
        lang: 'InventoryController.ts',
        code: `@Server.Controller()
export class InventoryController {
  constructor(private inventory: InventoryService) {}
 
  @Server.Guard({ permission: 'inventory.give' })
  @Server.Throttle(5, 1000)
  @Server.Command('giveitem')
  async giveItem(player: Server.Player, targetId: number, item: string, amount: number) {
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
        description: 'Declarative handlers with Zod validation and Player Entity by default',
        code: `@Server.Command('heal', z.tuple([z.number()]))
async heal(player: Server.Player, targetId: number) {
  const target = this.players.getById(targetId)
  target.setHealth(200)
  player.send('Healed ' + target.name, 'success')
}`,
        filename: 'HealthController.ts'
    },
    {
        id: 'guards',
        icon: '🛡️',
        title: 'Guards & Permissions',
        description: 'Role-based access control via decorators',
        code: `@Server.Guard({ rank: 3 })
@Server.Command('ban')
async ban(player: Server.Player, targetId: number, reason: string) {
  await this.moderation.ban(targetId, reason)
}
 
@Server.Guard({ permission: 'admin.teleport' })
@Server.Command('tp')
async teleport(player: Server.Player, x: number, y: number, z: number) {
  player.teleport({ x, y, z })
}`,
        filename: 'AdminController.ts'
    },
    {
        id: 'throttle',
        icon: '⏱️',
        title: 'Rate Limiting',
        description: 'Built-in throttling per player, per method',
        code: `@Server.Throttle(5, 2000)
@Server.Command('search')
async search(player: Server.Player, query: string) {
  return this.market.search(query)
}
 
@Server.Throttle({ limit: 1, windowMs: 5000, message: 'Too fast!' })
@Server.Command('buy')
async placeOrder(player: Server.Player, itemId: string) {
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
        code: `@Server.BinaryService({ 
  name: 'image-processor', 
  binary: 'img_worker',
  timeoutMs: 30000 
})
export class ImageService {
  /** Processes image resize externally without blocking FiveM main thread */
  @Server.BinaryCall()
  async resize(path: string, width: number, height: number): Promise<{ success: boolean; url: string }> {
    return null as any; // The framework handles the return of values
  }
  /** Applies watermark to target image */
  @Server.BinaryCall({ action: 'watermark' })
  async applyWatermark(path: string, text: string): Promise<{ success: boolean }> {
    return null as any;
  }
}`,
        filename: 'BinaryService.ts'
    },
    {
        id: 'devmode',
        icon: '🔍',
        title: 'Dev Mode',
        description: 'Event interception, player simulation',
        code: `// - CLI telemetry streaming
// - Event history & interception
// - Virtual player simulation
 
Server.init({
    mode: 'CORE',
    devMode: {
        enabled: true,
        interceptor: {}, // Event interceptor configuration for debugging. Captures and records incoming/outgoing network events and commands.
        simulator: {}, // Player simulator configuration. Allows creating virtual players for testing logic without game clients.
    }
})`,
        filename: 'DevMode.ts'
    },
    {
        id: 'cli',
        icon: '⚡',
        title: 'OpenCore CLI',
        description: 'Monorepo compiler, watcher, scaffolding',
        code: `$ opencore build    # Parallel builds (<1s)
$ opencore dev      # Watch mode + hot reload
$ opencore create resource inventory
$ opencore check    # Type-check only
 
# Go + SWC + esbuild = blazing fast
# Environment isolation enforced`,
        filename: 'terminal'
    },
    {
        id: 'protection',
        icon: '🔒',
        title: 'Security by Default',
        description: 'Guards, throttles, validation out of the box',
        code: `
@Server.Guard({ permission: 'admin.spawn' })
@Server.Throttle(2, 10000)
@Server.RequiresState('spawned')
@Server.Command('spawncar', z.object({
  model: z.string().min(1).max(32)
})) // Explicit validation if you want, but it is also automatically validated with primitive types (number, string, bool...)
async spawnCar(player: Server.Player, data: { model: string }) {
  await this.vehicles.spawn(player, data.model)
}`,
        filename: 'SecurityExample.ts'
    },
];
const PLATFORMS = [
    { name: 'FiveM', style: 'gradientText' },
    { name: 'RedM', style: 'redMText' }
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
        <Layout title="OpenCore Framework" description="The TypeScript-first multiplayer runtime for FiveM">
            <main className={styles.homeContainer}>
                {/* HERO */}
                <section className={styles.hero}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>
                                <span className={styles.badgeDot}></span>
                                {tag} Open Stable Beta
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
                                and security primitives. Not a gamemode—an engine you can scale.
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
                        <p>See the difference between approaches</p>
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
                        <p>Built-in primitives for secure, scalable server development</p>
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
                        <p>Based on internal benchmarks</p>
                    </div>
                    <div className={styles.statGrid}>
                        <StatItem value="5.72M" label="Decorators ops/sec" sublabel="~0.17μs mean" />
                        <StatItem value="2.01M" label="Events ops/sec" sublabel="~0.50μs mean" />
                        <StatItem value="14M" label="Commands ops/sec" sublabel="validated, 500 players" />
                        <StatItem value="1.18M" label="Concurrent NetEvents" sublabel="p95 0.40ms" />
                    </div>
                </section>
 
                {/* CTA */}
                <section className={styles.cta}>
                    <h2>Ready to build?</h2>
                    <p>OpenCore is free, open source, and ready for production.</p>
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