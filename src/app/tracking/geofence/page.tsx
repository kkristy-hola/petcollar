"use client";

import { useState } from "react";
import Image from "next/image";
import { Crosshair, Home, GraduationCap, TreeDeciduous, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";
import { mockFence } from "@/data/mock";

const iconMap = {
  home: Home,
  tree: TreeDeciduous,
  school: GraduationCap,
} as const;

const toneMap = {
  yellow: "bg-amber-100 text-primary",
  blue: "bg-sky-100 text-sky-800",
  sage: "bg-emerald-100 text-emerald-800",
} as const;

export default function GeofencePage() {
  const [radius, setRadius] = useState(mockFence.radiusM);
  const [on, setOn] = useState(mockFence.enabled);

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="定位 · 电子围栏" showBack backHref="/tracking" />
      <main className="space-y-5 px-5">
        <div className="relative h-52 overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)]">
          <Image
            src="/placeholders/geofence-map.svg"
            alt=""
            fill
            className="object-cover"
            sizes="390px"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full border-[3px] border-amber-300/90 bg-amber-200/20 shadow-[0_0_40px_rgba(251,191,36,0.45)]" />
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-surface-warm/90 px-3 py-2.5 backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-teal-muted">当前位置</p>
              <p className="truncate text-sm font-bold text-primary-deep">
                {mockFence.centerLabel}
              </p>
            </div>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
              aria-label="重新定位"
            >
              <Crosshair className="h-5 w-5" />
            </button>
          </div>
        </div>

        <SoftCard className="space-y-5 bg-surface-warm p-5">
          <div className="flex gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-primary-deep">围栏开关</p>
              <p className="mt-1 text-xs leading-relaxed text-teal-muted">
                开启后，宠物离开指定区域将收到通知
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => setOn(!on)}
              className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-stone-300"}`}
            >
              <span
                className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${on ? "left-8" : "left-1"}`}
              />
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary-deep">
                围栏半径
              </span>
              <span className="text-xl font-bold text-primary">{radius} m</span>
            </div>
            <input
              type="range"
              min={100}
              max={1000}
              step={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <div className="mt-1 flex justify-between text-[11px] text-teal-muted">
              <span>100m</span>
              <span>1000m</span>
            </div>
          </div>
        </SoftCard>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-deep">活跃围栏列表</h2>
          <button
            type="button"
            className="rounded-full bg-surface-blue px-3 py-1.5 text-xs font-semibold text-secondary"
          >
            + 添加新区域
          </button>
        </div>

        <ul className="space-y-3">
          {mockFence.fences.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <li key={f.id}>
                <SoftCard className="flex items-center gap-3 bg-surface-muted/80 p-3.5">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${toneMap[f.tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary-deep">{f.title}</p>
                    <p className="text-xs text-teal-muted">{f.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400"
                    aria-label="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </SoftCard>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-surface-blue px-5 py-3 text-sm font-semibold text-secondary"
        >
          查看告警记录
        </button>
      </main>
    </MobileShell>
  );
}
