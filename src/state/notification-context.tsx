"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { countUnreadInbox, INITIAL_INBOX_MESSAGES } from "@/data/inbox-messages";

type NotificationContextValue = {
  unreadTotal: number;
  setUnreadTotal: (n: number) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadTotal, setUnreadTotalState] = useState(() =>
    countUnreadInbox(INITIAL_INBOX_MESSAGES),
  );

  const setUnreadTotal = useCallback((n: number) => {
    setUnreadTotalState(Math.max(0, n));
  }, []);

  const value = useMemo(
    () => ({
      unreadTotal,
      setUnreadTotal,
    }),
    [unreadTotal, setUnreadTotal],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationInbox() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationInbox must be used within NotificationProvider");
  }
  return ctx;
}
