"use client";

import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { mockJourneyEvents } from "@/data/mock";
import { usePets } from "@/state/pets-context";

export default function DailyReportPage() {
  const { pets, selectedPetId } = usePets();
  const currentPet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="当日报告" showBack backHref="/health" />
      <main className="px-5">
        <PetSwitch includeAll={false} className="mb-3" />
        <SectionHeader
          overline="每日运动"
          title={`${currentPet.name} · 今日行程`}
          description="时间线视图，串联散步、休息与玩耍。"
        />

        <SoftCard className="mb-6 flex items-center gap-3 bg-surface-peach/90 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-inner">
            ⚡
          </span>
          <p className="text-sm font-semibold leading-snug text-primary-deep">
            {currentPet.name} 的活力在下午 4 点达到峰值
          </p>
        </SoftCard>

        <div className="relative pl-6">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-surface-peach" />
          <ul className="space-y-6">
            {mockJourneyEvents.map((ev, i) => (
              <li key={ev.id} className="relative">
                <span className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary ring-2 ring-surface-peach">
                  {i + 1}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-teal-muted">
                    {ev.time} {ev.period}
                  </p>
                  {ev.badge ? (
                    <StatusBadge tone="teal" className="!normal-case">
                      {ev.badge}
                    </StatusBadge>
                  ) : null}
                </div>
                <p className="mt-1 text-base font-bold text-primary-deep">
                  {ev.title}
                </p>
                <SoftCard className="mt-2 bg-surface-elevated p-3 text-sm text-teal-muted">
                  片段摘要与配图占位（与轨迹页一致的 mock 数据）。
                </SoftCard>
              </li>
            ))}
          </ul>
        </div>

        <SoftCard className="mt-8 bg-surface-elevated p-5">
          <p className="text-lg font-bold text-primary-deep">今日小结</p>
          <p className="mt-2 text-sm leading-relaxed text-teal-muted">
            活动分布均衡，午后高强度片段明显；夜间恢复充足，可继续保持当前散步节奏。
          </p>
          <Link
            href="/health"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#a07820] px-5 py-3.5 text-sm font-semibold text-on-primary shadow-sm"
          >
            返回健康总览
          </Link>
        </SoftCard>
      </main>
    </MobileShell>
  );
}
