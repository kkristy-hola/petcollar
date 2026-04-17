"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Battery, ChevronDown, Download, Plus, Signal, Wifi } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";
import { useProfileDevices } from "@/state/profile-devices-context";
import { usePets } from "@/state/pets-context";
import { useAppStore } from "@/state/app-store";

function DeviceMain({ deviceId }: { deviceId: string }) {
  const { devices, setDeviceBoundPet, removeDevice } = useProfileDevices();
  const { pets } = usePets();
  const device = devices.find((d) => d.id === deviceId)!;
  const petName = pets.find((p) => p.id === device.boundPetId)?.name;

  return (
    <main className="space-y-3 px-5 pb-8">
      <SoftCard className="space-y-4 bg-[#ffedc2] p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Wifi className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
            <h2 className="truncate text-xl font-bold text-primary-deep">{device.modelName}</h2>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${device.online ? "bg-white/80 text-emerald-800" : "bg-white/70 text-stone-600"}`}>
            {device.online ? "在线" : "离线"}
          </span>
        </div>
        <p className="text-xs text-teal-muted">{device.firmware}</p>
        <div className="space-y-1 border-t border-black/[0.08] pt-3 text-xs leading-relaxed text-teal-muted">
          <p><span className="text-secondary/90">设备编号：</span><span className="font-semibold text-primary-deep">{device.id}</span></p>
          <p><span className="text-secondary/90">绑定宠物：</span><span className="font-semibold text-primary-deep">{petName ?? "未绑定"}</span></p>
        </div>

        <div className="rounded-2xl bg-[#f5a623] p-4 text-primary-deep">
          <div className="flex items-start gap-3">
            <Download className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="font-bold">检测到 OTA 更新</p>
              <p className="mt-1 text-xs opacity-90">提升 GPS 精度与续航表现。</p>
              <button type="button" className="mt-3 rounded-full bg-primary-deep px-4 py-2 text-xs font-semibold text-white">立即安装</button>
            </div>
          </div>
        </div>
      </SoftCard>

      <div className="rounded-2xl bg-surface-peach/80 p-3 shadow-sm ring-1 ring-black/[0.05]">
        <label htmlFor="device-rebind-pet" className="mb-1.5 block text-xs font-semibold text-secondary">更换绑定宠物</label>
        <div className="relative">
          <select
            id="device-rebind-pet"
            value={device.boundPetId ?? ""}
            onChange={(e) => setDeviceBoundPet(device.id, e.target.value || null)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-black/[0.08] bg-white/95 py-2.5 pr-9 pl-3 text-sm font-semibold text-primary-deep shadow-inner outline-none transition focus:ring-2 focus:ring-primary/25"
          >
            <option value="">未绑定</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-teal-muted" strokeWidth={2} aria-hidden />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SoftCard className="bg-surface-muted/90 p-3">
          <div className="mb-1 flex items-center justify-between">
            <Battery className="h-4 w-4 text-primary" strokeWidth={2} />
            <span className="text-[9px] font-semibold text-secondary">状态优秀</span>
          </div>
          <p className="text-2xl font-extrabold text-primary-deep">{device.batteryPct}%</p>
          <p className="mt-0.5 text-[9px] font-semibold text-teal-muted">电量</p>
        </SoftCard>
        <SoftCard className="bg-surface-peach/90 p-3">
          <div className="mb-1 flex items-center justify-between">
            <Signal className="h-4 w-4 text-primary" strokeWidth={2} />
            <span className="text-[9px] font-semibold text-secondary">信号强</span>
          </div>
          <p className="text-lg font-extrabold leading-tight text-primary-deep">{device.network}</p>
          <p className="mt-0.5 text-[9px] font-semibold text-teal-muted">网络</p>
        </SoftCard>
      </div>

      <button
        type="button"
        onClick={() => removeDevice(device.id)}
        className="w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white"
      >
        删除设备
      </button>
    </main>
  );
}

function DevicePageBody() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("id");
  const { devices } = useProfileDevices();
  const addDevice = useAppStore((s) => s.addDevice);

  const device = useMemo(() => {
    if (devices.length === 0) return null;
    if (!deviceId) return devices[0];
    return devices.find((d) => d.id === deviceId) ?? null;
  }, [deviceId, devices]);

  if (devices.length === 0) {
    return (
      <MobileShell withBottomNav={false}>
        <AppTopBar title="设备管理" showBack backHref="/profile" />
        <main className="space-y-4 px-5 py-8">
          <p className="text-sm text-teal-muted">暂无设备。</p>
          <button type="button" onClick={() => addDevice()} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> 新增设备
          </button>
          <Link href="/profile" className="block text-sm font-semibold text-[#7f5700] underline underline-offset-2">返回我的</Link>
        </main>
      </MobileShell>
    );
  }

  if (!device) {
    return (
      <MobileShell withBottomNav={false}>
        <AppTopBar title="设备管理" showBack backHref="/profile" />
        <main className="space-y-4 px-5 py-8">
          <p className="text-sm text-teal-muted">未找到该设备，可能已被移除或编号有误。</p>
          <Link href="/profile" className="text-sm font-semibold text-[#7f5700] underline underline-offset-2">返回我的</Link>
        </main>
      </MobileShell>
    );
  }

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="设备管理" showBack backHref="/profile" />
      <div className="px-5 pb-2">
        <button type="button" onClick={() => addDevice()} className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white">
          <Plus className="h-4 w-4" /> 新增设备
        </button>
      </div>
      <DeviceMain key={device.id} deviceId={device.id} />
    </MobileShell>
  );
}

function DevicePageFallback() {
  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="设备管理" showBack backHref="/profile" />
      <main className="px-5 py-8"><p className="text-sm text-teal-muted">加载中…</p></main>
    </MobileShell>
  );
}

export default function DevicePage() {
  return (
    <Suspense fallback={<DevicePageFallback />}>
      <DevicePageBody />
    </Suspense>
  );
}
