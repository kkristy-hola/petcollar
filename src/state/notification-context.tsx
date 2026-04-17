"use client";

import type { ReactNode } from "react";
import { getUnreadNotifications, useAppStore } from "@/state/app-store";

export function NotificationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useNotificationInbox() {
  const notifications = useAppStore((s) => s.notifications);
  const unreadTotal = getUnreadNotifications(notifications);

  return {
    unreadTotal,
    setUnreadTotal: () => {
      // 兼容旧 API：未读数由全局 notifications 自动推导
    },
  };
}
