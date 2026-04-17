"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MapPin,
  Radio,
  Lightbulb,
  Volume2,
  Megaphone,
  Users,
  Phone,
  Delete,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { MessageBellButton } from "@/components/navigation/MessageBellButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SoftCard } from "@/components/ui/SoftCard";
import { mockFindPet, mockPet } from "@/data/mock";

export default function FindPetPage() {
  const [dialOpen, setDialOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "inCall" | "ended">("idle");
  const dialKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  function appendDialKey(key: string) {
    setPhoneNumber((prev) => (prev.length >= 20 ? prev : prev + key));
  }

  function removeLastDigit() {
    setPhoneNumber((prev) => prev.slice(0, -1));
  }

  function openDialer() {
    setCallStatus("dialing");
    setDialOpen(true);
    setPhoneNumber("");
  }

  function hangUpCall() {
    setCallStatus("ended");
    setDialOpen(false);
  }

  useEffect(() => {
    if (callStatus !== "ended") return;
    const timer = window.setTimeout(() => setCallStatus("idle"), 1600);
    return () => window.clearTimeout(timer);
  }, [callStatus]);

  return (
    <MobileShell
      withBottomNav={false}
      overlay={
        <button
          type="button"
          onClick={() => {
            if (callStatus === "inCall") {
              hangUpCall();
              return;
            }
            openDialer();
          }}
          className="pointer-events-auto absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom)+12px)] right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg"
          aria-label="一键呼叫"
        >
          <Phone className="h-6 w-6" />
        </button>
      }
    >
      <AppTopBar
        title="定位 · 找宠模式"
        showBack
        backHref="/tracking"
        rightSlot={
          <div className="flex items-center gap-2">
            <MessageBellButton />
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
              <Image
                src={mockPet.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          </div>
        }
      />
      <main className="px-5">
        <div className="relative mb-5 h-48 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sky-100 to-teal-50 shadow-[var(--shadow-soft)]">
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              距离约 {mockFindPet.distanceM} 米
            </span>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-surface-blue px-3 py-1 text-xs font-semibold text-secondary shadow-sm">
              <Radio className="h-3.5 w-3.5" />
              {mockFindPet.signal}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-md backdrop-blur">
            <div className="relative h-11 w-11 overflow-hidden rounded-full">
              <Image
                src={mockPet.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="44px"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white">
                ⚡
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary-deep">
                正在移动…
              </p>
              <p className="text-xs text-teal-muted">
                最后更新于 {mockFindPet.lastUpdate}
              </p>
            </div>
            <Link
              href="/tracking/trajectory"
              className="shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-on-primary"
            >
              路线追踪
            </Link>
          </div>
        </div>

        <div className="mb-5 flex flex-col items-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                className="text-surface-peach"
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                className="text-primary"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="240 24"
                strokeLinecap="round"
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-teal-muted">正在接近</p>
              <p className="text-4xl font-extrabold text-primary-deep">
                {mockFindPet.distanceM}m
              </p>
              <p className="text-sm text-secondary">{mockFindPet.stepsHint}</p>
            </div>
          </div>
          <p className="mt-2 max-w-xs text-center text-[11px] leading-relaxed text-teal-muted">
            友情提示：请保持冷静，跟随声音与灯光指引逐步靠近宠物。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SoftCard className="relative space-y-2 bg-surface-elevated p-4">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-yellow">
                <Lightbulb className="h-5 w-5 text-primary" />
              </span>
              <StatusBadge tone="neutral" className="!normal-case !text-[10px]">
                关
              </StatusBadge>
            </div>
            <p className="font-semibold text-primary-deep">开启项圈灯</p>
            <p className="text-xs text-teal-muted">在黑暗中更容易发现</p>
          </SoftCard>
          <SoftCard className="relative space-y-2 bg-surface-elevated p-4">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-blue">
                <Volume2 className="h-5 w-5 text-secondary" />
              </span>
              <StatusBadge tone="sky" className="!normal-case !text-[10px]">
                播放中
              </StatusBadge>
            </div>
            <p className="font-semibold text-primary-deep">鸣响寻回</p>
            <p className="text-xs text-teal-muted">发出特定频率声音</p>
          </SoftCard>
        </div>

        <SoftCard className="mt-3 flex items-center gap-3 bg-surface-red p-4">
          <Megaphone className="h-6 w-6 text-rose-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-primary-deep">广播语音</p>
            <p className="text-xs text-teal-muted">
              将录音下发到项圈扬声器（原型占位）
            </p>
          </div>
          <span className="text-stone-400">›</span>
        </SoftCard>

        <SoftCard className="mt-3 flex items-center gap-3 bg-surface-sky p-4">
          <Users className="h-6 w-6 text-secondary" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-primary-deep">通知周边邻里</p>
            <p className="text-xs text-teal-muted">
              向 500m 内用户发送求助（原型占位）
            </p>
          </div>
          <span className="text-stone-400">›</span>
        </SoftCard>
      </main>

      {dialOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={() => setDialOpen(false)}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[2rem] bg-surface-elevated px-5 pb-[env(safe-area-inset-bottom)] pt-5 shadow-[var(--shadow-soft)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-deep">一键呼叫</h3>
              <button
                type="button"
                onClick={() => {
                  setDialOpen(false);
                  if (callStatus === "dialing") setCallStatus("idle");
                }}
                className="text-sm font-semibold text-teal-muted"
              >
                取消
              </button>
            </div>

            <div className="rounded-2xl bg-surface-muted px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-secondary">电话号码</p>
              <p className="mt-1 min-h-7 text-2xl font-bold tracking-[0.08em] text-primary-deep">
                {phoneNumber || "-"}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {dialKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => appendDialKey(key)}
                  className="rounded-2xl bg-surface-muted px-3 py-3.5 text-lg font-semibold text-primary-deep shadow-sm"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={removeLastDigit}
                className="flex items-center justify-center rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-secondary"
                aria-label="删除一位"
              >
                <Delete className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDialOpen(false)}
                className="rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-secondary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (phoneNumber.trim()) setCallStatus("inCall");
                  setDialOpen(false);
                }}
                className="rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-on-primary"
              >
                拨号
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </MobileShell>
  );
}
