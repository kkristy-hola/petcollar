"use client";

import Link from "next/link";
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

type FenceMode = "circle" | "rect";
type FenceTone = "yellow" | "blue" | "sage";
type FenceIcon = "home" | "tree" | "school";

type FenceItem = {
  id: string;
  title: string;
  subtitle: string;
  tone: FenceTone;
  icon: FenceIcon;
  shape: FenceMode;
  radiusM?: number;
  lengthM?: number;
  widthM?: number;
};

export default function GeofencePage() {
  const [mode, setMode] = useState<FenceMode>("circle");
  const [radius, setRadius] = useState(mockFence.radiusM);
  const [rectLength, setRectLength] = useState(400);
  const [rectWidth, setRectWidth] = useState(250);
  const [on, setOn] = useState(mockFence.enabled);
  const [isPickingCenter, setIsPickingCenter] = useState(false);
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const petCurrentLocation = mockFence.centerLabel;
  const centerLabel =
    centerOffset.x === 0 && centerOffset.y === 0
      ? mockFence.centerLabel
      : `中心偏移 东${centerOffset.x}m · 北${centerOffset.y}m`;
  const [fences, setFences] = useState<FenceItem[]>(
    () =>
      mockFence.fences.map((f) => ({
        id: f.id,
        title: f.title,
        subtitle: f.subtitle,
        tone: f.tone,
        icon: f.icon,
        shape: "circle",
        radiusM: mockFence.radiusM,
      })),
  );
  const [selectedFenceId, setSelectedFenceId] = useState<string | null>(null);

  function handleAddFence() {
    const nextId = String(Date.now());
    const isCircle = mode === "circle";
    const subtitle = isCircle
      ? `半径 ${radius}m · 手动添加`
      : `${rectLength}m × ${rectWidth}m · 手动添加`;
    setFences((prev) => [
      {
        id: nextId,
        title: isCircle ? "自定义圆形围栏" : "自定义方形围栏",
        subtitle,
        tone: isCircle ? "yellow" : "blue",
        icon: isCircle ? "home" : "tree",
        shape: mode,
        radiusM: isCircle ? radius : undefined,
        lengthM: isCircle ? undefined : rectLength,
        widthM: isCircle ? undefined : rectWidth,
      },
      ...prev,
    ]);
  }

  function handleRemoveFence(id: string) {
    setFences((prev) => prev.filter((f) => f.id !== id));
  }

  function handleCenterPickStart() {
    setIsPickingCenter(true);
  }

  function handleFenceEdit(fence: FenceItem) {
    setSelectedFenceId(fence.id);
    if (fence.shape === "circle") {
      setMode("circle");
      if (typeof fence.radiusM === "number") setRadius(fence.radiusM);
      return;
    }
    setMode("rect");
    if (typeof fence.lengthM === "number") setRectLength(fence.lengthM);
    if (typeof fence.widthM === "number") setRectWidth(fence.widthM);
  }

  function handleCenterPickByDrag(dx: number, dy: number) {
    const nextX = Math.max(-300, Math.min(300, centerOffset.x + Math.round(dx)));
    const nextY = Math.max(-300, Math.min(300, centerOffset.y + Math.round(dy)));
    setCenterOffset({ x: nextX, y: nextY });
    setIsPickingCenter(false);
  }

  function usePetLocationAsCenter() {
    setCenterOffset({ x: 0, y: 0 });
    setIsPickingCenter(false);
  }

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="定位 · 电子围栏" showBack backHref="/tracking" />
      <main className="space-y-5 px-5">
        <div className="rounded-2xl bg-surface-blue/70 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setMode("circle")}
              className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                mode === "circle"
                  ? "bg-white text-primary-deep shadow-sm"
                  : "text-secondary/90"
              }`}
            >
              圆形电子围栏
            </button>
            <button
              type="button"
              onClick={() => setMode("rect")}
              className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                mode === "rect"
                  ? "bg-white text-primary-deep shadow-sm"
                  : "text-secondary/90"
              }`}
            >
              方形电子围栏
            </button>
          </div>
        </div>

        <div
          className="relative h-52 overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)]"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startY = e.clientY;
            const onUp = (evt: MouseEvent) => {
              handleCenterPickByDrag((evt.clientX - startX) / 6, (startY - evt.clientY) / 6);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mouseup", onUp);
          }}
        >
          <Image
            src="/placeholders/geofence-map.svg"
            alt=""
            fill
            className="object-cover"
            sizes="390px"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {mode === "circle" ? (
              <div className="h-40 w-40 rounded-full border-[3px] border-amber-300/90 bg-amber-200/20 shadow-[0_0_40px_rgba(251,191,36,0.45)]" />
            ) : (
              <div className="h-32 w-44 rounded-2xl border-[3px] border-sky-300/90 bg-sky-200/20 shadow-[0_0_40px_rgba(56,189,248,0.35)]" />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white/85 shadow-md">
              <span className="absolute h-[1px] w-7 bg-primary/80" />
              <span className="absolute h-7 w-[1px] bg-primary/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(127,87,0,0.18)]" />
            </div>
          </div>
          <p className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white/95 backdrop-blur">
            拖动地图设置围栏中心点
          </p>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-surface-warm/90 px-3 py-2.5 backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-teal-muted">围栏中心点</p>
              <p className="truncate text-sm font-bold text-primary-deep">{centerLabel}</p>
            </div>
            <button
              type="button"
              onClick={usePetLocationAsCenter}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
              aria-label="使用宠物当前位置"
            >
              <Crosshair className="h-5 w-5" />
            </button>
          </div>
        </div>

        <SoftCard className="space-y-2 bg-surface-muted/75 p-3.5">
          <p className="text-xs text-teal-muted">
            当前地图中心即围栏中心点，先选中心点，再设置围栏尺寸。
          </p>
          <p className="text-sm font-semibold text-primary-deep">围栏中心点：{centerLabel}</p>
          {mode === "circle" ? (
            <p className="text-xs text-teal-muted">半径：{radius}m</p>
          ) : (
            <>
              <p className="text-xs text-teal-muted">长度：{rectLength}m</p>
              <p className="text-xs text-teal-muted">宽度：{rectWidth}m</p>
            </>
          )}
          <p className="text-xs text-teal-muted">宠物当前位置：{petCurrentLocation}</p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCenterPickStart}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                isPickingCenter
                  ? "bg-primary text-on-primary"
                  : "bg-surface-blue text-secondary"
              }`}
            >
              重新选点
            </button>
            <button
              type="button"
              onClick={usePetLocationAsCenter}
              className="rounded-full bg-surface-blue px-3 py-1.5 text-xs font-semibold text-secondary"
            >
              使用宠物当前位置
            </button>
          </div>
        </SoftCard>

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

          {mode === "circle" ? (
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
              <p className="mt-2 text-[11px] text-teal-muted">
                半径从围栏中心点向外扩展。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-primary-deep">
                方形范围设置
              </p>
              <div className="grid grid-cols-2 gap-2">
                <label className="rounded-xl bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
                  <span className="text-[11px] font-medium text-teal-muted">长度 (m)</span>
                  <input
                    type="number"
                    min={100}
                    max={2000}
                    step={50}
                    value={rectLength}
                    onChange={(e) => setRectLength(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-black/[0.08] px-2 py-1.5 text-sm font-semibold text-primary-deep outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="rounded-xl bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
                  <span className="text-[11px] font-medium text-teal-muted">宽度 (m)</span>
                  <input
                    type="number"
                    min={100}
                    max={2000}
                    step={50}
                    value={rectWidth}
                    onChange={(e) => setRectWidth(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-black/[0.08] px-2 py-1.5 text-sm font-semibold text-primary-deep outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>
              <p className="text-[11px] text-teal-muted">
                当前方形围栏：{rectLength}m × {rectWidth}m
              </p>
              <p className="text-[11px] text-teal-muted">
                方形围栏以当前中心点向四周展开。
              </p>
            </div>
          )}
        </SoftCard>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-deep">活跃围栏列表</h2>
          <button
            type="button"
            onClick={handleAddFence}
            className="rounded-full bg-surface-blue px-3 py-1.5 text-xs font-semibold text-secondary"
          >
            + 添加新区域
          </button>
        </div>

        <ul className="space-y-3">
          {fences.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <li key={f.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleFenceEdit(f)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleFenceEdit(f);
                    }
                  }}
                  className={`rounded-[1.75rem] transition active:scale-[0.99] ${
                    selectedFenceId === f.id
                      ? "ring-2 ring-primary/35"
                      : "ring-1 ring-black/[0.03]"
                  }`}
                >
                  <SoftCard className="flex items-center gap-3 bg-surface-muted/80 p-3.5">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${toneMap[f.tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary-deep">
                      {f.title}
                      <span className="ml-2 text-[10px] font-medium text-teal-muted">
                        {f.shape === "circle" ? "圆形" : "方形"}
                      </span>
                    </p>
                    <p className="text-xs text-teal-muted">{f.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFence(f.id);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400"
                    aria-label="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </SoftCard>
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          href="/profile/messages?tab=safety"
          className="inline-flex w-full items-center justify-center rounded-full bg-surface-blue px-5 py-3 text-sm font-semibold text-secondary"
        >
          查看告警记录
        </Link>
      </main>
    </MobileShell>
  );
}
