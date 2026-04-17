"use client";

import { useEffect, useMemo, useState } from "react";
import { Cpu, HeartPulse, Megaphone, ShieldAlert } from "lucide-react";
import {
  countUnreadInbox,
  INITIAL_INBOX_MESSAGES,
  type InboxCategory,
  type InboxMessage,
  type InboxPriority,
} from "@/data/inbox-messages";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { useNotificationInbox } from "@/state/notification-context";

type TabKey = "all" | InboxCategory;

const CATEGORY_ICON: Record<InboxCategory, typeof ShieldAlert> = {
  safety: ShieldAlert,
  health: HeartPulse,
  device: Cpu,
  service: Megaphone,
};

/** 严重程度：仅用底色 + 细边线 + 图标色，不用文字标签 */
function cardTone(priority: InboxPriority) {
  if (priority === "critical") {
    return "border border-red-200/70 bg-red-50/50";
  }
  if (priority === "warning") {
    return "border border-amber-200/70 bg-amber-50/40";
  }
  return "border border-black/[0.04] bg-surface-elevated/90";
}

function iconTone(category: InboxCategory, priority: InboxPriority) {
  if (priority === "critical") {
    return "bg-red-100/90 text-red-600";
  }
  if (priority === "warning") {
    return "bg-amber-100/80 text-amber-800";
  }
  switch (category) {
    case "safety":
      return "bg-white/90 text-primary";
    case "health":
      return "bg-white/90 text-emerald-800";
    case "device":
      return "bg-white/90 text-secondary";
    case "service":
      return "bg-white/90 text-primary";
    default:
      return "bg-white/90 text-primary-deep";
  }
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "全部消息" },
  { key: "safety", label: "安全" },
  { key: "health", label: "健康" },
  { key: "device", label: "设备" },
  { key: "service", label: "服务" },
];

function MessageRow({
  item,
  onMarkRead,
}: {
  item: InboxMessage;
  onMarkRead: (id: string) => void;
}) {
  const unread = !item.read;
  const Icon = CATEGORY_ICON[item.category];

  return (
    <button
      type="button"
      onClick={() => {
        if (!item.read) onMarkRead(item.id);
      }}
      className={`relative w-full rounded-2xl px-3.5 py-3 text-left shadow-[0_8px_24px_rgb(38_26_0/0.04)] transition active:scale-[0.99] ${cardTone(
        item.priority,
      )}`}
    >
      {unread ? (
        <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden />
      ) : null}
      <div className="flex gap-3 pr-2">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconTone(
            item.category,
            item.priority,
          )}`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-snug text-primary-deep ${unread ? "font-semibold" : "font-normal text-primary-deep/85"}`}
          >
            {item.title}
          </p>
          <p className="mt-1 text-[11px] text-teal-muted">{item.time}</p>
        </div>
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const { setUnreadTotal } = useNotificationInbox();
  const [messages, setMessages] = useState<InboxMessage[]>(() => [...INITIAL_INBOX_MESSAGES]);
  const [tab, setTab] = useState<TabKey>("all");

  useEffect(() => {
    setUnreadTotal(countUnreadInbox(messages));
  }, [messages, setUnreadTotal]);

  const filtered = useMemo(() => {
    if (tab === "all") return messages;
    return messages.filter((m) => m.category === tab);
  }, [messages, tab]);

  function markRead(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  const unreadInTab = filtered.filter((m) => !m.read).length;

  function unreadForTab(key: TabKey) {
    if (key === "all") return messages.filter((m) => !m.read).length;
    return messages.filter((m) => m.category === key && !m.read).length;
  }

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="消息中心" showBack backHref="/profile" />

      <div className="sticky top-0 z-10 -mx-px border-b border-black/[0.04] bg-surface-muted/95 px-5 pb-2 pt-1 backdrop-blur-sm">
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const n = unreadForTab(t.key);
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`relative shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-muted/80 text-teal-muted"
                }`}
              >
                {t.label}
                {n > 0 ? (
                  <span
                    className={`ml-1 inline-flex min-w-[1rem] justify-center rounded-full px-1 text-[10px] font-bold ${
                      active ? "bg-white/25 text-white" : "bg-white/90 text-primary-deep"
                    }`}
                  >
                    {n > 9 ? "9+" : n}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <main className="space-y-2 px-5 pb-4 pt-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-teal-muted">该分类暂无消息</p>
        ) : (
          <>
            {unreadInTab > 0 ? (
              <p className="mb-2 text-[11px] text-teal-muted">本分类 {unreadInTab} 条未读</p>
            ) : null}
            {filtered.map((item) => (
              <MessageRow key={item.id} item={item} onMarkRead={markRead} />
            ))}
          </>
        )}
      </main>
    </MobileShell>
  );
}
