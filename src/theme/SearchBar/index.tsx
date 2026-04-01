import React, { useState } from "react";
import SearchBar from "@theme-original/SearchBar";
import { useLocation } from "@docusaurus/router";

type SearchBarProps = React.ComponentProps<typeof SearchBar>;

export default function CustomSearchBar(
  props: SearchBarProps,
): React.JSX.Element | null {
  const { pathname } = useLocation();
  const [focused, setFocused] = useState(false);

  if (!(pathname === "/docs" || pathname.startsWith("/docs/"))) {
    return null;
  }

  return (
    <div className={`oc-search-wrapper${focused ? " oc-search-focused" : ""}`}>
      <div className="oc-search-icon">
        <svg
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
      </div>
      <div
        className="oc-search-inner"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
      >
        <SearchBar {...props} />
      </div>
      {!focused && (
        <div className="oc-search-shortcut">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </div>
      )}
    </div>
  );
}
