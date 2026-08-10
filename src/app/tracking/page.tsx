"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  Layers,
  Lightbulb,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Route,
  Search,
} from "lucide-react";
import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { usePets } from "@/state/pets-context";
import { getEffectivePetDeviceStatus, useAppStore } from "@/state/app-store";

type TrajectoryPeriod = "day" | "week" | "month";

function trajectoryPoints(period: TrajectoryPeriod, petId: string, pathIndex: number) {
  const seed = petId.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const spread = period === "day" ? 45 : period === "week" ? 58 : 66;
  return Array.from({ length: 10 }, (_, index) => {
    const progress = index / 9;
    const x = 16 + spread * progress + Math.sin(progress * Math.PI * 2 + seed * 0.03) * 7;
    const y = 28 + pathIndex * 8 + spread * 0.45 * progress + Math.cos(progress * Math.PI * 1.8 + seed * 0.02) * 9;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export default function TrackingPage() {
  const { pets, selectedPetId } = usePets();
  const devices = useAppStore((s) => s.devices);
  const selectedPet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  const visiblePets = useMemo(
    () => (selectedPetId === "all" ? pets : [selectedPet]),
    [pets, selectedPet, selectedPetId],
  );
  const [zoomLevel, setZoomLevel] = useState(2);
  const [focusPulse, setFocusPulse] = useState(false);
  const [centerShift, setCenterShift] = useState({ x: 0, y: 0 });
  const [findOpen, setFindOpen] = useState(false);
  const [trajectoryOpen, setTrajectoryOpen] = useState(false);
  const [trajectoryPeriod, setTrajectoryPeriod] = useState<TrajectoryPeriod>("day");
  const [collarLightOn, setCollarLightOn] = useState(false);
  const [collarRingOn, setCollarRingOn] = useState(false);

  const markerData = useMemo(
    () =>
      visiblePets.map((pet, index) => {
        const status = getEffectivePetDeviceStatus(pet, devices);
        let hash = index * 73;
        for (let i = 0; i < pet.id.length; i++) hash += pet.id.charCodeAt(i) * (i + 3);
        const left = 18 + (Math.abs(hash) % 64); // 18% ~ 82%
        const top = 20 + (Math.abs(hash * 9) % 58); // 20% ~ 78%
        return { pet, left, top, status };
      }),
    [devices, visiblePets],
  );

  const zoomScale = 1 + (zoomLevel - 2) * 0.08;
  const trajectoryLines = useMemo(
    () =>
      visiblePets.slice(0, 2).map((pet, index) => ({
        id: pet.id,
        name: pet.name,
        points: trajectoryPoints(trajectoryPeriod, pet.id, index),
        color: index === 0 ? "#7f5700" : "#40646a",
        dash: index === 0 ? undefined : "4 4",
      })),
    [trajectoryPeriod, visiblePets],
  );
  const trajectorySummary = useMemo(() => {
    const petSeed = selectedPet?.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) ?? 0;
    const multiplier = trajectoryPeriod === "day" ? 1 : trajectoryPeriod === "week" ? 5.4 : 18.5;
    const totalKm = ((3.2 + (petSeed % 8) * 0.2) * multiplier).toFixed(1);
    const rangeKm = ((1.4 + (petSeed % 5) * 0.15) * (trajectoryPeriod === "day" ? 1 : trajectoryPeriod === "week" ? 1.7 : 2.4)).toFixed(1);
    return { totalKm, rangeKm };
  }, [selectedPet?.id, trajectoryPeriod]);

  function handleLocatePet() {
    if (!selectedPet) return;
    const target = markerData.find((item) => item.pet.id === selectedPet.id) ?? markerData[0];
    if (!target) return;
    setCenterShift({ x: 50 - target.left, y: 50 - target.top });
    setFocusPulse(true);
    window.setTimeout(() => setFocusPulse(false), 800);
  }

  if (pets.length === 0 || !selectedPet) {
    return (
      <MobileShell>
        <AppTopBar title="定位 · 实时地图" />
        <main className="px-5 py-10 text-center text-sm text-teal-muted">
          暂无宠物，请先在“我的”页面新增宠物档案。
        </main>
      </MobileShell>
    );
  }
  const selectedStatus = getEffectivePetDeviceStatus(selectedPet, devices);

  return (
    <MobileShell>
      <AppTopBar title="定位 · 实时地图" />
      <div className="px-5 pt-1">
        <PetSwitch includeAll className="mb-3" />
      </div>
      <main className="space-y-3 px-5 pb-4">
        <div className="relative h-[29rem] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fde7d6] via-[#fff5ea] to-[#e3f0e7] shadow-[var(--shadow-soft)]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),radial-gradient(circle at 25% 18%,rgba(255,196,157,0.35),transparent 38%),radial-gradient(circle at 72% 64%,rgba(145,188,160,0.30),transparent 42%)",
              backgroundSize: "26px 26px,26px 26px,100% 100%,100% 100%",
            }}
          />
          <div className="absolute left-3 top-3 z-10 flex max-w-[48%] flex-col gap-2">
            <div className="rounded-xl bg-white/58 px-2.5 py-2 shadow-sm backdrop-blur-sm">
              <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-deep">
                实时状态
              </p>
              <p className="text-base font-bold text-primary-deep">
                {markerData.filter((item) => item.status.online).length}只在线
              </p>
              <p className="mt-0.5 text-[11px] text-teal-muted">
                平均电量{" "}
                {(() => {
                  const batteryList = devices.map((d) => d.batteryPct).filter((n) => typeof n === "number");
                  if (batteryList.length === 0) return "—";
                  return `${Math.round(batteryList.reduce((sum, n) => sum + n, 0) / batteryList.length)}%`;
                })()}{" "}
                · 信号 {selectedStatus.signalLabel}
              </p>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 top-3 z-10 flex flex-col justify-between">
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !findOpen;
                  setFindOpen(nextOpen);
                  if (nextOpen) setTrajectoryOpen(false);
                }}
                title="找宠模式"
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition active:scale-95 ${
                  findOpen ? "bg-secondary text-white" : "bg-primary text-on-primary"
                }`}
                aria-label="找宠模式"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !trajectoryOpen;
                  setTrajectoryOpen(nextOpen);
                  if (nextOpen) {
                    setFindOpen(false);
                    setCollarLightOn(false);
                    setCollarRingOn(false);
                  }
                }}
                title="轨迹查询"
                className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition active:scale-95 ${
                  trajectoryOpen ? "bg-secondary text-white" : "bg-white/90 text-primary"
                }`}
                aria-label="轨迹查询"
              >
                <Route className="h-4 w-4" />
              </button>
              <Link
                href="/tracking/geofence"
                title="电子围栏"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="电子围栏"
              >
                <Layers className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((v) => Math.min(5, v + 1))}
                title="放大"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="放大"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((v) => Math.max(1, v - 1))}
                title="缩小"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="缩小"
              >
                <Minus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleLocatePet}
                title="定位到当前宠物"
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition active:scale-95 ${
                  focusPulse ? "scale-110 shadow-lg" : ""
                }`}
                aria-label="定位到当前宠物"
              >
                <LocateFixed className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              {trajectoryOpen ? (
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {trajectoryLines.map((line) => (
                    <polyline
                      key={line.id}
                      points={line.points}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={line.dash}
                      opacity="0.88"
                    />
                  ))}
                </svg>
              ) : null}
              {markerData.map(({ pet, left, top, status }) => (
                <div
                  key={pet.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${Math.max(8, Math.min(92, left + centerShift.x))}%`,
                    top: `${Math.max(10, Math.min(90, top + centerShift.y))}%`,
                    transform: `translate(-50%,-50%) scale(${zoomScale})`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-4 w-4 rounded-full border-2 border-white shadow ${
                        pet.id === selectedPet.id && focusPulse
                          ? "bg-primary ring-4 ring-primary/25"
                          : status.online
                            ? "bg-emerald-500"
                            : "bg-stone-400"
                      }`}
                    />
                    <span className="mt-2 rounded-full bg-white/88 px-3 py-1 text-center text-xs font-semibold text-primary-deep shadow-sm backdrop-blur">
                      {pet.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {trajectoryOpen ? (
          <section className="rounded-[1.75rem] bg-surface-elevated p-4 shadow-[var(--shadow-soft)] ring-1 ring-black/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-primary-deep">{selectedPet.name}的活动轨迹</h2>
                <p className="mt-0.5 text-xs text-teal-muted">轨迹已显示在上方地图中</p>
              </div>
              <button
                type="button"
                onClick={() => setTrajectoryOpen(false)}
                className="shrink-0 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-teal-muted"
              >
                收起
              </button>
            </div>

            <div className="mt-3 flex rounded-full bg-surface-muted p-1">
              {([
                { id: "day", label: "日" },
                { id: "week", label: "周" },
                { id: "month", label: "月" },
              ] as const).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTrajectoryPeriod(item.id)}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
                    trajectoryPeriod === item.id ? "bg-primary text-white shadow-sm" : "text-teal-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-[#fff4dc] px-2 py-3">
                <p className="text-[10px] text-teal-muted">活动范围</p>
                <p className="mt-1 text-sm font-extrabold text-primary-deep">{trajectorySummary.rangeKm} km</p>
              </div>
              <div className="rounded-2xl bg-surface-blue/75 px-2 py-3">
                <p className="text-[10px] text-teal-muted">总里程</p>
                <p className="mt-1 text-sm font-extrabold text-primary-deep">{trajectorySummary.totalKm} km</p>
              </div>
              <div className="rounded-2xl bg-surface-muted px-2 py-3">
                <p className="text-[10px] text-teal-muted">常去地点</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold leading-tight text-primary-deep">
                  <MapPin className="h-3 w-3 shrink-0 text-primary" />
                  社区公园
                </p>
              </div>
            </div>

            {trajectoryLines.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-semibold text-teal-muted">
                {trajectoryLines.map((line) => (
                  <span key={line.id} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-5 rounded-full" style={{ backgroundColor: line.color }} />
                    {line.name}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {findOpen ? (
          <section className="rounded-[1.75rem] bg-surface-elevated p-4 shadow-[var(--shadow-soft)] ring-1 ring-black/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-blue text-secondary">
                  <Navigation className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-primary-deep">正在接近 {selectedPet.name}</h2>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  </div>
                  <p className="mt-0.5 text-xs text-teal-muted">约 12 米 · 大约 15 步 · 2 秒前更新</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFindOpen(false);
                  setCollarLightOn(false);
                  setCollarRingOn(false);
                }}
                className="shrink-0 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-teal-muted"
              >
                结束
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCollarLightOn((value) => !value)}
                disabled={!selectedStatus.online}
                className={`rounded-2xl p-3 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                  collarLightOn ? "bg-primary text-white" : "bg-surface-yellow text-primary-deep"
                }`}
              >
                <Lightbulb className="h-5 w-5" />
                <p className="mt-2 text-sm font-bold">{collarLightOn ? "项圈灯已开启" : "开启项圈灯"}</p>
                <p className={`mt-0.5 text-[10px] ${collarLightOn ? "text-white/75" : "text-teal-muted"}`}>
                  便于夜间发现
                </p>
              </button>
              <button
                type="button"
                onClick={() => setCollarRingOn((value) => !value)}
                disabled={!selectedStatus.online}
                className={`rounded-2xl p-3 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                  collarRingOn ? "bg-secondary text-white" : "bg-surface-blue text-secondary"
                }`}
              >
                <BellRing className="h-5 w-5" />
                <p className="mt-2 text-sm font-bold">{collarRingOn ? "项圈正在鸣响" : "鸣响寻回"}</p>
                <p className={`mt-0.5 text-[10px] ${collarRingOn ? "text-white/75" : "text-teal-muted"}`}>
                  通过声音辅助定位
                </p>
              </button>
            </div>
            {!selectedStatus.online ? (
              <p className="mt-3 rounded-xl bg-stone-100 px-3 py-2 text-xs text-stone-600">
                当前项圈离线，灯光和鸣响暂不可用。
              </p>
            ) : null}
          </section>
        ) : null}
      </main>
    </MobileShell>
  );
}
