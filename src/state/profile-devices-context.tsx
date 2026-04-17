"use client";

import type { ReactNode } from "react";
import { useAppStore } from "@/state/app-store";

export function ProfileDevicesProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useProfileDevices() {
  const devices = useAppStore((s) => s.devices);
  const removeDevice = useAppStore((s) => s.removeDevice);
  const bindPetDevice = useAppStore((s) => s.bindPetDevice);

  const boundPetDeviceCount = devices.filter((d) => d.boundPetId != null).length;

  return {
    devices,
    deviceCount: devices.length,
    boundPetDeviceCount,
    removeDevice,
    setDeviceBoundPet: (deviceId: string, petId: string | null) => {
      if (!petId) {
        const d = devices.find((it) => it.id === deviceId);
        if (d?.boundPetId) bindPetDevice(d.boundPetId, null);
        return;
      }
      bindPetDevice(petId, deviceId);
    },
  };
}
