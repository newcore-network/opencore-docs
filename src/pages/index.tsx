import { JSX, useEffect, useState, useCallback } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./index.module.css";
import { HeroCode } from "../components/HeroCode";

const HERO_CODE = `const TransferSchema = z.object({
  targetId: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
})

@Controller()
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Command({ command: 'transfer', schema: TransferSchema })
  @Guard({ permission: 'bank.transfer' })
  @Throttle(1, 2000)
  async transfer(player: Player, targetId: number, amount: number) {
    await this.bankService.move(player.clientID, targetId, amount)
    player.send('Transfer completed', 'success')
  }
}`;

const COMPARISONS = [
  {
    id: "opencore",
    label: "OpenCore",
    file: "InventoryController.ts",
    code: `const GiveItemSchema = z.object({
  targetId: z.coerce.number().int().positive(),
  item: z.string().min(1),
  amount: z.coerce.number().int().positive(),
})

@Controller()
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Command({ command: 'giveitem', schema: GiveItemSchema })
  @Guard({ permission: 'inventory.give' })
  @Throttle(5, 1000)
  async giveItem(player: Player, targetId: number, item: string, amount: number) {
    await this.inventory.addItem(targetId, item, amount)
    player.send('Item given!', 'success')
  }
}`,
  },
  {
    id: "raw-ts",
    label: "Raw TypeScript",
    file: "inventory.ts",
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
}, false)`,
  },
  {
    id: "lua",
    label: "Lua",
    file: "inventory.lua",
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

  exports['inventory']:AddItem(targetId, item, amount)
end, false)`,
  },
];

