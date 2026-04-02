import React from "react";
import clsx from "clsx";
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import NavbarItem from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import SearchBar from "@theme/SearchBar";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import NavbarLogo from "@theme/Navbar/Logo";
import NavbarSearch from "@theme/Navbar/Search";

import Link from "@docusaurus/Link";

function useNavbarItems() {
  return useThemeConfig().navbar.items as any[];
}

function NavbarItems({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.\n${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          "navbar__items",
        )}
      >
        {left}
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          "navbar__items navbar__items--right",
        )}
      >
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent(): React.JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item: any) => item.type === "search");

  const { pathname } = useLocation();
  const isDocsPage = pathname === "/docs" || pathname.startsWith("/docs/");

  const filteredLeftItems = isDocsPage
    ? leftItems.filter((item: any) => item.className !== "navbar__link--docs")
    : leftItems;

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && isDocsPage && (
            <NavbarMobileSidebarToggle />
          )}
          <NavbarLogo />
          {isDocsPage && (
            <Link to="/" className="navbar__link navbar__link--docs">
              Home
            </Link>
          )}
          <NavbarItems items={filteredLeftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />
          <NavbarColorModeToggle />
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
        </>
      }
    />
  );
}
