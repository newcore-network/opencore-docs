import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";

export default function MobileNav(): null {
  const { pathname } = useLocation();
  const isDocsPage = pathname === "/docs" || pathname.startsWith("/docs/");

  if (typeof document !== "undefined") {
    document.body.classList.toggle("oc-docs-page", isDocsPage);
  }

  useEffect(() => {
    document.body.classList.toggle("oc-docs-page", isDocsPage);
  }, [isDocsPage]);

  useEffect(() => {
    return () => document.body.classList.remove("oc-docs-page");
  }, []);

  return null;
}
