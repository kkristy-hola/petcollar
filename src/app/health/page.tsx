"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  Clock,
  Flame,
  Lightbulb,
  Moon,
  PawPrint,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { APP_TOPBAR_INSET_X, APP_TOPBAR_SAFE_TOP } from "@/components/layout/AppTopBar";
import { MessageBellButton } from "@/components/navigation/MessageBellButton";
import type { PetProfile } from "@/state/pets-context";
import { usePets } from "@/state/pets-context";

type Period = "day" | "week" | "month";

function seed(id: string) {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function healthMock(pet: PetProfile, period: Period) {
  const s = seed(pet.id);
  const mult = period === "day" ? 1 : period === "week" ? 7 : 30;
  const stepsGoal = pet.stepsGoal;
  const steps = Math.min(
    stepsGoal,
    Math.round(pet.steps * (period === "day" ? 1 : period === "week" ? 0.95 : 0.88) + (s % 400)),
  );
  const sleepH =
    period === "day"
      ? pet.sleepHours.toFixed(1)
      : (pet.sleepHours + (s % 3) * 0.15).toFixed(1);
  const activeH = (1.8 + (s % 5) * 0.2 * (period === "day" ? 1 : 0.9)).toFixed(1);
  const kcal = Math.round(pet.calories * (period === "day" ? 1 : period === "week" ? 6.2 : 26));
  const vitality = Math.min(99, 82 + (s % 14));
  const emotion = s % 3 === 0 ? "愉悦且稳定" : s % 3 === 1 ? "放松" : "好奇爱玩";
  const weeklyAvgSteps = Math.round((steps * mult) / Math.max(1, mult) + 2000 + (s % 800));
  const anomalyCount = period === "week" ? s % 2 : period === "month" ? (s % 4) + 1 : 0;
  const walkPct = 22 + (s % 12);
  const restPct = 38 + (s % 8);
  const sleepPct = 100 - walkPct - restPct;
  return {
    steps,
    stepsGoal,
    sleepH,
    activeH,
    kcal,
    vitality,
    emotion,
    weeklyAvgSteps,
    anomalyCount,
    walkPct,
    restPct,
    sleepPct,
    weekBars: [40, 52, 48, 72, 55, 44, 68].map((b, i) => b + ((s + i * 3) % 12)),
    monthStepTrend: Array.from({ length: 8 }, (_, i) => 35 + ((s + i * 7) % 45)),
    monthSleepTrend: Array.from({ length: 8 }, (_, i) => 60 + ((s + i * 5) % 28)),
  };
}

function StitchCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.35rem] p-4 shadow-[0_18px_40px_rgb(38_26_0/0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

function StepsRing({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const dash = `${pct}, 100`;
  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          className="text-[#f0e4d4]"
          stroke="currentColor"
          strokeWidth="3.2"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          className="text-[#5c4300]"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-2xl font-extrabold tracking-tight text-[#3d2b00]">
          {current.toLocaleString()}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6a55]">
          / {goal >= 1000 ? `${(goal / 1000).toFixed(0)}k` : goal} 步目标
        </p>
      </div>
    </div>
  );
}

function BehaviorDonut({
  walkPct,
  restPct,
  sleepPct,
}: {
  walkPct: number;
  restPct: number;
  sleepPct: number;
}) {
  const w = Math.max(0, Math.min(100, walkPct));
  const r = Math.max(0, Math.min(100, restPct));
  const s = Math.max(0, Math.min(100, sleepPct));
  const sum = w + r + s;
  const scale = sum > 0 ? 100 / sum : 1;
  const a = w * scale * 3.6;
  const b = r * scale * 3.6;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              #7f5700 0deg ${a}deg,
              #40646a ${a}deg ${a + b}deg,
              #b8d4e8 ${a + b}deg 360deg
            )`,
          }}
        />
        <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-[#fff9f4] shadow-inner">
          <PawPrint className="h-6 w-6 text-[#7f5700]" strokeWidth={1.5} />
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2 text-xs">
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-[#5c4300]">
            <span className="h-2 w-2 rounded-full bg-[#7f5700]" />
            行走与奔跑
          </span>
          <span className="font-bold text-[#3d2b00]">{walkPct}%</span>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-[#5c4300]">
            <span className="h-2 w-2 rounded-full bg-[#40646a]" />
            休息
          </span>
          <span className="font-bold text-[#3d2b00]">{restPct}%</span>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-[#5c4300]">
            <span className="h-2 w-2 rounded-full bg-[#b8d4e8]" />
            睡眠
          </span>
          <span className="font-bold text-[#3d2b00]">{sleepPct}%</span>
        </li>
      </ul>
    </div>
  );
}

function DailyView({ pet, data }: { pet: PetProfile; data: ReturnType<typeof healthMock> }) {
  const timeline = [
    {
      time: "08:00",
      title: "晨间散步",
      desc: "节奏偏快，心率平稳上升。",
      tag: "高强度",
      tone: "sky" as const,
    },
    {
      time: "10:30",
      title: "小憩",
      desc: "深度睡眠恢复片段。",
    },
    {
      time: "14:00",
      title: "玩耍",
      desc: "后院互动，抓挠与跳跃增多。",
    },
    {
      time: "16:30",
      title: "活动高峰",
      desc: "短时心率升高，属正常兴奋区间。",
      tag: "峰值",
      tone: "amber" as const,
    },
  ];

  return (
    <div className="space-y-4 pb-1">
      <StitchCard className="bg-[#fff6e8]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6a55]">
          今日活动
        </p>
        <StepsRing current={data.steps} goal={data.stepsGoal} />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/85 p-3 shadow-sm">
            <Moon className="mb-1 h-4 w-4 text-[#40646a]" />
            <p className="text-[10px] font-semibold text-[#7a6a55]">睡眠时长</p>
            <p className="text-lg font-bold text-[#3d2b00]">{data.sleepH} h</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-3 shadow-sm">
            <Zap className="mb-1 h-4 w-4 text-[#7f5700]" />
            <p className="text-[10px] font-semibold text-[#7a6a55]">活跃时长</p>
            <p className="text-lg font-bold text-[#3d2b00]">{data.activeH} h</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-3 shadow-sm">
            <Flame className="mb-1 h-4 w-4 text-[#c45c2a]" />
            <p className="text-[10px] font-semibold text-[#7a6a55]">消耗卡路里</p>
            <p className="text-lg font-bold text-[#3d2b00]">{data.kcal}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-3 shadow-sm">
            <Sparkles className="mb-1 h-4 w-4 text-[#7f5700]" />
            <p className="text-[10px] font-semibold text-[#7a6a55]">今日小结</p>
            <p className="text-xs font-medium leading-snug text-[#5c4300]">
              {pet.name} 今天上午活力很足，午后节奏放缓。
            </p>
          </div>
        </div>
      </StitchCard>

      <StitchCard className="bg-[#e3eef6]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#40646a]">
          活力得分
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-4xl font-extrabold tracking-tight text-[#3d2b00]">{data.vitality}%</p>
          <div className="flex items-center gap-1.5 pb-1 text-xs font-semibold text-[#40646a]">
            <Activity className="h-4 w-4" />
            处于理想区间
          </div>
        </div>
      </StitchCard>

      <StitchCard className="bg-[#f4e8dc]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6a55]">
          情绪趋势
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smile className="h-8 w-8 text-[#7f5700]" />
            <div>
              <p className="text-base font-bold text-[#3d2b00]">{data.emotion}</p>
              <p className="text-xs text-[#7a6a55]">全天节律平稳</p>
            </div>
          </div>
          <div className="flex h-12 items-end gap-1">
            {[32, 44, 38, 52, 48, 60, 40].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full ${i === 5 ? "bg-[#7f5700]" : "bg-[#d4c4b0]"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </StitchCard>

      <StitchCard className="bg-white/90">
        <div className="mb-3 flex items-center gap-2 text-[#3d2b00]">
          <Clock className="h-4 w-4" />
          <p className="text-sm font-bold">活动时间线</p>
        </div>
        <ul className="space-y-4">
          {timeline.map((row) => (
            <li key={row.time} className="flex gap-3 border-b border-[#f0e8df] pb-4 last:border-0 last:pb-0">
              <div className="w-12 shrink-0 text-xs font-semibold text-[#7a6a55]">{row.time}</div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-[#3d2b00]">{row.title}</p>
                  {row.tag ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.tone === "sky"
                          ? "bg-[#dceaf3] text-[#40646a]"
                          : "bg-[#fdebd0] text-[#7f5700]"
                      }`}
                    >
                      {row.tag}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs leading-relaxed text-[#7a6a55]">{row.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </StitchCard>

      <StitchCard className="border border-[#e8d5b8] bg-white/95">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0d4]">
            <Lightbulb className="h-5 w-5 text-[#7f5700]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#3d2b00]">今日洞察</p>
            <p className="mt-1 text-xs leading-relaxed text-[#5c4300]">
              {pet.name} 当前专注度偏高，很适合做短时训练或学习新指令；傍晚可略缩短兴奋玩耍，帮助夜间入睡更稳。
            </p>
          </div>
        </div>
      </StitchCard>
    </div>
  );
}

