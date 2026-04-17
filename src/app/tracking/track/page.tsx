"use client";

import Link from "next/link";
import {
  MapPin,
  Moon,
  Footprints,
  Compass,
  Zap,
  Activity,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { mockJourneyEvents } from "@/data/mock";
import { usePets } from "@/state/pets-context";

export default function TrackPage() {
  const { pets, selectedPetId } = usePets();
  const currentPet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="轨迹查询" showBack backHref="/tracking" />
      <main className="px-5">
        <PetSwitch includeAll={false} className="mb-3" />
        <SectionHeader
          overline="每日运动"
          title={`${currentPet.name} · 今日行程`}
          description="按时间线回顾活动片段（原型数据）。"
        />

        <SoftCard className="mb-6 flex items-center gap-3 bg-surface-peach/90 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-inner">
            <Zap className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold leading-snug text-primary-deep">
            Buddy 的活力在下午 4 点达到峰值
          </p>
        </SoftCard>

        <div className="relative pl-6">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-surface-peach" />
          <ol className="space-y-8">
            {mockJourneyEvents.map((ev, i) => (
              <li key={ev.id} className="relative">
                <span className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated text-[10px] font-bold text-primary ring-2 ring-surface-peach">
                  {i + 1}
                </span>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="text-xs text-teal-muted">
                    {ev.time} {ev.period}
                  </p>
                  <StatusBadge tone="teal" className="!normal-case">
                    <MapPin className="h-3 w-3" />
                    片段
                  </StatusBadge>
                </div>
                <p className="mb-2 text-base font-bold text-primary-deep">
                  {ev.title}
                </p>

                {ev.type === "walk" ? (
                  <SoftCard className="overflow-hidden bg-surface-elevated p-0">
                    <div className="relative h-36 bg-gradient-to-br from-teal-100 to-amber-50">
                      <div className="absolute inset-0 flex items-center justify-center opacity-60">
                        <Footprints className="h-16 w-16 text-secondary" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-secondary/90 px-3 py-2 text-xs text-white">
                        {ev.caption}
                      </div>
                    </div>
                  </SoftCard>
                ) : null}

                {ev.type === "nap" ? (
                  <SoftCard className="flex items-center gap-4 bg-surface-peach/80 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner">
                      <Moon className="h-7 w-7 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-teal-muted">{ev.deepSleep}</p>
                      <p className="text-xs text-teal-muted">{ev.bpm}</p>
                      <p className="mt-1 text-2xl font-bold text-primary-deep">
                        {ev.duration}
                      </p>
                    </div>
                  </SoftCard>
                ) : null}

                {ev.type === "play" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <SoftCard className="flex min-h-[140px] flex-col justify-between bg-slate-800 p-3 text-white">
                      <Activity className="h-8 w-8 text-amber-300" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                        安全活动
                      </p>
                    </SoftCard>
                    <div className="flex flex-col gap-3">
                      <SoftCard className="bg-orange-100 p-3 text-center">
                        <p className="text-lg font-extrabold text-primary-deep">
                          842
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-muted">
                          kcal
                        </p>
                      </SoftCard>
                      <SoftCard className="bg-secondary/90 p-3 text-center text-white">
                        <p className="text-sm font-bold">高强度</p>
                        <p className="text-[10px] opacity-80">短时爆发</p>
                      </SoftCard>
                    </div>
                  </div>
                ) : null}

                {ev.type === "evening" ? (
                  <SoftCard className="space-y-4 bg-surface-elevated p-4">
                    <div className="flex items-center gap-2 text-sm text-teal-muted">
                      <Compass className="h-4 w-4 text-primary" />
                      <span>{ev.routine}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className="text-surface-peach"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className="text-primary"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${ev.goalPct}, 100`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-deep">
                          {ev.goalPct}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary-deep">
                          每日目标
                        </p>
                        <p className="text-xs text-teal-muted">{ev.goalLeft}</p>
                      </div>
                    </div>
                  </SoftCard>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <SoftCard className="mt-8 bg-surface-elevated p-5">
          <p className="text-lg font-bold text-primary-deep">活力评分</p>
          <div className="mt-3 flex gap-6">
            <div>
              <p className="text-3xl font-extrabold text-primary">92</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                出色的一天
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-secondary">14k</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                步数
              </p>
            </div>
          </div>
          <Link
            href="/profile/messages?tab=safety"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#a07820] px-5 py-3.5 text-sm font-semibold text-on-primary shadow-sm"
          >
            查看告警记录
          </Link>
        </SoftCard>
      </main>
    </MobileShell>
  );
}
