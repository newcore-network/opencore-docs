import React from "react";
import MobileNav from "@site/src/components/MobileNav";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  );
}