function WeeklyView({ pet, data }: { pet: PetProfile; data: ReturnType<typeof healthMock> }) {
  const labels = ["一", "二", "三", "四", "五", "六", "日"];
  const peakIdx = data.weekBars.indexOf(Math.max(...data.weekBars));
  return (
    <div className="space-y-4 pb-1">
      <StitchCard className="bg-white/92">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6a55]">
          本周活动
        </p>
        <p className="mt-1 text-2xl font-extrabold text-[#3d2b00]">
          {data.weeklyAvgSteps.toLocaleString()}
          <span className="ml-1 text-sm font-semibold text-[#7a6a55]">平均步数</span>
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#40646a]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e3eef6]">
            <Moon className="h-3.5 w-3.5" />
          </span>
          <span>平均睡眠 {data.sleepH} h</span>
        </div>
        <div className="relative mt-5 flex h-28 items-end justify-between gap-1.5 px-1">
          {data.weekBars.map((h, i) => (
            <div key={labels[i]} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex-1 rounded-full bg-[#f4ebe3]">
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-full transition-all ${
                    i === peakIdx ? "bg-[#7f5700]" : "bg-[#c4a574]"
                  }`}
                  style={{ height: `${h}%` }}
                />
                {i === peakIdx ? (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3d2b00] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    峰值
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-semibold text-[#7a6a55]">周{labels[i]}</span>
            </div>
          ))}
        </div>
      </StitchCard>

      <StitchCard className="bg-[#fff6e8]">
        <div className="mb-2 flex items-center gap-2 text-[#7f5700]">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-bold text-[#3d2b00]">活力洞察</p>
        </div>
        <p className="text-sm leading-relaxed text-[#5c4300]">
          与上周相比，{pet.name} 的日间活动节律更稳定，午后低谷缩短约{" "}
          {8 + (seed(pet.id) % 5)}%，夜间恢复更充分。
        </p>
      </StitchCard>

      <StitchCard className="bg-[#fff6e8]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-inner">
            <Check className="h-7 w-7 text-[#40646a]" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#3d2b00]">{data.anomalyCount}</p>
            <p className="text-xs font-medium text-[#7a6a55]">本周检测到的异常事件</p>
          </div>
        </div>
      </StitchCard>

      <StitchCard className="bg-[#fff6e8]">
        <p className="mb-3 text-sm font-bold text-[#3d2b00]">行为分布</p>
        <BehaviorDonut
          walkPct={data.walkPct}
          restPct={data.restPct}
          sleepPct={Math.max(8, data.sleepPct)}
        />
      </StitchCard>

      <StitchCard className="bg-[#f4e8dc]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6a55]">
          专业护理建议
        </p>
        <p className="mt-2 text-base font-bold text-[#3d2b00]">优化 {pet.name} 的日常节奏</p>
        <p className="mt-2 text-sm leading-relaxed text-[#5c4300]">
          本周耐力与心率变异性表现良好，建议保持当前散步频次，并关注关节在湿冷天的热身时间。
        </p>
        <blockquote className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs italic leading-relaxed text-[#5c4300]">
          「傍晚玩耍增加约 10 分钟，有助于进一步提升下周睡眠质量。」
        </blockquote>
        <ul className="mt-3 space-y-2 text-xs text-[#5c4300]">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#40646a]" />
            热量摄入与活动消耗匹配度良好
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#40646a]" />
            关节活动度正常，可适当增加拉伸
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#40646a]" />
            饮水量略低于理想值，建议增加水碗更换频率
          </li>
        </ul>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#7f5700] py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99]"
        >
          查看完整健康报告
          <ArrowRight className="h-4 w-4" />
        </button>
      </StitchCard>
    </div>
  );
}

function MonthlyView({ pet, data }: { pet: PetProfile; data: ReturnType<typeof healthMock> }) {
  return (
    <div className="space-y-4 pb-1">
      <StitchCard className="bg-white/92">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6a55]">
          本月活跃总览
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-2xl font-extrabold text-[#3d2b00]">
              {(data.weeklyAvgSteps * 4.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-[#7a6a55]">累计步数（估）</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#40646a]">{data.activeH} h</p>
            <p className="text-xs text-[#7a6a55]">日均活跃</p>
          </div>
        </div>
      </StitchCard>

      <StitchCard className="bg-[#fff6e8]">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-[#3d2b00]">步数与活跃趋势</p>
          <TrendingUp className="h-4 w-4 text-[#7f5700]" />
        </div>
        <div className="flex h-24 items-end justify-between gap-1">
          {data.monthStepTrend.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full max-w-[1.25rem] rounded-full bg-[#7f5700]/85"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-[#7a6a55]">近 8 周示意趋势（mock）</p>
      </StitchCard>

      <StitchCard className="bg-[#e3eef6]">
        <p className="mb-2 text-sm font-bold text-[#3d2b00]">睡眠趋势</p>
        <div className="flex h-24 items-end justify-between gap-1">
          {data.monthSleepTrend.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full max-w-[1.25rem] rounded-full bg-[#40646a]/80"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </StitchCard>

      <StitchCard className="bg-[#fff6e8]">
        <p className="mb-3 text-sm font-bold text-[#3d2b00]">行为分布（月度）</p>
        <BehaviorDonut
          walkPct={data.walkPct + 3}
          restPct={data.restPct - 2}
          sleepPct={Math.max(10, data.sleepPct - 1)}
        />
      </StitchCard>

      <StitchCard className="bg-white/90">
        <p className="text-sm font-bold text-[#3d2b00]">异常事件汇总</p>
        <p className="mt-2 text-3xl font-extrabold text-[#3d2b00]">{data.anomalyCount + 2}</p>
        <p className="text-xs text-[#7a6a55]">本月轻度波动事件（原型统计）</p>
      </StitchCard>

      <StitchCard className="border border-[#e8d5b8] bg-[#fff9f4]">
        <p className="text-sm font-bold text-[#3d2b00]">本月总结与建议</p>
        <p className="mt-2 text-sm leading-relaxed text-[#5c4300]">
          {pet.name} 本月整体活动呈「前低后高」走势，第三周起户外时长明显增加；睡眠深度在周末略波动，建议固定睡前例行流程，并关注气温骤变日的补水与关节保暖。
        </p>
      </StitchCard>
    </div>
  );
}

export default function HealthPage() {
  const { pets, selectedPetId, setSelectedPetId } = usePets();
  const [period, setPeriod] = useState<Period>("day");

  useEffect(() => {
    if (selectedPetId === "all" && pets[0]) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId, setSelectedPetId]);

  const currentPet = useMemo(() => {
    const id = selectedPetId === "all" ? pets[0]?.id : selectedPetId;
    return pets.find((p) => p.id === id) ?? pets[0];
  }, [pets, selectedPetId]);

  const mock = useMemo(
    () => (currentPet ? healthMock(currentPet, period) : healthMock(pets[0]!, period)),
    [currentPet, period, pets],
  );

  if (!currentPet) {
    return (
      <MobileShell>
        <main className="px-5 py-8 text-center text-sm text-teal-muted">暂无宠物数据</main>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <header className={`${APP_TOPBAR_INSET_X} ${APP_TOPBAR_SAFE_TOP} pb-2`}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {pets.map((pet) => {
              const active = pet.id === currentPet.id;
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition ${
                    active ? "bg-[#7f5700] text-white shadow-sm" : "bg-white/80 text-[#3d2b00] shadow-sm"
                  }`}
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/80">
                    <Image src={pet.avatarUrl} alt="" fill className="object-cover" sizes="32px" />
                  </span>
                  <span className="max-w-[5.5rem] truncate text-sm font-semibold">{pet.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <MessageBellButton />
          </div>
        </div>

        <div className="flex rounded-full bg-[#f0e8df] p-1">
          {(
            [
              { id: "day" as const, label: "日" },
              { id: "week" as const, label: "周" },
              { id: "month" as const, label: "月" },
            ] satisfies { id: Period; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPeriod(tab.id)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                period === tab.id
                  ? "bg-[#5c4300] text-white shadow-md"
                  : "text-[#5c4300]/75"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 pb-2 pt-2">
        {period === "day" ? (
          <DailyView pet={currentPet} data={mock} />
        ) : period === "week" ? (
          <WeeklyView pet={currentPet} data={mock} />
        ) : (
          <MonthlyView pet={currentPet} data={mock} />
        )}
      </main>
    </MobileShell>
  );
}
