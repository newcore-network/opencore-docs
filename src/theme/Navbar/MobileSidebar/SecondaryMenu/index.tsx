import React from "react";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";

export default function NavbarMobileSidebarSecondaryMenu(): React.JSX.Element {
  const secondaryMenu = useNavbarSecondaryMenu();
  return <>{secondaryMenu.content}</>;
}
