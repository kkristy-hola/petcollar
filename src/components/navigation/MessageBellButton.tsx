"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotificationInbox } from "@/state/notification-context";

const BELL_BTN_CLASS =
  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-peach text-primary shadow-sm transition active:scale-95";

/**
 * 全局统一消息入口：右上角铃铛 → 消息中心
 */
export function MessageBellButton() {
  const { unreadTotal } = useNotificationInbox();
  const showDot = unreadTotal > 99;
  const showNum = unreadTotal > 0 && unreadTotal <= 99;

  return (
    <Link
      href="/profile/messages"
      className={BELL_BTN_CLASS}
      aria-label={unreadTotal > 0 ? `消息中心，${unreadTotal} 条未读` : "消息中心"}
    >
      <Bell className="h-5 w-5" strokeWidth={1.75} />
      {showNum ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {unreadTotal}
        </span>
      ) : showDot ? (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 shadow-sm" />
      ) : null}
    </Link>
  );
}
