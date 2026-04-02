import React from "react";
import Link from "@docusaurus/Link";

const links = {
  Framework: [
    { label: "Introduction", to: "/docs/intro" },
    { label: "Decorators", to: "/docs/decorators/introduction" },
    { label: "Gameplay APIs", to: "/docs/apis/vehicles" },
  ],
  Community: [
    { label: "Discord", href: "https://discord.gg/hDG25CPwpM" },
    { label: "GitHub", href: "https://github.com/newcore-network/opencore" },
  ],
  Resources: [
    {
      label: "Release Notes",
      href: "https://github.com/newcore-network/opencore/releases",
    },
  ],
};

export default function Footer(): React.JSX.Element {
  return (
    <footer className="oc-footer">
      <div className="oc-footer__accent" />
      <div className="oc-footer__inner">
        <div className="oc-footer__top">
          <div className="oc-footer__brand">
            <Link to="/" className="oc-footer__logo">
              OpenCore
            </Link>
            <p className="oc-footer__tagline">
              Built for the multiplayer ecosystem.
            </p>
          </div>

          <nav className="oc-footer__nav">
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className="oc-footer__group">
                <h4 className="oc-footer__group-title">{title}</h4>
                <ul className="oc-footer__group-list">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        className="oc-footer__link"
                        {...("to" in item
                          ? { to: item.to }
                          : { href: item.href })}
                      >
                        {item.label}
                        {"href" in item && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M3.5 2h6.5v6.5M9.5 2.5L2 10"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="oc-footer__bottom">
          <span className="oc-footer__copyright">
            © {new Date().getFullYear()} OpenCore
          </span>
        </div>
      </div>
    </footer>
  );
}
