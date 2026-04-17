"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, HeartPulse, UserRound } from "lucide-react";
import { appBrand } from "@/data/mock";

const tabs = [
  { href: "/", label: "首页", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/tracking",
    label: "定位",
    icon: MapPin,
    match: (p: string) => p.startsWith("/tracking"),
  },
  {
    href: "/health",
    label: "健康",
    icon: HeartPulse,
    match: (p: string) => p.startsWith("/health"),
  },
  {
    href: "/profile",
    label: "我的",
    icon: UserRound,
    match: (p: string) => p.startsWith("/profile"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-40 rounded-t-[1.85rem] border-t border-black/[0.03] bg-[#fffefb]/95 px-2 pt-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgb(38_26_0/0.05)] backdrop-blur-md"
      aria-label={`${appBrand.nameZh} 主导航`}
    >
      <div className="mx-auto flex max-w-md items-end justify-between gap-0.5">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className="flex min-w-0 flex-1 flex-col items-center justify-end py-1"
            >
              <span
                className={
                  active
                    ? "flex w-full max-w-[5.5rem] flex-col items-center gap-0.5 rounded-[2rem] bg-primary px-2 py-1.5 text-on-primary shadow-[0_6px_20px_rgb(127_87_0/0.28)]"
                    : "flex flex-col items-center gap-0.5 py-1.5 text-teal-muted"
                }
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2 : 1.65} />
                <span
                  className={
                    active
                      ? "text-[10px] font-semibold leading-none text-on-primary"
                      : "text-[10px] font-medium leading-none text-teal-muted"
                  }
                >
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
