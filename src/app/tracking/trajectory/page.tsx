"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { SoftCard } from "@/components/ui/SoftCard";
import { usePets } from "@/state/pets-context";

type Period = "day" | "week" | "month";

function seedFrom(id: string) {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function mockTrajectoryPolyline(period: Period, petId: string, pathIndex = 0) {
  const s = seedFrom(petId) + pathIndex * 31;
  const spread = period === "day" ? 22 : period === "week" ? 32 : 40;
  const base = 12 + (s % 8) + pathIndex * 4;
  const yOffset = pathIndex * 5;
  const phase = pathIndex * 0.55;
  const coords: { x: number; y: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x =
      base +
      spread * t +
      Math.sin(t * Math.PI * 2 + s * 0.02 + phase) * (6 + pathIndex * 1.2);
    const y =
      28 +
      yOffset +
      spread * 0.55 * t +
      Math.cos(t * Math.PI * 1.5 + s * 0.03 + phase * 0.6) * (8 - pathIndex * 1.5);
    coords.push({ x, y });
  }
  const polyline = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const start = coords[0]!;
  const end = coords[coords.length - 1]!;
  return { polyline, start, end };
}

function mockSummary(period: Period, petId: string, petCount: number) {
  const s = seedFrom(petId);
  const mult = period === "day" ? 1 : period === "week" ? 5.2 : 18;
  const baseKm = 0.6 + (s % 9) * 0.12;
  const totalKm = +(baseKm * mult * (petCount > 1 ? 1.25 : 1)).toFixed(1);
  const rangeKm = +(totalKm * (0.55 + (s % 5) * 0.04)).toFixed(1);
  const spots = ["阳光社区公园", "小区花园", "河滨步道", "宠物友好广场"];
  const top = spots[s % spots.length];
  return { totalKm, rangeKm, top };
}

export default function TrajectoryQueryPage() {
  const { pets, selectedPetId } = usePets();
  const [period, setPeriod] = useState<Period>("day");

  const activePet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((p) => p.id === selectedPetId) ?? pets[0];

  const petCount = selectedPetId === "all" ? pets.length : 1;
  const summary = useMemo(
    () => mockSummary(period, activePet?.id ?? "x", petCount),
    [period, activePet?.id, petCount],
  );

  const trajectories = useMemo(() => {
    if (selectedPetId === "all") {
      const list = pets.slice(0, 2);
      if (list.length >= 2) {
        return [
          {
            pet: list[0]!,
            ...mockTrajectoryPolyline(period, list[0]!.id, 0),
            stroke: "rgb(127 87 0)",
            dash: undefined as string | undefined,
            strokeWidth: 2.4,
          },
          {
            pet: list[1]!,
            ...mockTrajectoryPolyline(period, list[1]!.id, 1),
            stroke: "rgb(64 100 106)",
            dash: "3.5 3.5",
            strokeWidth: 2,
          },
        ];
      }
      const only = list[0] ?? pets[0];
      return [
        {
          pet: only,
          ...mockTrajectoryPolyline(period, only.id, 0),
          stroke: "rgb(127 87 0)",
          dash: undefined as string | undefined,
          strokeWidth: 2.4,
        },
        {
          pet: only,
          ...mockTrajectoryPolyline(period, `${only.id}-b`, 1),
          stroke: "rgb(64 100 106)",
          dash: "3.5 3.5",
          strokeWidth: 2,
        },
      ];
    }
    const one = activePet;
    return [
      {
        pet: one,
        ...mockTrajectoryPolyline(period, one.id, 0),
        stroke: "rgb(127 87 0)",
        dash: undefined as string | undefined,
        strokeWidth: 2.4,
      },
    ];
  }, [period, activePet, pets, selectedPetId]);

  const periodLabel =
    period === "day" ? "今日" : period === "week" ? "本周" : "本月";

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="轨迹查询" showBack backHref="/tracking" />
      <main className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-3">
        <PetSwitch includeAll className="shrink-0" />

        <div className="flex shrink-0 rounded-full bg-surface-muted p-1">
          {(
            [
              { id: "day" as const, label: "每日" },
              { id: "week" as const, label: "每周" },
              { id: "month" as const, label: "每月" },
            ] satisfies { id: Period; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPeriod(tab.id)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                period === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-teal-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-h-[52vh] flex-1 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fde7d6] via-[#fff5ea] to-[#e3f0e7] shadow-[var(--shadow-soft)]">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "linear-gradient(90deg,rgba(255,255,255,0.32) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.32) 1px,transparent 1px),radial-gradient(circle at 22% 20%,rgba(255,196,157,0.32),transparent 36%),radial-gradient(circle at 78% 68%,rgba(145,188,160,0.26),transparent 40%)",
              backgroundSize: "24px 24px,24px 24px,100% 100%,100% 100%",
            }}
          />

          <div className="absolute left-3 top-3 z-10 rounded-xl bg-white/55 px-2.5 py-1.5 text-[10px] font-semibold text-primary-deep/80 shadow-sm backdrop-blur-sm">
            {periodLabel}
            {selectedPetId === "all" ? " · 多宠汇总" : ` · ${activePet.name}`}
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            {trajectories.map((tr, idx) => (
              <g key={`${tr.pet.id}-${idx}`}>
                <polyline
                  fill="none"
                  stroke={tr.stroke}
                  strokeWidth={tr.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={tr.dash}
                  opacity={0.88}
                  points={tr.polyline}
                />
                <circle cx={tr.start.x} cy={tr.start.y} r="2.6" fill={tr.stroke} opacity="0.75" />
                <circle cx={tr.end.x} cy={tr.end.y} r="3.2" fill={tr.stroke} />
              </g>
            ))}
          </svg>

          {selectedPetId === "all" ? (
            <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-xl bg-white/55 px-2.5 py-2 text-[10px] font-semibold text-primary-deep/85 shadow-sm backdrop-blur-sm">
              {trajectories.map((tr, idx) => (
                <div key={`leg-${tr.pet.id}-${idx}`} className="flex items-center gap-2">
                  {tr.dash ? (
                    <div
                      className="h-0.5 w-6 shrink-0 rounded-full border-t-2 border-dashed"
                      style={{ borderColor: tr.stroke }}
                    />
                  ) : (
                    <div
                      className="h-1.5 w-6 shrink-0 rounded-full"
                      style={{ backgroundColor: tr.stroke }}
                    />
                  )}
                  <span className="truncate">{tr.pet.name}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <SoftCard className="shrink-0 bg-surface-elevated/95 p-3 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] font-semibold text-teal-muted">活动范围</p>
              <p className="mt-0.5 text-sm font-bold text-primary-deep">
                约 {summary.rangeKm} km
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-teal-muted">总里程</p>
              <p className="mt-0.5 text-sm font-bold text-primary-deep">
                {summary.totalKm} km
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-teal-muted">常去地点</p>
              <p className="mt-0.5 flex items-center justify-center gap-0.5 text-xs font-semibold text-primary-deep">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="line-clamp-2">{summary.top}</span>
              </p>
            </div>
          </div>
        </SoftCard>
      </main>
    </MobileShell>
  );
}
