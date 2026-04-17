"use client";

import { useMemo, useState } from "react";
import {
  History,
  Layers,
  LocateFixed,
  Minus,
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
      <div className="relative flex min-h-0 flex-1 px-5 pb-3">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fde7d6] via-[#fff5ea] to-[#e3f0e7] shadow-[var(--shadow-soft)]">
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
              <Link
                href="/tracking/find"
                title="找宠模式"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition active:scale-95"
                aria-label="找宠模式"
              >
                <Search className="h-4.5 w-4.5" />
              </Link>
              <Link
                href="/tracking/trajectory"
                title="轨迹查询"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="轨迹查询"
              >
                <Route className="h-4 w-4" />
              </Link>
              <Link
                href="/tracking/track"
                title="历史轨迹"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="历史轨迹"
              >
                <History className="h-4 w-4" />
              </Link>
              <Link
                href="/tracking/geofence"
                title="图层/视图切换"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition active:scale-95"
                aria-label="图层视图切换"
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
      </div>
    </MobileShell>
  );
}
