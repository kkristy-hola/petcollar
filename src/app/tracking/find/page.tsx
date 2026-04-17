import Image from "next/image";
import {
  MapPin,
  Radio,
  Lightbulb,
  Volume2,
  Megaphone,
  Users,
  Phone,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { MessageBellButton } from "@/components/navigation/MessageBellButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SoftCard } from "@/components/ui/SoftCard";
import { mockFindPet, mockPet } from "@/data/mock";

export default function FindPetPage() {
  return (
    <MobileShell
      withBottomNav={false}
      overlay={
        <button
          type="button"
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
            <button
              type="button"
              className="shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-on-primary"
            >
              路线追踪
            </button>
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

    </MobileShell>
  );
}
