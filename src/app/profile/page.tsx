"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  ChevronRight,
  Info,
  LifeBuoy,
  LogOut,
  Pencil,
  Plus,
  Settings,
  Signal,
  Trash2,
  Wifi,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import {
  getPetNameBySlug,
  premiumMembershipCard,
  profileBrand,
  profileDevicesSection,
  profilePetsList,
  type ProfileDeviceRow,
} from "@/data/profile-design-mock";
import { useProfileDevices } from "@/state/profile-devices-context";

/** 在线时根据 signalPct 给出「强 / 中」；离线或无信号为「无信号」 */
function deviceSignalTier(device: Pick<ProfileDeviceRow, "online" | "signalPct">): string {
  if (!device.online || device.signalPct <= 0) return "无信号";
  if (device.signalPct >= 80) return "强";
  if (device.signalPct >= 45) return "中";
  return "中";
}

function SettingsRow({
  href,
  icon: Icon,
  label,
  danger,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  danger?: boolean;
}) {
  const rowClass =
    "flex items-center gap-3 rounded-[1.35rem] py-2.5 pr-2 pl-1 transition active:scale-[0.99]";
  const inner = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          danger ? "bg-rose-50 text-rose-600" : "bg-[#f5ebe0] text-primary-deep"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span
        className={`min-w-0 flex-1 text-[15px] font-semibold ${
          danger ? "text-rose-600" : "text-[#3d3428]"
        }`}
      >
        {label}
      </span>
      {href && !danger ? (
        <ChevronRight className="h-4 w-4 shrink-0 text-[#b5a896]" strokeWidth={2} />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return <div className={`${rowClass} cursor-default`}>{inner}</div>;
}

export default function ProfilePage() {
  const { devices, removeDevice } = useProfileDevices();

  return (
    <MobileShell>
      <main className="bg-[#fffbf7] px-5 pb-10">
        <AppTopBar
          layout="profile"
          profileTitle={profileBrand.name}
          profileSubtitle={profileBrand.welcomeLine}
          profileAvatarSrc="/placeholders/user-avatar.svg"
        />

        <section className="relative mt-1 overflow-hidden rounded-[1.85rem] bg-gradient-to-br from-[#e8b84a] via-[#d9912e] to-[#a86a12] p-[1.15rem] pb-5 text-white shadow-[0_20px_48px_rgb(168_106_18/0.35)]">
          <div className="pointer-events-none absolute -right-8 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute right-4 bottom-0 h-32 w-32 rounded-full bg-[#fff3]/10 blur-xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white/95 backdrop-blur-sm">
              <Award className="h-3.5 w-3.5" strokeWidth={2} />
              {premiumMembershipCard.tag}
            </div>
            <h2 className="mt-3 text-[1.65rem] font-bold leading-tight tracking-tight">
              {premiumMembershipCard.title}
            </h2>
            <p className="mt-2 max-w-[95%] text-[13px] leading-snug text-white/92">
              {premiumMembershipCard.description}
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-white py-3 text-[15px] font-semibold text-[#7a5210] shadow-[0_8px_24px_rgb(0_0_0/0.12)] transition active:scale-[0.99]"
            >
              {premiumMembershipCard.cta}
            </button>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[17px] font-bold tracking-tight text-[#3a2f1f]">
              我的宠物（{profilePetsList.length}）
            </h3>
            <Link
              href="/profile/pet?new=1"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5ebe0] text-primary-deep shadow-[0_2px_8px_rgb(38_26_0/0.06)] transition active:scale-95"
              aria-label="添加新宠物"
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2} />
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {profilePetsList.map((pet) => (
              <Link
                key={pet.slug}
                href={`/profile/pet?pet=${pet.slug}`}
                className="group flex aspect-[3/4.25] flex-col overflow-hidden rounded-[1.15rem] bg-[#fdf6ee] p-1.5 shadow-[0_8px_20px_rgb(38_26_0/0.05)] ring-1 ring-black/[0.03] transition active:scale-[0.98]"
              >
                <div className="relative mx-auto mt-0.5 aspect-square w-[56%] max-w-[3.1rem] shrink-0 overflow-hidden rounded-xl shadow-[0_3px_10px_rgb(38_26_0/0.08)] ring-1 ring-white/90">
                  <Image
                    src={pet.avatarUrl}
                    alt={`${pet.name} 的头像`}
                    fill
                    className="object-cover transition group-active:scale-[1.02]"
                    sizes="56px"
                  />
                </div>
                <div className="mt-1.5 flex min-h-0 flex-1 flex-col px-0.5 pb-0.5">
                  <div className="flex min-h-[1.35rem] items-baseline justify-center gap-1 px-0.5">
                    <span className="min-w-0 truncate text-[13px] font-bold leading-tight text-[#3a2f1f]">
                      {pet.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold leading-none text-[#7a6a58]">
                      {pet.ageLabel}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 min-h-[2rem] text-center text-[10px] font-medium leading-snug text-[#9a8f82]">
                    {pet.breed}
                  </p>
                  <div className="mt-auto flex w-full items-center justify-between gap-1 border-t border-black/[0.04] pt-1">
                    <span className="flex min-w-0 items-center gap-1 pl-0.5">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          pet.online ? "bg-emerald-400" : "bg-[#d4c4a8]"
                        }`}
                      />
                      <span
                        className={`truncate text-[10px] font-medium ${
                          pet.online ? "text-emerald-700/90" : "text-[#a89880]"
                        }`}
                      >
                        {pet.online ? "在线" : "离线"}
                      </span>
                    </span>
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 text-primary-deep shadow-sm"
                      aria-hidden
                    >
                      <Pencil className="h-2.5 w-2.5" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-[1.35rem] bg-[#e8f4f7] p-3 shadow-[0_12px_28px_rgb(64_100_106/0.07)]">
          <h3 className="text-[16px] font-bold tracking-tight text-[#2d4a52]">
            {profileDevicesSection.title}（{devices.length}）
          </h3>
          <div className="mt-2 space-y-2">
            {devices.map((device) => {
              const petName = getPetNameBySlug(device.boundPetSlug);
              const tier = deviceSignalTier(device);
              return (
                <div
                  key={device.id}
                  className="rounded-xl bg-white px-2.5 py-2 shadow-[0_4px_12px_rgb(45_74_82/0.05)] ring-1 ring-black/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5 shrink-0 text-[#4a6f78]" strokeWidth={2} />
                    <p className="min-w-0 flex-1 truncate text-[13px] font-bold leading-tight text-[#2a3f44]">
                      {device.modelName}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                          device.online
                            ? "bg-[#ecfdf3] text-[#166534]"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${device.online ? "bg-[#22c55e]" : "bg-stone-400"}`}
                        />
                        {device.online ? "在线" : "离线"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                          tier === "无信号"
                            ? "bg-stone-100 text-stone-500"
                            : "bg-[#eff6ff] text-[#1d4ed8]"
                        }`}
                      >
                        {tier === "无信号" ? null : (
                          <Signal className="h-2.5 w-2.5" strokeWidth={2} />
                        )}
                        {tier === "无信号" ? "无信号" : `信号${tier}`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-2 gap-y-1 border-t border-black/[0.05] pt-1.5 text-[11px] leading-snug text-[#5a6b6e]">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p>
                        <span className="text-[#8a9da0]">绑定宠物：</span>
                        <span className="font-medium text-[#2f4248]">{petName ?? "—"}</span>
                      </p>
                      <p>
                        <span className="text-[#8a9da0]">设备编号：</span>
                        <span className="font-medium tabular-nums text-[#2f4248]">{device.id}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pb-0.5">
                      <button
                        type="button"
                        onClick={() => removeDevice(device.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm transition active:scale-95"
                        aria-label={`删除设备 ${device.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <Link
                        href={`/profile/device?id=${encodeURIComponent(device.id)}`}
                        className="text-[11px] font-semibold text-[#7f5700] underline-offset-2 hover:underline"
                      >
                        {profileDevicesSection.manageLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <nav className="mt-8 space-y-1 border-t border-black/[0.04] pt-2" aria-label="设置与帮助">
          <SettingsRow href="/profile/settings" icon={Settings} label="设置" />
          <SettingsRow icon={LifeBuoy} label="帮助与反馈" />
          <SettingsRow icon={Info} label="关于我们" />
        </nav>

        <button
          type="button"
          className="mt-2 flex w-full items-center gap-3 rounded-[1.35rem] py-2.5 pr-2 pl-1 text-left transition active:bg-rose-50/60"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="text-[15px] font-semibold text-rose-600">退出登录</span>
        </button>
      </main>
    </MobileShell>
  );
}
