"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  Circle,
  Crosshair,
  GraduationCap,
  Home,
  Plus,
  RectangleHorizontal,
  ShieldCheck,
  Trash2,
  TreeDeciduous,
  X,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";

type FenceShape = "circle" | "rectangle";
type FenceIcon = "home" | "park" | "school";

type FenceItem = {
  id: string;
  name: string;
  center: string;
  shape: FenceShape;
  radiusM?: number;
  lengthM?: number;
  widthM?: number;
  icon: FenceIcon;
};

const iconMap = {
  home: Home,
  park: TreeDeciduous,
  school: GraduationCap,
} as const;

const initialFences: FenceItem[] = [
  {
    id: "home",
    name: "温馨之家",
    center: "阳光社区 8 栋",
    shape: "circle",
    radiusM: 200,
    icon: "home",
  },
  {
    id: "park",
    name: "中央公园",
    center: "中央公园北门",
    shape: "circle",
    radiusM: 800,
    icon: "park",
  },
  {
    id: "school",
    name: "宠物学校",
    center: "宠物学校训练场",
    shape: "rectangle",
    lengthM: 400,
    widthM: 250,
    icon: "school",
  },
];

function fenceSize(fence: FenceItem) {
  return fence.shape === "circle"
    ? `圆形 · 半径 ${fence.radiusM}m`
    : `方形 · ${fence.lengthM}m × ${fence.widthM}m`;
}

