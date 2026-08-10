"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, PhoneCall, PhoneOff, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";
import { usePets } from "@/state/pets-context";
import { getEffectivePetDeviceStatus, useAppStore } from "@/state/app-store";

export default function HomePage() {
  const { pets, selectedPetId, setSelectedPetId, setPetViewMode } = usePets();
  const devices = useAppStore((s) => s.devices);
  const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "inCall" | "ended">("idle");

  function getMarkerPositionPercent(petId: string, index: number) {
    let hash = index * 101;
    for (let i = 0; i < petId.length; i++) hash += petId.charCodeAt(i) * (i + 1);
    const left = 12 + (Math.abs(hash) % 76);
    const top = 18 + (Math.abs(hash * 7) % 62);
    return { left, top };
  }

  function hangUpCall() {
    setCallStatus("ended");
  }

  const callLabelMap: Record<"idle" | "dialing" | "inCall" | "ended", string> = {
    idle: "打电话",
    dialing: "拨号中",
    inCall: "正在通话",
    ended: "已结束",
  };

  useEffect(() => {
    if (callStatus !== "dialing") return;
    const timer = window.setTimeout(() => setCallStatus("inCall"), 900);
    return () => window.clearTimeout(timer);
  }, [callStatus]);

  useEffect(() => {
    if (callStatus !== "ended") return;
    const timer = window.setTimeout(() => setCallStatus("idle"), 1600);
    return () => window.clearTimeout(timer);
  }, [callStatus]);

  useEffect(() => {
    if (pets.length === 0) return;
    if (selectedPetId === "all") {
      setPetViewMode("single");
      setSelectedPetId(pets[0]!.id);
      return;
    }
    if (!selectedPetId || !pets.some((p) => p.id === selectedPetId)) {
      setSelectedPetId(pets[0]!.id);
    }
  }, [pets, selectedPetId, setPetViewMode, setSelectedPetId]);

  const currentPet =
    selectedPetId && selectedPetId !== "all"
      ? pets.find((p) => p.id === selectedPetId) ?? pets[0]
      : pets[0];
  const currentPetDeviceStatus = currentPet
    ? getEffectivePetDeviceStatus(currentPet, devices)
    : null;
  const currentDevice =
    currentPet?.boundDeviceId != null
      ? devices.find((d) => d.id === currentPet.boundDeviceId) ?? null
      : null;

  return (
    <MobileShell>
      <AppTopBar layout="home" />

      <main className="space-y-5 px-5">
        <section>
          <h3 className="mb-2 px-0.5 text-sm font-semibold text-teal-muted">选择宠物</h3>
          {pets.length === 0 ? (
            <div className="rounded-xl bg-surface-elevated px-4 py-4 text-sm text-teal-muted">
              暂无宠物，请前往“我的”页面添加宠物档案。
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pets.map((pet) => {
                const active = currentPet?.id === pet.id;
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl px-2 py-2 transition ${
                      active
                        ? "bg-primary text-on-primary shadow-[0_8px_24px_rgb(127_87_0/0.3)]"
                        : "bg-surface-elevated text-primary-deep shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/85">
                      <Image src={pet.avatarUrl} alt={pet.name} fill className="object-cover" sizes="36px" />
                    </div>
                    <div className="pr-1 text-left">
                      <p className="max-w-[5.5rem] truncate text-sm font-semibold">{pet.name}</p>
                      <p className={`text-[10px] ${active ? "text-white/80" : "text-teal-muted"}`}>{pet.ageLabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <SoftCard className="overflow-hidden bg-surface-elevated p-0 shadow-[0_20px_40px_rgb(38_26_0/0.08)]">
            <div className="bg-gradient-to-br from-[#fff0d2] via-[#fff8ea] to-[#e6f0ec] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-muted">
                    项圈通话
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-primary-deep">
                    {currentPet ? `呼叫 ${currentPet.name} 的项圈` : "呼叫项圈"}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-teal-muted">
                    无需输入号码，点击后直接呼叫当前绑定设备。
                  </p>
                </div>
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${currentDevice?.online ? "bg-emerald-500" : "bg-stone-400"}`} />
              </div>

              <div className="mt-5 flex flex-col items-center rounded-[1.5rem] bg-white/72 px-4 py-5 shadow-sm backdrop-blur">
                <button
                  type="button"
                  disabled={!currentDevice || !currentDevice.online || callStatus === "dialing"}
                  onClick={() => {
                    if (callStatus === "inCall") {
                      hangUpCall();
                      return;
                    }
                    setCallStatus("dialing");
                  }}
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-300 ${
                    callStatus === "inCall" ? "bg-rose-500" : "bg-primary"
                  }`}
                  aria-label={callStatus === "inCall" ? "挂断电话" : "直接呼叫项圈"}
                >
                  {callStatus === "inCall" ? (
                    <PhoneOff className="h-8 w-8" />
                  ) : callStatus === "dialing" ? (
                    <PhoneCall className="h-8 w-8 animate-pulse" />
                  ) : (
                    <Phone className="h-8 w-8" />
                  )}
                </button>
                <p className="mt-3 text-sm font-bold text-primary-deep">
                  {callStatus === "inCall" ? "正在通话 · 点按挂断" : callLabelMap[callStatus]}
                </p>
                <p className="mt-1 text-[11px] text-teal-muted">
                  {!currentDevice
                    ? "当前宠物未绑定设备"
                    : !currentDevice.online
                      ? "设备离线，暂时无法呼叫"
                      : `设备 ${currentDevice.id} · 在线`}
                </p>
              </div>
            </div>

            {currentDevice ? (
              <Link
                href={`/profile/device/whitelist?id=${encodeURIComponent(currentDevice.id)}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition active:bg-surface-muted"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-primary-deep">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary" />
                  通话白名单
                </span>
                <span className="text-xs font-semibold text-teal-muted">
                  {(currentDevice.callWhitelist ?? []).length}/10 个号码 ›
                </span>
              </Link>
            ) : null}
          </SoftCard>
        </section>

        <section>
          <SoftCard className="space-y-3 bg-surface-peach/85 p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-primary-deep">设备信息</h3>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  currentDevice?.online ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"
                }`}
              >
                {currentDevice?.online ? "在线" : "离线"}
              </span>
            </div>
            {currentPet ? (
              <>
                <p className="text-sm font-semibold text-primary-deep">
                  {currentDevice ? `${currentDevice.modelName}（${currentDevice.id}）` : "未绑定设备"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-teal-muted">
                  <div className="rounded-xl bg-white/85 p-2.5">
                    <p>电量</p>
                    <p className="mt-0.5 text-sm font-bold text-primary-deep">
                      {currentPetDeviceStatus?.batteryPct == null ? "—" : `${currentPetDeviceStatus.batteryPct}%`}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-2.5">
                    <p>信号</p>
                    <p className="mt-0.5 text-sm font-bold text-primary-deep">
                      {currentPetDeviceStatus?.signalLabel ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-2.5">
                    <p>定位</p>
                    <p className="mt-0.5 text-sm font-bold text-primary-deep">{currentPet.locationSummary}</p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-2.5">
                    <p>更新时间</p>
                    <p className="mt-0.5 text-sm font-bold text-primary-deep">{currentPet.lastUpdated}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-teal-muted">暂无宠物设备数据。</p>
            )}
          </SoftCard>
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

              {currentPet ? (() => {
                const { left, top } = getMarkerPositionPercent(currentPet.id, 0);
                return (
                  <div
                    key={currentPet.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    aria-label={`宠物位置：${currentPet.name}`}
                  >
                    <div
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-2 ring-white ${
                        currentPet.online ? "ring-emerald-200" : "opacity-60 ring-stone-200"
                      }`}
                      title={currentPet.name}
                    >
                      <Image src={currentPet.avatarUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                      <span
                        className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${
                          currentPet.online ? "bg-emerald-400" : "bg-stone-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })() : null}

              {pets.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-teal-muted">
                  暂无可展示宠物位置
                </div>
              ) : null}
              <div className="absolute bottom-2 right-2 rounded-full bg-surface-elevated/90 px-3 py-1 text-[11px] font-semibold text-teal-muted shadow-sm backdrop-blur">
                在线设备：{devices.filter((d) => d.online).length}
              </div>
            </div>
          </Link>
        </section>
      </main>
    </MobileShell>
  );
}
