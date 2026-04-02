import React, { useState, useRef, useEffect } from "react";

export default function ColorModeToggle(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getColorMode = () => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") || "dark";
  };

  const [colorMode, setColorModeState] = useState(getColorMode);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setColorModeState(getColorMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const icons: Record<string, React.ReactNode> = {
    light: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
    dark: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    system: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  };

  const labels: Record<string, string> = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  const applyMode = (mode: string) => {
    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light",
      );
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem("theme", mode);
    }
    setOpen(false);
  };

  return (
    <div className="oc-colormode" ref={ref}>
      <button
        className="oc-colormode-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle color mode"
        type="button"
      >
        {icons[colorMode]}
      </button>
      {open && (
        <div className="oc-colormode-dropdown">
          {["light", "dark", "system"].map((mode) => (
            <button
              key={mode}
              className={`oc-colormode-option${colorMode === mode ? " oc-colormode-active" : ""}`}
              onClick={() => applyMode(mode)}
              type="button"
            >
              <span className="oc-colormode-option-icon">{icons[mode]}</span>
              <span>{labels[mode]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
