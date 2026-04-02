import React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { ThemeClassNames, useThemeConfig } from "@docusaurus/theme-common";
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";

function NavbarBackdrop(props: React.ComponentProps<"div">) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx("navbar-sidebar__backdrop", props.className)}
    />
  );
}

function SidebarPortal({
  shown,
  onBackdropClick,
}: {
  shown: boolean;
  onBackdropClick: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={clsx("oc-sidebar-portal", shown && "oc-sidebar-portal--show")}
    >
      <NavbarBackdrop onClick={onBackdropClick} />
      <NavbarMobileSidebar />
    </div>,
    document.body,
  );
}

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    navbar: { hideOnScroll, style },
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);

  return (
    <>
      <nav
        ref={navbarRef}
        aria-label={translate({
          id: "theme.NavBar.navAriaLabel",
          message: "Main",
          description: "The ARIA label for the main navigation",
        })}
        className={clsx(
          ThemeClassNames.layout.navbar.container,
          "navbar",
          "navbar--fixed-top",
          hideOnScroll && [!isNavbarVisible && "navbarHidden"],
          {
            "navbar--dark": style === "dark",
            "navbar--primary": style === "primary",
          },
        )}
      >
        {children}
      </nav>
      <SidebarPortal
        shown={mobileSidebar.shown}
        onBackdropClick={mobileSidebar.toggle}
      />
    </>
  );
}
