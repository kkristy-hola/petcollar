"use client";

import Link from "next/link";
import { Bone, Smile, Moon, Droplets, Syringe, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ListRowCard } from "@/components/ui/ListRowCard";
import { mockAiLive, mockAiWeekly } from "@/data/mock";
import { usePets } from "@/state/pets-context";

function WeeklyDonut() {
  const pct = mockAiWeekly.activityPct;
  const c = 2 * Math.PI * 38;
  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            className="text-stone-200"
            stroke="currentColor"
            strokeWidth="14"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            className="text-primary"
            stroke="currentColor"
            strokeWidth="14"
            strokeDasharray={`${c * 0.42} ${c}`}
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            className="text-secondary"
            stroke="currentColor"
            strokeWidth="14"
            strokeDasharray={`${c * 0.33} ${c}`}
            strokeDashoffset={-c * 0.42}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-extrabold text-primary-deep">{pct}%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-muted">
            活跃占比
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-primary-deep">
        日常节律分布
      </p>
      <ul className="mt-4 w-full space-y-2 px-2">
        {mockAiWeekly.distribution.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between text-sm text-primary-deep"
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${row.color === "brown" ? "bg-primary" : row.color === "teal" ? "bg-secondary" : "bg-stone-300"}`}
              />
              {row.label}
            </span>
            <span className="font-semibold">{row.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AiPage() {
  const { pets, selectedPetId } = usePets();
  const currentPet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="AI 分析" showBack backHref="/health" />
      <main className="space-y-4 px-5">
        <PetSwitch includeAll={false} className="mb-1" />
        <SectionHeader
          overline="实时分析"
          title={`${currentPet.name} 的活力指数`}
          description="基于行为映射的实时健康洞察（原型）。"
        />

        <SoftCard className="relative overflow-hidden bg-surface-yellow p-5">
          <StatusBadge tone="neutral" className="!normal-case bg-white/80">
            整体健康
          </StatusBadge>
          <p className="mt-3 text-4xl font-extrabold text-primary-deep">
            {mockAiLive.vitalityPct}%
          </p>
          <p className="text-sm font-semibold text-primary">活力评分</p>
          <p className="mt-3 max-w-[85%] text-sm leading-relaxed text-teal-muted">
            {currentPet.name} 在同年龄段中排名前 5%，能量水平理想。
          </p>
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border-[14px] border-white/50" />
        </SoftCard>

        <SoftCard className="space-y-4 bg-surface-blue p-5">
          <div className="flex items-start justify-between">
            <Bone className="h-5 w-5 text-secondary" />
            <StatusBadge tone="rose" className="!normal-case">
              提醒
            </StatusBadge>
          </div>
          <p className="text-lg font-bold text-secondary">行为</p>
          <div>
            <div className="mb-1 flex justify-between text-xs text-teal-muted">
              <span>正常 {mockAiLive.behaviorNormal}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${mockAiLive.behaviorNormal}%` }}
              />
            </div>
            <div className="mt-3 mb-1 flex justify-between text-xs text-teal-muted">
              <span>抓挠 {mockAiLive.behaviorScratch}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${mockAiLive.behaviorScratch}%` }}
              />
            </div>
          </div>
        </SoftCard>

        <SoftCard className="bg-surface-sage p-5 text-emerald-950">
          <div className="mb-2 flex items-center gap-2">
            <Smile className="h-5 w-5" />
            <p className="text-lg font-bold">情绪趋势</p>
          </div>
          <p className="text-2xl font-extrabold">{mockAiLive.emotion}</p>
          <p className="mt-2 text-sm opacity-90">{mockAiLive.emotionDesc}</p>
          <div className="mt-4 flex gap-1">
            {[40, 70, 55, 80, 60, 90, 75].map((w, i) => (
              <div
                key={i}
                className="h-8 flex-1 rounded-full bg-white/35"
                style={{ opacity: 0.35 + w / 200 }}
              />
            ))}
          </div>
        </SoftCard>

        <SoftCard className="flex flex-col items-center bg-surface-muted/90 p-6">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-secondary bg-surface-elevated shadow-inner">
            <Moon className="h-10 w-10 text-secondary" />
            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs shadow">
              ✦
            </span>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            睡眠分析
          </p>
          <p className="text-3xl font-extrabold text-primary-deep">
            {mockAiLive.sleep}
          </p>
          <p className="mt-2 text-center text-sm text-teal-muted">
            深度睡眠占休息周期的 {mockAiLive.sleepDeepPct}
            %，恢复充分、压力较低。
          </p>
        </SoftCard>

        <div>
          <h3 className="mb-3 text-lg font-bold text-primary-deep">
            健康提示
          </h3>
          <div className="space-y-3">
            <ListRowCard
              icon={<Droplets className="h-5 w-5 text-primary" />}
              title="补水提醒"
              subtitle="活动偏高，记得补充水碗并观察饮水频率。"
              trailing={false}
              className="!shadow-sm"
            />
            <ListRowCard
              icon={<Syringe className="h-5 w-5 text-secondary" />}
              title="运动量"
              subtitle="抓挠占比上升，留意环境与潜在过敏源。"
              trailing={false}
              className="!shadow-sm"
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-muted">
                行为分析
              </p>
              <h3 className="mt-1 text-2xl font-bold text-primary-deep">
                每周活力洞察
              </h3>
              <p className="mt-1 text-xs text-teal-muted">{mockAiWeekly.range}</p>
            </div>
            <StatusBadge tone="teal" className="!normal-case shrink-0">
              最新
            </StatusBadge>
          </div>

          <SoftCard className="bg-surface-elevated p-2">
            <WeeklyDonut />
          </SoftCard>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SoftCard className="bg-surface-yellow/90 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                Safety Score
              </p>
              <p className="mt-2 text-2xl font-extrabold text-primary-deep">
                {mockAiWeekly.safety}
              </p>
              <p className="mt-2 text-xs text-teal-muted">
                与品种基准高度一致。
              </p>
            </SoftCard>
            <SoftCard className="bg-surface-sage/90 p-4 text-emerald-950">
              <p className="text-[10px] font-bold uppercase tracking-wide">
                Anomaly Events
              </p>
              <p className="mt-2 text-2xl font-extrabold">{mockAiWeekly.anomalies}</p>
              <p className="mt-2 text-xs opacity-90">本周未检测到异常行为。</p>
            </SoftCard>
          </div>

          <SoftCard className="mt-4 bg-surface-elevated p-5">
            <div className="mb-2 flex items-center gap-2 text-primary-deep">
              <Sparkles className="h-4 w-4" />
              <p className="font-bold">本周总结</p>
            </div>
            <p className="text-sm leading-relaxed text-teal-muted">
              {mockAiWeekly.summary}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-peach pt-4 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-muted">
                  连续活跃
                </p>
                <p className="text-lg font-bold text-secondary">
                  {mockAiWeekly.streak}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-muted">
                  社交情绪
                </p>
                <p className="text-lg font-bold text-secondary">
                  {mockAiWeekly.mood}
                </p>
              </div>
            </div>
          </SoftCard>

          <SoftCard className="mt-4 bg-gradient-to-b from-secondary to-primary p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              运动特征
            </p>
            <p className="mt-2 text-lg font-bold">
              检测到更高效的运动模式。
            </p>
          </SoftCard>

          <Link
            href="/health"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-surface-peach py-3 text-sm font-semibold text-primary"
          >
            返回运动健康
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