const FEATURES = [
  {
    id: "commands",
    icon: "\u2328\uFE0F",
    title: "Commands",
    desc: "Declarative handlers with Zod schemas and Player injection",
    file: "HealthController.ts",
    code: `@Command('heal', z.tuple([z.coerce.number().int().positive()]))
async heal(player: Player, targetId: number) {
  const target = this.players.getById(targetId)
  target.setHealth(200)
  player.send('Healed ' + target.name, 'success')
}`,
  },
  {
    id: "events",
    icon: "\uD83D\uDCE1",
    title: "Net Events",
    desc: "Typed event handlers with Player context and payload validation",
    file: "BankEventsController.ts",
    code: `const BankActionSchema = z.object({
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
  },
  {
    id: "libraries",
    icon: "\uD83E\uDDE9",
    title: "Libraries",
    desc: "Emit domain events between modules without coupling",
    file: "CharacterListeners.ts",
    code: `const characters = Server.createServerLibrary('characters')

@Controller()
export class CharacterListeners {
  @OnLibraryEvent('characters', 'session:created')
  onSessionCreated(payload: { sessionId: string; playerId: number }) {
    this.audit.log('character session ready', payload)
  }
}

characters.emit('session:created', { sessionId: 's-42', playerId: 12 })`,
  },
  {
    id: "guards",
    icon: "\uD83D\uDEE1\uFE0F",
    title: "Guards",
    desc: "Role-based access control via decorators",
    file: "AdminController.ts",
    code: `@Guard({ rank: 3 })
@Command('ban')
async ban(player: Player, targetId: number, reason: string) {
  await this.moderation.ban(targetId, reason)
}

@Guard({ permission: 'admin.teleport' })
@Command('tp')
async teleport(player: Player, x: number, y: number, z: number) {
  player.teleport({ x, y, z })
}`,
  },
  {
    id: "throttle",
    icon: "\u23F1\uFE0F",
    title: "Throttle",
    desc: "Built-in rate limiting per player, per method",
    file: "MarketController.ts",
    code: `@Throttle(5, 2000)
@Command('search')
async search(player: Player, query: string) {
  return this.market.search(query)
}

@Throttle({ limit: 1, windowMs: 5000, message: 'Too fast!' })
@Command('buy')
async placeOrder(player: Player, itemId: string) {
  await this.market.purchase(player, itemId)
}`,
  },
  {
    id: "player",
    icon: "\uD83D\uDC64",
    title: "Player API",
    desc: "Rich entity: state, comms, health, teleport",
    file: "PlayerEntity.ts",
    code: `player.emit('client:notify', { message: 'Hello!' })
player.send('Private message', 'info')

player.setMeta('job', 'police')
player.addState('on_duty')

player.teleport({ x: 100, y: 200, z: 30 })
player.setHealth(150)
player.kick('AFK timeout')`,
  },
  {
    id: "binary",
    icon: "\uD83D\uDD27",
    title: "Binary RPC",
    desc: "Call compiled binaries from TypeScript",
    file: "BinaryService.ts",
    code: `@BinaryService({
  name: 'image-processor',
  binary: 'img_worker',
  timeoutMs: 30000
})
export class ImageService {
  @BinaryCall()
  async resize(path: string, w: number, h: number): Promise<{ url: string }> {
    return null as any
  }
}`,
  },
  {
    id: "adapters",
    icon: "\uD83D\uDD0C",
    title: "Adapters",
    desc: "FiveM, RageMP today — RedM next",
    file: "opencore.config.ts",
    code: `export default defineConfig({
  name: 'my-server',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
})`,
  },
  {
    id: "devmode",
    icon: "\uD83D\uDD0D",
    title: "Dev Mode",
    desc: "Event inspector, player simulator, hot reload",
    file: "DevMode.ts",
    code: `await init({
  mode: 'CORE',
  devMode: {
    enabled: true,
    interceptor: { enabled: true, recordHistory: true },
    simulator: { enabled: true, autoConnectPlayers: 2 },
  },
})`,
  },
  {
    id: "cli",
    icon: "\u26A1",
    title: "CLI",
    desc: "Build, scaffold, watch, restart",
    file: "terminal",
    code: `$ opencore build
$ opencore dev
$ opencore create resource inventory --with-client
$ opencore doctor`,
  },
  {
    id: "security",
    icon: "\uD83D\uDD12",
    title: "Security",
    desc: "Guards, throttles, validation by default",
    file: "SecurityExample.ts",
    code: `const SpawnCarSchema = z.object({
  model: z.string().min(1).max(32),
})

@Guard({ permission: 'admin.spawn' })
@Throttle(2, 10000)
@RequiresState({ has: ['spawned'], missing: ['dead'] })
@Command({ command: 'spawncar', schema: SpawnCarSchema })
async spawnCar(player: Player, model: string) {
  await this.vehicles.spawn(player, model)
}`,
  },
];

const PLATFORMS = [
  { name: "FiveM", style: "heroPlatformFiveM" as const },
  { name: "RedM", style: "heroPlatformRedM" as const },
  { name: "RageMP", style: "heroPlatformRageMP" as const },
];

const BENCHMARKS = [
  {
    value: "17.78M",
    label: "EventInterceptor ops/s",
    sub: "~0.056 \u00B5s mean",
  },
  { value: "10.49M", label: "RuntimeConfig ops/s", sub: "~0.095 \u00B5s mean" },
  {
    value: "80.14K",
    label: "Command throughput",
    sub: "500 players, p95 0.226 ms",
  },
  {
    value: "251.10K",
    label: "RPC throughput",
    sub: "500 parallel, p95 1.83 ms",
  },
];

const RELEASE_URL =
  "https://api.github.com/repos/newcore-network/opencore/releases/latest";

export default function Home(): JSX.Element {
  const [version, setVersion] = useState("latest");
  const [platform, setPlatform] = useState(0);
  const [platformHidden, setPlatformHidden] = useState(false);
  const [comp, setComp] = useState(COMPARISONS[0]);
  const [feat, setFeat] = useState(FEATURES[0]);

  useEffect(() => {
    fetch(RELEASE_URL, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.tag_name) setVersion(d.tag_name);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPlatformHidden(true);
      setTimeout(() => {
        setPlatform((p) => (p + 1) % PLATFORMS.length);
        setPlatformHidden(false);
      }, 280);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const selectComp = useCallback(
    (c: (typeof COMPARISONS)[0]) => setComp(c),
    [],
  );
  const selectFeat = useCallback((f: (typeof FEATURES)[0]) => setFeat(f), []);

  return (
    <Layout
      title="OpenCore"
      description="TypeScript-first multiplayer runtime with DI, validation, and security primitives"
    >
      <main className={styles.homeContainer}>
        <div className={styles.banner}>
          <div className={styles.bannerInner}>
            <span className={styles.bannerDot} />
            Star us on GitHub if you find OpenCore useful
            <Link
              className={styles.bannerLink}
              href="https://github.com/newcore-network/opencore"
            >
              &rarr; Star
            </Link>
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroGlow} />

          <div className={styles.floatingLeft}>
            <div className={styles.floatingSnippet}>
              <span className={styles.floatingLabel}>controller</span>
              <code>@Controller()</code>
            </div>
            <div
              className={clsx(styles.floatingSnippet, styles.floatingSnippet2)}
            >
              <span className={styles.floatingLabel}>guard</span>
              <code>
                @Guard({"{"} rank: 3 {"}"})
              </code>
            </div>
            <div
              className={clsx(styles.floatingSnippet, styles.floatingSnippet3)}
            >
              <span className={styles.floatingLabel}>schema</span>
              <code>z.coerce.number()</code>
            </div>
          </div>

          <div className={styles.floatingRight}>
            <div className={styles.floatingSnippet}>
              <span className={styles.floatingLabel}>throttle</span>
              <code>@Throttle(5, 2000)</code>
            </div>
            <div
              className={clsx(styles.floatingSnippet, styles.floatingSnippet2)}
            >
              <span className={styles.floatingLabel}>event</span>
              <code>@OnNet('bank:action')</code>
            </div>
            <div
              className={clsx(styles.floatingSnippet, styles.floatingSnippet3)}
            >
              <span className={styles.floatingLabel}>inject</span>
              <code>constructor(svc: Svc)</code>
            </div>
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroVersion}>
              <span className={styles.heroVersionDot} />
              {version}
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleAccent}>The runtime</span> for{" "}
              <span
                className={clsx(
                  styles[PLATFORMS[platform].style],
                  platformHidden && styles.heroPlatformHidden,
                )}
              >
                {PLATFORMS[platform].name}
              </span>
            </h1>
            <p className={styles.heroDesc}>
              TypeScript-first framework with dependency injection, Zod
              validation, and security primitives. Built for FiveM & RageMP —
              RedM coming next.
            </p>
            <div className={styles.heroButtons}>
              <Link className={styles.btnPrimary} to="/docs/intro">
                Get Started
              </Link>
              <Link
                className={styles.btnSecondary}
                href="https://github.com/newcore-network/opencore"
              >
                GitHub
              </Link>
              <Link
                className={styles.btnSecondary}
                href="https://discord.gg/hDG25CPwpM"
              >
                Discord
              </Link>
            </div>
          </div>

          <div className={styles.heroCodeWrap}>
            <div className={styles.codeBlock}>
              <div className={styles.codeBar}>
                <div className={styles.codeDots}>
                  <span className={clsx(styles.codeDot, styles.codeDotR)} />
                  <span className={clsx(styles.codeDot, styles.codeDotY)} />
                  <span className={clsx(styles.codeDot, styles.codeDotG)} />
                </div>
                <span className={styles.codeFilename}>BankController.ts</span>
              </div>
              <HeroCode code={HERO_CODE} className={styles.codeBody} />
            </div>
          </div>
        </section>

        <section className={styles.sectionBordered}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Compare</span>
            <h2 className={styles.sectionTitle}>Framework vs. Raw Code</h2>
            <p className={styles.sectionDesc}>
              See what changes when you adopt OpenCore instead of writing
              everything by hand.
            </p>
          </div>
          <div className={styles.compTabs}>
            {COMPARISONS.map((c) => (
              <button
                key={c.id}
                className={
                  comp.id === c.id ? styles.compTabActive : styles.compTab
                }
                onClick={() => selectComp(c)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div
            className={clsx(
              styles.compPane,
              comp.id === "opencore" && styles.compPaneActive,
            )}
          >
            <div className={styles.compPaneBar}>
              <span
                className={
                  comp.id === "opencore"
                    ? styles.compPaneLabelAccent
                    : styles.compPaneLabel
                }
              >
                {comp.label}
              </span>
              <span className={styles.compPaneLang}>{comp.file}</span>
            </div>
            <HeroCode code={comp.code} className={styles.compPaneCode} />
          </div>
        </section>

        <section className={styles.sectionBordered}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Features</span>
            <h2 className={styles.sectionTitle}>Everything Built-in</h2>
            <p className={styles.sectionDesc}>
              Primitives for secure, scalable, adapter-first multiplayer
              servers.
            </p>
          </div>
          <div className={styles.featGrid}>
            <div className={styles.featList}>
              {FEATURES.map((f) => (
                <button
                  key={f.id}
                  className={
                    feat.id === f.id ? styles.featItemActive : styles.featItem
                  }
                  onClick={() => selectFeat(f)}
                >
                  <span className={styles.featItemIcon}>{f.icon}</span>
                  <span className={styles.featItemLabel}>{f.title}</span>
                </button>
              ))}
            </div>
            <div className={styles.featPreview}>
              <div className={styles.featPreviewBar}>
                <div className={styles.codeDots}>
                  <span className={clsx(styles.codeDot, styles.codeDotR)} />
                  <span className={clsx(styles.codeDot, styles.codeDotY)} />
                  <span className={clsx(styles.codeDot, styles.codeDotG)} />
                </div>
                <span className={styles.featPreviewTitle}>{feat.file}</span>
              </div>
              <div className={styles.featDesc}>{feat.desc}</div>
              <HeroCode code={feat.code} className={styles.featPreviewBody} />
            </div>
          </div>
        </section>

        <section className={styles.sectionBordered}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Benchmarks</span>
            <h2 className={styles.sectionTitle}>Performance</h2>
            <p className={styles.sectionDesc}>
              Internal benchmarks — February 2026
            </p>
          </div>
          <div className={styles.perfGrid}>
            {BENCHMARKS.map((b) => (
              <div key={b.label} className={styles.perfCard}>
                <div className={styles.perfValue}>{b.value}</div>
                <div className={styles.perfLabel}>{b.label}</div>
                <div className={styles.perfSub}>{b.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>Ready to build?</h2>
            <p className={styles.ctaDesc}>
              OpenCore is free, open-source, and production-ready.
            </p>
            <Link className={styles.btnPrimary} to="/docs/intro">
              Read the docs
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
