"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { REGIE_TABS } from "./regie-tabs";

interface Props {
  orgSlug: string;
  eventSlug: string;
}

export function RegieNav({ orgSlug, eventSlug }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/regie/${orgSlug}/${eventSlug}`;

  return (
    <nav
      aria-label="Navigation régie"
      className="-mx-4 overflow-x-auto sm:mx-0"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <ul className="flex min-w-max items-center gap-1 px-4 sm:px-0">
        {REGIE_TABS.map((tab) => {
          const href = base + tab.hrefSuffix;
          const isActive = tab.exact
            ? pathname === base || pathname === base + "/"
            : pathname.startsWith(base + tab.matchPrefix);
          const cls = isActive
            ? "bg-[var(--theme-primary,_#FF5E5B)]/10 font-semibold text-[var(--theme-primary,_#FF5E5B)]"
            : "text-brand-ink/70 hover:bg-brand-ink/5 hover:text-brand-ink";
          return (
            <li key={tab.key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary,_#FF5E5B)]/60 ${cls}`}
                style={{ touchAction: "manipulation" }}
              >
                <span aria-hidden className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
