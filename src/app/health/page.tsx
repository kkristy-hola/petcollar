"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  Footprints,
  Moon,
  PawPrint,
  ShieldCheck,
} from "lucide-react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { MobileShell } from "@/components/layout/MobileShell";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { usePets, type PetProfile } from "@/state/pets-context";

type Period = "day" | "week" | "month";

type HealthMetrics = {
  activeMinutes: number;
  activityKcal: number;
  vitalityScore: number | null;
  scoreLabel: string;
  restRegularityPct: number;
  behavior: { label: string; pct: number; color: string }[];
  weekBars: number[];
  monthBars: number[];
  anomalyCount: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function seed(id: string) {
  return id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function scoreLabel(score: number | null) {
  if (score === null) return "数据积累中";
  if (score >= 95) return "今日超棒";
  if (score >= 90) return "活力满满";
  if (score >= 80) return "活力不错";
  return "状态稳定";
}

function calculateHealth(pet: PetProfile): HealthMetrics {
  const weightKg = Math.max(1, Number.parseFloat(pet.weightKg) || 1);
  const activeMinutes = clamp(Math.round(pet.steps / 85), 20, 180);
  const lowMinutes = Math.round(activeMinutes * 0.36);
  const mediumMinutes = Math.round(activeMinutes * 0.44);
  const highMinutes = activeMinutes - lowMinutes - mediumMinutes;
  const activityKcal = Math.round(
    weightKg * (lowMinutes * 0.03 + mediumMinutes * 0.06 + highMinutes * 0.1),
  );
  const coverage = pet.online ? 0.92 : 0.46;
  const stepCompletion = clamp(pet.steps / Math.max(1, pet.stepsGoal), 0, 1);
  const activeCompletion = clamp(activeMinutes / 90, 0, 1);
  const restRegularity = clamp(1 - Math.abs(pet.sleepHours - 9) / 4, 0, 1);
  const vitalityScore =
    coverage < 0.5
      ? null
      : Math.round(
          75 +
            25 *
              (stepCompletion * 0.45 +
                activeCompletion * 0.25 +
                restRegularity * 0.2 +
                coverage * 0.1),
        );
  const restPct = clamp(Math.round(37 + pet.sleepHours * 1.4), 42, 55);
  const highPct = clamp(Math.round(11 + highMinutes / 4), 12, 24);
  const lowPct = 100 - restPct - highPct;
  const s = seed(pet.id);

  return {
    activeMinutes,
    activityKcal,
    vitalityScore,
    scoreLabel: scoreLabel(vitalityScore),
    restRegularityPct: Math.round(restRegularity * 100),
    behavior: [
      { label: "休息/疑似睡眠", pct: restPct, color: "#8eb6bd" },
      { label: "轻中度活动", pct: lowPct, color: "#c5a66f" },
      { label: "高强度活动", pct: highPct, color: "#7f5700" },
    ],
    weekBars: [72, 84, 63, 91, 77, 88, 80].map((value, index) =>
      clamp(value + ((s + index * 5) % 9) - 4, 45, 100),
    ),
    monthBars: [62, 68, 66, 76, 72, 82, 79, 87].map((value, index) =>
      clamp(value + ((s + index * 3) % 7) - 3, 45, 100),
    ),
    anomalyCount: pet.online ? s % 2 : 1,
  };
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[1.5rem] p-4 shadow-[0_16px_36px_rgb(38_26_0/0.055)] ${className}`}>
      {children}
    </section>
  );
}

function ScoreCard({ metrics }: { metrics: HealthMetrics }) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-[#fff0d2] via-[#fff8ea] to-[#dfeeea]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-muted">今日活力分</p>
          {metrics.vitalityScore === null ? (
            <p className="mt-2 text-2xl font-extrabold text-primary-deep">数据积累中</p>
          ) : (
            <p className="mt-1 text-5xl font-extrabold tracking-tight text-primary-deep">
              {metrics.vitalityScore}
              <span className="ml-1 text-sm font-semibold text-teal-muted">分</span>
            </p>
          )}
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1 text-xs font-bold text-secondary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {metrics.scoreLabel}
          </p>
        </div>
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/65 shadow-inner">
          <div className="absolute inset-2 rounded-full border-[7px] border-primary/15 border-t-primary" />
          <PawPrint className="h-8 w-8 text-primary" />
        </div>
      </div>
    </Card>
  );
}

function MetricCard({ icon, label, value, note, tone = "warm" }: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  tone?: "warm" | "blue";
}) {
  return (
    <div className={`rounded-2xl p-3.5 ${tone === "blue" ? "bg-surface-blue/85" : "bg-white/82"}`}>
      <div className="mb-2 text-secondary">{icon}</div>
      <p className="text-[10px] font-semibold text-teal-muted">{label}</p>
      <p className="mt-0.5 text-xl font-extrabold text-primary-deep">{value}</p>
      <p className="mt-1 text-[10px] leading-snug text-teal-muted">{note}</p>
    </div>
  );
}

function BehaviorBar({ metrics }: { metrics: HealthMetrics }) {
  return (
    <Card className="bg-surface-elevated">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary-deep">基础行为分布</h3>
        <span className="text-[10px] font-semibold text-teal-muted">今日记录</span>
      </div>
      <div className="flex h-4 overflow-hidden rounded-full bg-surface-muted">
        {metrics.behavior.map((item) => (
          <span key={item.label} style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {metrics.behavior.map((item) => (
          <li key={item.label} className="min-w-0">
            <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <p className="mt-1 text-[10px] leading-snug text-teal-muted">{item.label}</p>
            <p className="mt-0.5 text-sm font-extrabold text-primary-deep">{item.pct}%</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TrendBars({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div className="mt-4 flex h-28 items-end justify-between gap-1.5">
      {values.map((value, index) => (
        <div key={`${labels[index]}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div className="relative w-full flex-1 overflow-hidden rounded-full bg-[#f0e8df]">
            <span className="absolute inset-x-0 bottom-0 rounded-full bg-primary/82" style={{ height: `${value}%` }} />
          </div>
          <span className="text-[9px] font-semibold text-teal-muted">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

function DailyView({ pet, metrics }: { pet: PetProfile; metrics: HealthMetrics }) {
  return (
    <div className="space-y-4">
      <ScoreCard metrics={metrics} />

      <Card className="bg-[#fff7e9]">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-muted">今日活动</p>
            <p className="mt-1 text-3xl font-extrabold text-primary-deep">{pet.steps.toLocaleString()}<span className="ml-1 text-sm font-semibold text-teal-muted">步</span></p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-secondary">
            目标 {Math.round((pet.steps / Math.max(1, pet.stepsGoal)) * 100)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-primary" style={{ width: `${clamp((pet.steps / Math.max(1, pet.stepsGoal)) * 100, 0, 100)}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricCard icon={<Clock3 className="h-4 w-4" />} label="活跃时长" value={`${metrics.activeMinutes} 分钟`} note="移动状态累计" />
          <MetricCard icon={<Moon className="h-4 w-4" />} label="休息/疑似睡眠" value={`${pet.sleepHours.toFixed(1)} 小时`} note={`规律度 ${metrics.restRegularityPct}%`} tone="blue" />
          <MetricCard icon={<Flame className="h-4 w-4" />} label="活动消耗" value={`${metrics.activityKcal} kcal`} note="今日运动消耗" />
          <MetricCard icon={<Activity className="h-4 w-4" />} label="活动目标" value={`${Math.round((pet.steps / Math.max(1, pet.stepsGoal)) * 100)}%`} note="今天完成得不错" tone="blue" />
        </div>
      </Card>

      <BehaviorBar metrics={metrics} />

      <Card className="bg-surface-elevated">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-bold text-primary-deep">异常活动事件</p>
              <p className="text-[10px] text-teal-muted">需要留意的活动变化</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-primary-deep">{metrics.anomalyCount}</span>
        </div>
      </Card>
    </div>
  );
}

function WeeklyView({ pet, metrics }: { pet: PetProfile; metrics: HealthMetrics }) {
  const avgSteps = Math.round(pet.steps * 0.96);
  return (
    <div className="space-y-4">
      <Card className="bg-[#fff7e9]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-muted">本周趋势</p>
            <p className="mt-1 text-2xl font-extrabold text-primary-deep">{avgSteps.toLocaleString()}<span className="ml-1 text-xs font-semibold text-teal-muted">日均步数</span></p>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <TrendBars values={metrics.weekBars} labels={["一", "二", "三", "四", "五", "六", "日"]} />
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <MetricCard icon={<Clock3 className="h-4 w-4" />} label="日均活跃" value={`${metrics.activeMinutes} 分钟`} note="本周平均" />
        <MetricCard icon={<Moon className="h-4 w-4" />} label="日均休息" value={`${pet.sleepHours.toFixed(1)} 小时`} note="包含疑似睡眠" tone="blue" />
        <MetricCard icon={<Flame className="h-4 w-4" />} label="日均活动消耗" value={`${metrics.activityKcal} kcal`} note="本周每日平均" />
        <MetricCard icon={<Activity className="h-4 w-4" />} label="异常事件" value={`${metrics.anomalyCount} 次`} note="本周记录" tone="blue" />
      </div>

      <BehaviorBar metrics={metrics} />
    </div>
  );
}

function MonthlyView({ pet, metrics }: { pet: PetProfile; metrics: HealthMetrics }) {
  const activeHours = Math.round((metrics.activeMinutes * 30) / 60);
  return (
    <div className="space-y-4">
      <Card className="bg-[#fff7e9]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-muted">近 8 周活动趋势</p>
            <p className="mt-1 text-2xl font-extrabold text-primary-deep">{(pet.steps * 30).toLocaleString()}<span className="ml-1 text-xs font-semibold text-teal-muted">月累计步数</span></p>
          </div>
          <Footprints className="h-5 w-5 text-primary" />
        </div>
        <TrendBars values={metrics.monthBars} labels={["1", "2", "3", "4", "5", "6", "7", "8"]} />
      </Card>

      <Card className="bg-surface-blue/78">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-2xl font-extrabold text-primary-deep">{activeHours}</p><p className="text-[10px] text-teal-muted">活跃小时</p></div>
          <div><p className="text-2xl font-extrabold text-primary-deep">{(metrics.activityKcal * 30).toLocaleString()}</p><p className="text-[10px] text-teal-muted">活动 kcal</p></div>
          <div><p className="text-2xl font-extrabold text-primary-deep">{metrics.anomalyCount + 1}</p><p className="text-[10px] text-teal-muted">异常事件</p></div>
        </div>
      </Card>

      <BehaviorBar metrics={metrics} />

      <Card className="bg-surface-elevated">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-yellow text-primary">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-primary-deep">本月数据概况</p>
            <p className="mt-1 text-xs leading-relaxed text-teal-muted">步数、活跃、休息与异常记录一目了然。</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function HealthPage() {
  const { pets, selectedPetId, setSelectedPetId } = usePets();
  const [period, setPeriod] = useState<Period>("day");

  useEffect(() => {
    if (selectedPetId === "all" && pets[0]) setSelectedPetId(pets[0].id);
  }, [pets, selectedPetId, setSelectedPetId]);

  const currentPet = useMemo(() => {
    const id = selectedPetId === "all" ? pets[0]?.id : selectedPetId;
    return pets.find((pet) => pet.id === id) ?? pets[0];
  }, [pets, selectedPetId]);
  const metrics = useMemo(() => (currentPet ? calculateHealth(currentPet) : null), [currentPet]);

  if (!currentPet || !metrics) {
    return (
      <MobileShell>
        <AppTopBar title="健康" />
        <main className="px-5 py-10 text-center text-sm text-teal-muted">暂无宠物数据</main>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <AppTopBar title="健康" meta="每天的活动与休息概览" />
      <div className="px-5">
        <PetSwitch includeAll={false} className="mb-3 flex-nowrap overflow-x-auto" />
        <div className="flex rounded-full bg-[#efe5d9] p-1">
          {([
            { id: "day", label: "日" },
            { id: "week", label: "周" },
            { id: "month", label: "月" },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
                period === item.id ? "bg-primary text-white shadow-sm" : "text-primary-deep/65"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 pb-3 pt-4">
        {period === "day" ? (
          <DailyView pet={currentPet} metrics={metrics} />
        ) : period === "week" ? (
          <WeeklyView pet={currentPet} metrics={metrics} />
        ) : (
          <MonthlyView pet={currentPet} metrics={metrics} />
        )}
      </main>
    </MobileShell>
  );
}