export default function GeofencePage() {
  const [fences, setFences] = useState<FenceItem[]>(initialFences);
  const [activeFenceId, setActiveFenceId] = useState(initialFences[0].id);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [shape, setShape] = useState<FenceShape>("circle");
  const [radius, setRadius] = useState(300);
  const [rectLength, setRectLength] = useState(400);
  const [rectWidth, setRectWidth] = useState(250);

  const activeFence = useMemo(
    () => fences.find((fence) => fence.id === activeFenceId) ?? fences[0],
    [activeFenceId, fences],
  );

  function saveFence() {
    const next: FenceItem = {
      id: `fence-${Date.now()}`,
      name: name.trim() || "新围栏",
      center: "宠物当前位置",
      shape,
      radiusM: shape === "circle" ? radius : undefined,
      lengthM: shape === "rectangle" ? rectLength : undefined,
      widthM: shape === "rectangle" ? rectWidth : undefined,
      icon: "home",
    };
    setFences((items) => [...items, next]);
    setName("");
    setShape("circle");
    setCreating(false);
  }

  function removeFence(id: string) {
    setFences((items) => {
      const next = items.filter((item) => item.id !== id);
      if (id === activeFenceId) setActiveFenceId(next[0]?.id ?? "");
      return next;
    });
  }

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="定位 · 电子围栏" showBack backHref="/tracking" />
      <main className="space-y-4 px-5 pb-8">
        {activeFence ? (
          <SoftCard className="overflow-hidden bg-surface-elevated p-0">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholders/geofence-map.svg"
                alt="当前围栏地图"
                fill
                className="object-cover"
                sizes="390px"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {activeFence.shape === "circle" ? (
                  <div className="h-32 w-32 rounded-full border-[3px] border-amber-400 bg-amber-200/25 shadow-[0_0_36px_rgba(251,191,36,0.38)]" />
                ) : (
                  <div className="h-24 w-40 rounded-2xl border-[3px] border-sky-400 bg-sky-200/25 shadow-[0_0_36px_rgba(56,189,248,0.3)]" />
                )}
              </div>
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                当前生效
              </span>
              <span className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/88 px-3 py-2.5 shadow-sm backdrop-blur">
                <span className="block text-sm font-bold text-primary-deep">{activeFence.name}</span>
                <span className="mt-0.5 block text-[11px] text-teal-muted">
                  {activeFence.center} · {fenceSize(activeFence)}
                </span>
              </span>
            </div>
          </SoftCard>
        ) : (
          <SoftCard className="bg-surface-muted/80 p-5 text-center">
            <p className="text-sm font-bold text-primary-deep">还没有围栏</p>
            <p className="mt-1 text-xs text-teal-muted">新增后可手动设为当前使用</p>
          </SoftCard>
        )}

        <div className="rounded-2xl bg-surface-blue/70 px-4 py-3 text-xs leading-relaxed text-secondary">
          同一时间只会有一个围栏生效。切换时，原围栏会自动停用。
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-lg font-bold text-primary-deep">已保存围栏</h2>
              <p className="mt-0.5 text-xs text-teal-muted">点击“设为当前”手动切换</p>
            </div>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              新增
            </button>
          </div>

          <ul className="space-y-2.5">
            {fences.map((fence) => {
              const Icon = iconMap[fence.icon];
              const active = fence.id === activeFenceId;
              return (
                <li
                  key={fence.id}
                  className={`rounded-2xl p-3.5 shadow-sm ring-1 ${
                    active ? "bg-[#fff5dc] ring-primary/25" : "bg-surface-elevated ring-black/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${active ? "bg-primary text-white" : "bg-surface-blue text-secondary"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-primary-deep">{fence.name}</p>
                        {active ? <span className="shrink-0 text-[10px] font-bold text-primary">当前使用</span> : null}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-teal-muted">{fenceSize(fence)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFence(fence.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400"
                      aria-label={`删除${fence.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!active ? (
                    <button
                      type="button"
                      onClick={() => setActiveFenceId(fence.id)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-blue py-2.5 text-xs font-bold text-secondary transition active:scale-[0.99]"
                    >
                      <Check className="h-3.5 w-3.5" />
                      设为当前围栏
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <Link
          href="/profile/messages?tab=safety"
          className="inline-flex w-full items-center justify-center rounded-full bg-surface-blue px-5 py-3 text-sm font-semibold text-secondary"
        >
          查看越界告警记录
        </Link>
      </main>

      {creating ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35" role="dialog" aria-modal="true">
          <div className="max-h-[88vh] w-full max-w-[390px] overflow-y-auto rounded-t-[2rem] bg-surface-elevated px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-deep">新增围栏</h2>
                <p className="mt-0.5 text-xs text-teal-muted">形状在这里选择，保存后不会自动替换当前围栏</p>
              </div>
              <button type="button" onClick={() => setCreating(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-teal-muted" aria-label="关闭">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-semibold text-secondary">围栏名称</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="例如：温馨之家"
                className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-surface-muted px-3 py-3 text-sm font-semibold text-primary-deep outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <div className="mt-4">
              <p className="text-xs font-semibold text-secondary">选择围栏形状</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setShape("circle")} className={`rounded-2xl p-3 text-left ring-1 ${shape === "circle" ? "bg-[#fff0d2] text-primary-deep ring-primary/30" : "bg-surface-muted text-teal-muted ring-black/[0.04]"}`}>
                  <Circle className="h-5 w-5" />
                  <p className="mt-2 text-sm font-bold">圆形</p>
                </button>
                <button type="button" onClick={() => setShape("rectangle")} className={`rounded-2xl p-3 text-left ring-1 ${shape === "rectangle" ? "bg-surface-blue text-primary-deep ring-secondary/30" : "bg-surface-muted text-teal-muted ring-black/[0.04]"}`}>
                  <RectangleHorizontal className="h-5 w-5" />
                  <p className="mt-2 text-sm font-bold">方形</p>
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-surface-muted p-3.5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-secondary">
                <Crosshair className="h-4 w-4" />
                中心点：宠物当前位置
              </div>
              {shape === "circle" ? (
                <label className="block">
                  <span className="flex items-center justify-between text-xs text-teal-muted">
                    <span>围栏半径</span><strong className="text-primary-deep">{radius}m</strong>
                  </span>
                  <input type="range" min={100} max={1000} step={50} value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="mt-2 w-full accent-primary" />
                </label>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-teal-muted">
                    长度（m）
                    <input type="number" min={100} value={rectLength} onChange={(event) => setRectLength(Number(event.target.value))} className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-primary-deep outline-none" />
                  </label>
                  <label className="text-xs text-teal-muted">
                    宽度（m）
                    <input type="number" min={100} value={rectWidth} onChange={(event) => setRectWidth(Number(event.target.value))} className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-primary-deep outline-none" />
                  </label>
                </div>
              )}
            </div>

            <button type="button" onClick={saveFence} className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-sm">
              保存围栏
            </button>
          </div>
        </div>
      ) : null}
    </MobileShell>
  );
}
