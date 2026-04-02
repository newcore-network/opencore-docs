import React, { useEffect, useState, memo, useRef } from "react";
import { createHighlighter, type Highlighter } from "shiki";

type HeroCodeProps = {
  code: string;
  className?: string;
};

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) return Promise.resolve(highlighterInstance);
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro", "github-light"],
      langs: ["typescript", "lua", "bash"],
    }).then((h) => {
      highlighterInstance = h;
      return h;
    });
  }
  return highlighterPromise;
}

function getTheme(): string {
  if (typeof document === "undefined") return "one-dark-pro";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "github-light"
    : "one-dark-pro";
}

export const HeroCode = memo(function HeroCode({
  code,
  className,
}: HeroCodeProps) {
  const [html, setHtml] = useState<string>("");
  const [theme, setTheme] = useState(getTheme);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    getHighlighter().then((highlighter) => {
      const result = highlighter.codeToHtml(code.trim(), {
        lang: "typescript",
        theme,
      });
      if (mountedRef.current) setHtml(result);
    });

    return () => {
      mountedRef.current = false;
    };
  }, [code, theme]);

  if (!html) {
    return (
      <div className={className} style={{ padding: "1.25rem", opacity: 0.3 }}>
        <pre
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            color: "#52525b",
          }}
        >
          {code.trim()}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.82rem",
        lineHeight: 1.7,
        textAlign: "left",
      }}
    />
  );
});
