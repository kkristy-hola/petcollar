"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera, Lightbulb, Phone, Volume2, Delete, Play, Square } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";
import { PetSummaryCard } from "@/components/pets/PetSummaryCard";
import { usePets } from "@/state/pets-context";

export default function HomePage() {
  const { pets } = usePets();
  const [isMonitoringOn, setIsMonitoringOn] = useState(false);
  const [showStopOverlay, setShowStopOverlay] = useState(false);
  const [isStopOverlayFading, setIsStopOverlayFading] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [dialOpen, setDialOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "inCall" | "ended">("idle");
  const dialKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  function getMarkerPositionPercent(petId: string, index: number) {
    // 用稳定的 hash 生成伪坐标，确保 UI 原型在多宠物时仍有“分布感”
    let hash = index * 101;
    for (let i = 0; i < petId.length; i++) hash += petId.charCodeAt(i) * (i + 1);
    const left = 12 + (Math.abs(hash) % 76); // 12% ~ 88%
    const top = 18 + (Math.abs(hash * 7) % 62); // 18% ~ 80%
    return { left, top };
  }

  function appendDialKey(key: string) {
    setPhoneNumber((prev) => (prev.length >= 20 ? prev : prev + key));
  }

  function removeLastDigit() {
    setPhoneNumber((prev) => prev.slice(0, -1));
  }

  function openDialer() {
    setCallStatus("dialing");
    setDialOpen(true);
    setPhoneNumber("");
  }

  function hangUpCall() {
    setCallStatus("ended");
    setDialOpen(false);
  }

  const callLabelMap: Record<"idle" | "dialing" | "inCall" | "ended", string> = {
    idle: "打电话",
    dialing: "拨号中",
    inCall: "正在通话",
    ended: "已结束",
  };

  useEffect(() => {
    if (callStatus !== "ended") return;
    const timer = window.setTimeout(() => setCallStatus("idle"), 1600);
    return () => window.clearTimeout(timer);
  }, [callStatus]);

  return (
    <MobileShell>
      <AppTopBar layout="home" />

      <main className="space-y-5 px-5">
        <section>
          <div className="space-y-2">
            {pets.map((pet) => (
              <PetSummaryCard key={pet.id} pet={pet} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between px-0.5">
            <h3 className="text-lg font-bold text-primary-deep">当前位置</h3>
          </div>
          <Link href="/tracking" className="block">
            <div className="relative h-40 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-50 shadow-[var(--shadow-soft)]">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#fff6 1px,transparent 1px),linear-gradient(#fff6 1px,transparent 1px),radial-gradient(circle at 20% 30%,rgba(127,87,0,0.10),transparent 35%),radial-gradient(circle at 70% 60%,rgba(64,100,106,0.14),transparent 45%)",
                  backgroundSize: "22px 22px,22px 22px,100% 100%,100% 100%",
                }}
              />

              {/* 位置点 marker：气泡中展示宠物头像（mock 坐标） */}
              {pets.map((pet, index) => {
                const { left, top } = getMarkerPositionPercent(pet.id, index);
                return (
                  <div
                    key={pet.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    aria-label={`宠物位置：${pet.name}`}
                  >
                    <div
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-2 ring-white ${
                        pet.online ? "ring-emerald-200" : "opacity-60 ring-stone-200"
                      }`}
                      title={pet.name}
                    >
                      <Image
                        src={pet.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${
                          pet.online ? "bg-emerald-400" : "bg-stone-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}

              {/* 简洁浮层：在线设备数 */}
              <div className="absolute bottom-2 right-2 rounded-full bg-surface-elevated/90 px-3 py-1 text-[11px] font-semibold text-teal-muted shadow-sm backdrop-blur">
                在线设备：{pets.filter((pet) => pet.online).length}
              </div>
            </div>
          </Link>
        </section>

        <section>
          <SoftCard className="bg-surface-elevated p-5 shadow-[0_20px_40px_rgb(38_26_0/0.08)]">
            <div className="mb-3 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-primary-deep">摄像头监控</h3>
            </div>

            {/* 默认摄像头监控界面（mock） */}
            <div
              className="relative rounded-2xl bg-gradient-to-br from-stone-800 to-stone-600 p-4 text-white"
              onClick={() => {
                if (!isMonitoringOn) return;
                setShowStopOverlay(true);
                setIsStopOverlayFading(false);
                window.setTimeout(() => setIsStopOverlayFading(true), 1200);
                window.setTimeout(() => setShowStopOverlay(false), 1600);
              }}
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative flex h-44 items-center justify-center">
                {!isMonitoringOn ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMonitoringOn(true);
                      setShowStopOverlay(false);
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-primary shadow-lg"
                    aria-label="开启监控"
                  >
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-emerald-400" />
                    <p className="text-sm font-semibold text-white/90">监控中</p>
                    <p className="mt-1 text-xs text-white/70">点击画面可呼出停止按钮</p>
                  </div>
                )}

                {isMonitoringOn && showStopOverlay ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMonitoringOn(false);
                      setShowStopOverlay(false);
                      setIsStopOverlayFading(false);
                    }}
                    className={`absolute inset-x-1/2 top-1/2 flex h-12 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-white/95 text-primary-deep shadow-lg transition-opacity ${
                      isStopOverlayFading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <Square className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">停止监控</span>
                  </button>
                ) : null}
              </div>

              <div className="relative mt-2 flex items-center justify-center text-xs text-white/80">
                {isMonitoringOn ? "已开启监控" : "未开启监控"}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsLightOn((v) => !v)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm transition ${
                  isLightOn
                    ? "bg-primary text-on-primary"
                    : "bg-surface-yellow text-primary-deep"
                }`}
              >
                <Lightbulb className="mr-1.5 inline h-4 w-4" />
                {isLightOn ? "指示灯已开启" : "开启指示灯"}
              </button>
              <button
                type="button"
                onClick={() => setIsSoundOn((v) => !v)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm transition ${
                  isSoundOn ? "bg-secondary text-white" : "bg-surface-blue text-secondary"
                }`}
              >
                <Volume2 className="mr-1.5 inline h-4 w-4" />
                {isSoundOn ? "声音已开启" : "发出声音"}
              </button>
            </div>

            {/* 拨号功能入口 */}
            <button
              type="button"
              onClick={() => {
                if (callStatus === "inCall") {
                  hangUpCall();
                  return;
                }
                openDialer();
              }}
              className={`mt-2 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
                callStatus === "inCall"
                  ? "bg-primary text-on-primary"
                  : callStatus === "dialing"
                    ? "bg-surface-blue text-secondary"
                    : callStatus === "ended"
                      ? "bg-surface-yellow text-primary-deep"
                      : "bg-surface-muted text-secondary"
              }`}
            >
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {callStatus === "inCall" ? "正在通话（点此挂断）" : callLabelMap[callStatus]}
              </span>
            </button>
          </SoftCard>

          {/* 拨号底部弹层（mock） */}
          {dialOpen ? (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
              role="dialog"
              aria-modal="true"
              onClick={() => setDialOpen(false)}
            >
              <div
                className="w-full max-w-[390px] rounded-t-[2rem] bg-surface-elevated px-5 pb-[env(safe-area-inset-bottom)] pt-5 shadow-[var(--shadow-soft)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary-deep">拨打电话</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setDialOpen(false);
                      if (callStatus === "dialing") setCallStatus("idle");
                    }}
                    className="text-sm font-semibold text-teal-muted"
                  >
                    取消
                  </button>
                </div>

                <div className="rounded-2xl bg-surface-muted px-4 py-3 text-center">
                  <p className="text-[11px] font-semibold text-secondary">电话号码</p>
                  <p className="mt-1 min-h-7 text-2xl font-bold tracking-[0.08em] text-primary-deep">
                    {phoneNumber || "-"}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {dialKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => appendDialKey(key)}
                      className="rounded-2xl bg-surface-muted px-3 py-3.5 text-lg font-semibold text-primary-deep shadow-sm"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={removeLastDigit}
                    className="flex items-center justify-center rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-secondary"
                    aria-label="删除一位"
                  >
                    <Delete className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialOpen(false)}
                    className="rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (phoneNumber.trim()) setCallStatus("inCall");
                      setDialOpen(false);
                    }}
                    className="rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-on-primary"
                  >
                    拨号
                  </button>
                </div>

              </div>
            </div>
          ) : null}
        </section>
      </main>
    </MobileShell>
  );
}
