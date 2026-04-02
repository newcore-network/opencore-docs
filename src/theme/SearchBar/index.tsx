import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useHistory, useLocation } from "@docusaurus/router";

interface DocEntry {
  title: string;
  description: string;
  slug: string;
  sections: { heading: string; content: string }[];
  content: string;
  code: string;
  category: string;
}

interface SearchResult {
  entry: DocEntry;
  score: number;
  matchField: "title" | "description" | "heading" | "content" | "code";
  matchText: string;
  heading?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "core-concepts": "Core Concepts",
  adapters: "Adapters",
  apis: "APIs",
  cli: "CLI",
  client: "Client",
  communication: "Communication",
  compiler: "Compiler",
  contracts: "Contracts",
  decorators: "Decorators",
  "dev-mode": "Dev Mode",
  entities: "Entities",
  libraries: "Libraries",
  "npc-agents": "NPC Agents",
  ports: "Ports",
  security: "Security",
  templates: "Templates",
  advanced: "Advanced",
  "api-reference": "API Reference",
};

function searchDocs(query: string, docs: DocEntry[]): SearchResult[] {
  if (!query || query.length < 2) return [];

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  const results: SearchResult[] = [];

  for (const entry of docs) {
    let bestScore = 0;
    let bestField: SearchResult["matchField"] = "title";
    let bestText = entry.title;
    let bestHeading: string | undefined;

    const titleScore = scoreMatch(entry.title, terms, 10);
    if (titleScore > bestScore) {
      bestScore = titleScore;
      bestField = "title";
      bestText = entry.title;
    }

    const descScore = scoreMatch(entry.description, terms, 7);
    if (descScore > bestScore) {
      bestScore = descScore;
      bestField = "description";
      bestText = entry.description;
    }

    for (const section of entry.sections) {
      const headScore = scoreMatch(section.heading, terms, 8);
      if (headScore > bestScore) {
        bestScore = headScore;
        bestField = "heading";
        bestText = section.heading;
        bestHeading = section.heading;
      }
      const secContentScore = scoreMatch(section.content, terms, 4);
      if (secContentScore > bestScore) {
        bestScore = secContentScore;
        bestField = "content";
        bestText = getSnippet(section.content, terms);
        bestHeading = section.heading;
      }
    }

    const contentScore = scoreMatch(entry.content, terms, 3);
    if (contentScore > bestScore) {
      bestScore = contentScore;
      bestField = "content";
      bestText = getSnippet(entry.content, terms);
    }

    const codeScore = scoreMatch(entry.code, terms, 5);
    if (codeScore > bestScore) {
      bestScore = codeScore;
      bestField = "code";
      bestText = getSnippet(entry.code, terms);
    }

    if (bestScore > 0) {
      results.push({
        entry,
        score: bestScore,
        matchField: bestField,
        matchText: bestText,
        heading: bestHeading,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}

function scoreMatch(text: string, terms: string[], weight: number): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let matched = 0;
  let bonus = 0;

  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx === -1) continue;
    matched++;

    if (idx === 0 || /\W/.test(lower[idx - 1])) bonus += 2;
    if (lower.includes(terms.join(" "))) bonus += 3;
  }

  if (matched === 0) return 0;
  const coverage = matched / terms.length;
  return coverage * weight + bonus;
}

function getSnippet(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  let earliest = text.length;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && idx < earliest) earliest = idx;
  }
  const start = Math.max(0, earliest - 40);
  const end = Math.min(text.length, earliest + 120);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < text.length) snippet += "…";
  return snippet;
}

function highlightTerms(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);

  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="oc-search-highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function FieldBadge({ field }: { field: SearchResult["matchField"] }) {
  const labels: Record<string, string> = {
    title: "Title",
    description: "Description",
    heading: "Section",
    content: "Content",
    code: "Code",
  };
  return <span className="oc-search-badge">{labels[field]}</span>;
}

export default function SearchBar(): React.JSX.Element | null {
  const { pathname } = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDocsPage = pathname === "/docs" || pathname.startsWith("/docs/");

  const pluginData = usePluginData("oc-search-index") as {
    index: DocEntry[];
  } | null;
  const docs = pluginData?.index ?? [];

  const results = useMemo(() => searchDocs(query, docs), [query, docs]);

  useEffect(() => {
    setActiveIdx(0);
  }, [results.length, query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIdx]) {
        e.preventDefault();
        navigateTo(results[activeIdx]);
      }
    },
    [results, activeIdx],
  );

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const navigateTo = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      const hash = result.heading
        ? "#" +
          result.heading
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
        : "";
      history.push(result.entry.slug + hash);
    },
    [history],
  );

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  }, []);

  if (!isDocsPage) return null;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  const trigger = (
    <button
      className="oc-search-trigger"
      onClick={() => setOpen(true)}
      type="button"
      aria-label="Search docs (Ctrl+K)"
    >
      <svg
        className="oc-search-trigger-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="oc-search-trigger-text">Search…</span>
      <kbd className="oc-search-trigger-kbd">
        {isMac ? "⌘" : "Ctrl"}
        <span>K</span>
      </kbd>
    </button>
  );

  const modal = open
    ? ReactDOM.createPortal(
        <div className="oc-search-overlay" onClick={handleBackdrop}>
          <div className="oc-search-modal" role="dialog" aria-modal="true">
            <div className="oc-search-input-row">
              <svg
                className="oc-search-input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                className="oc-search-input"
                type="text"
                placeholder="Search documentation…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                className="oc-search-close"
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Close"
              >
                <kbd>Esc</kbd>
              </button>
            </div>

            <div className="oc-search-results" ref={listRef}>
              {query.length >= 2 && results.length === 0 && (
                <div className="oc-search-empty">
                  <div className="oc-search-empty-icon">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                      <path d="m8 8 6 6" />
                      <path d="m14 8-6 6" />
                    </svg>
                  </div>
                  <p>
                    No results for "<strong>{query}</strong>"
                  </p>
                  <span>Try different keywords or check spelling</span>
                </div>
              )}

              {query.length < 2 && (
                <div className="oc-search-empty">
                  <div className="oc-search-empty-icon">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <p>Type to search across all documentation</p>
                  <span>
                    Search by title, content, code, or section headings
                  </span>
                </div>
              )}

              {results.map((result, i) => (
                <button
                  key={`${result.entry.slug}-${result.heading ?? ""}-${i}`}
                  className={`oc-search-result${i === activeIdx ? " oc-search-result--active" : ""}`}
                  onClick={() => navigateTo(result)}
                  onMouseEnter={() => setActiveIdx(i)}
                  type="button"
                >
                  <div className="oc-search-result-header">
                    <span className="oc-search-result-category">
                      {CATEGORY_LABELS[result.entry.category] ??
                        result.entry.category}
                    </span>
                    <FieldBadge field={result.matchField} />
                  </div>
                  <div className="oc-search-result-title">
                    {highlightTerms(result.entry.title, query)}
                    {result.heading && (
                      <span className="oc-search-result-section">
                        → {highlightTerms(result.heading, query)}
                      </span>
                    )}
                  </div>
                  {result.matchText && result.matchField !== "title" && (
                    <div className="oc-search-result-snippet">
                      {highlightTerms(result.matchText, query)}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {results.length > 0 && (
              <div className="oc-search-footer">
                <div className="oc-search-footer-keys">
                  <kbd>↑↓</kbd> navigate
                  <kbd>↵</kbd> open
                  <kbd>Esc</kbd> close
                </div>
                <span className="oc-search-footer-count">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
