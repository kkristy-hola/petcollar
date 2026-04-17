"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";

type Props = {
  children: ReactNode;
  /** 为底部导航预留滚动空间 */
  withBottomNav?: boolean;
  /** 固定在手机框架内的浮层（如 FAB），不参与滚动 */
  overlay?: ReactNode;
};

export function MobileShell({
  children,
  withBottomNav = true,
  overlay,
}: Props) {
  return (
    <div className="app-canvas">
      <div
        className={`relative flex h-full w-full max-w-[390px] flex-col bg-surface text-foreground shadow-[var(--shadow-soft)] sm:h-[min(844px,100dvh)] sm:rounded-[2rem] overflow-hidden border border-black/[0.04]`}
      >
        <div
          className={
            withBottomNav
              ? "app-scroll flex flex-col pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom)+var(--app-page-bottom-space))]"
              : "app-scroll flex flex-col pb-[calc(env(safe-area-inset-bottom)+var(--app-page-bottom-space))]"
          }
        >
          {children}
        </div>
        {overlay ? (
          <div className="pointer-events-none absolute inset-0">
            {overlay}
          </div>
        ) : null}
        {withBottomNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
