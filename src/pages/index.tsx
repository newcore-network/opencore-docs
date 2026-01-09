import { JSX, useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';
import { HeroCode } from '../components/HeroCode'


// Content for the Hero Code Block
const CODE_EXAMPLE = `
// Listen
@Server.Controller()
export class BankController {

  @Server.Guard({ rank: 1 }) // Protected by Rank 1
  @Server.Throttle(1, 2000) // 1 attempt every 2 seconds
  @Server.Command({
    command: 'transfer',
    usage: '/tranfer <amount> <playerID>',
  }) // Command definition
  async transfer(player: Server.Player, ammount: number, playerID: number) {
    // Auto type checks primitive values, using zodtype verifications
    await this.bankService.move(player, args)
  }
}`;

const RELEASE_URL =
    'https://api.github.com/repos/newcore-network/opencore/releases/latest';

type GitHubRelease = {
    tag_name: string
}

export default function Home(): JSX.Element {
    const [tag, setTag] = useState<string>('—');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(RELEASE_URL, {
                    headers: {
                        Accept: 'application/vnd.github+json',
                    },
                });

                if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
                const data = (await res.json()) as GitHubRelease;

                if (!cancelled) setTag(data.tag_name ?? '—');
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message ?? 'Unknown error');
                    setTag('—');
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Layout
            title="OpenCore Framework"
            description="The TypeScript-first multiplayer runtime for FiveM"
        >
            <main className={styles.homeContainer}>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>
                                <span className={styles.badgeDot}></span>
                                {tag} Open Stable Beta
                            </div>
                            <h1 className={styles.heroTitle}>
                                The Industrial <br />
                                <span className={styles.gradientText}>Runtime for FiveM</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                A strict, Hexagonal Architecture framework.
                                Dependency Injection, Zod validation, and security primitives
                                out of the box. Not a gamemode—an engine.
                            </p>

                            <div className={styles.heroActions}>
                                <Link className={clsx('button button--lg', styles.primaryBtn)} to="/docs/intro">
                                    Get Started
                                </Link>
                                <Link
                                    className={clsx('button button--lg', styles.secondaryBtn)}
                                    href="https://github.com/newcore-network/opencore"
                                >
                                    GitHub
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

                                <HeroCode code={CODE_EXAMPLE} />
                            </div>
                        </div>

                    </div>

                </section>

                {/* BENTO GRID FEATURES */}
                <section className={styles.features}>
                    <div className={styles.sectionHeader}>
                        <h2>Engineered for Scale</h2>
                        <p>Built on the Ports & Adapters architecture. Agnostic kernel, specific runtime.</p>
                    </div>

                    <div className={styles.bentoGrid}>
                        <FeatureCard
                            title="Architecture-first"
                            description="OpenCore is built around Hexagonal Architecture. The game runtime is just an adapter—your domain stays pure."
                            className={styles.cardLarge}
                            docLink='docs/intro.md'
                            docString='Read more'
                        />

                        <FeatureCard
                            title="Declarative Gameplay"
                            description="Commands, events, guards and throttles are declared through decorators. No imperative glue code."
                            docLink='docs/intro.md'
                            docString='Read more'
                        />

                        <FeatureCard
                            title="Utility Ports & Services"
                            description="Use our ports and services API to enrich your experience without having to build everything from scratch."
                            docLink='docs/intro.md'
                            docString='Read more'
                        />
                    </div>

                </section>

                <section className={styles.architecture}>
                    <h2>A clear mental model</h2>
                    <p>
                        OpenCore separates domain logic from the game runtime.
                        Controllers declare intent, services hold logic,
                        adapters connect to FiveM.
                    </p>

                    <ul className={styles.archList}>
                        <li><strong>Kernel</strong>framework kernel, DI, event bus</li>
                        <li><strong>Runtime</strong>gameplay features, bounded contexts</li>
                        <li><strong>Adapters</strong>FiveM, Node.js, tooling</li>
                    </ul>
                </section>

                <section className={styles.cta}>
                    <h2>Start building with intent</h2>
                    <p>
                        OpenCore is not a script collection.
                        It is an engine for long-term projects.
                    </p>

                    <Link className={styles.primaryBtn} to="/docs/intro">
                        Read the docs
                    </Link>
                </section>


                {/* STATS / PERFORMANCE */}
                <section className={styles.stats}>
                    <div className={styles.statContent}>
                        <h3>High Performance</h3>
                        <p>Based on internal benchmarks (Dec 2025)</p>
                    </div>
                    <div className={styles.statGrid}>
                        <StatItem value="14M+" label="Ops/Sec (Commands)" />
                        <StatItem value="0.25ms" label="p95 Latency" />
                        <StatItem value="100%" label="TypeScript" />
                    </div>
                </section>
            </main>
        </Layout>
    );
}

function FeatureCard({
    title,
    description,
    className,
    docLink,
    docString,
}: {
    title: string
    description: string
    className?: string
    docLink?: string
    docString?: string
}) {
    return (
        <div className={clsx(styles.featureCard, className)}>
            <h3>{title}</h3>
            <p>{description}</p>

            {docLink && docString && (
                <Link to={docLink} className={styles.cardLink}>
                    {docString}
                </Link>
            )}
        </div>
    )
}



function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <div className={styles.statItem}>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}