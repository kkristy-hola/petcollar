"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { profileDevicesList, type ProfileDeviceRow } from "@/data/profile-design-mock";

type ProfileDevicesContextValue = {
  devices: ProfileDeviceRow[];
  deviceCount: number;
  boundPetDeviceCount: number;
  removeDevice: (id: string) => void;
  setDeviceBoundPet: (deviceId: string, slug: string | null) => void;
};

const ProfileDevicesContext = createContext<ProfileDevicesContextValue | null>(null);

export function ProfileDevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<ProfileDeviceRow[]>(() =>
    profileDevicesList.map((d) => ({ ...d })),
  );

  const boundPetDeviceCount = useMemo(
    () => devices.filter((d) => d.boundPetSlug != null && d.boundPetSlug !== "").length,
    [devices],
  );

  const deviceCount = devices.length;

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const setDeviceBoundPet = useCallback((deviceId: string, slug: string | null) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, boundPetSlug: slug } : d)),
    );
  }, []);

  const value = useMemo(
    () => ({
      devices,
      deviceCount,
      boundPetDeviceCount,
      removeDevice,
      setDeviceBoundPet,
    }),
    [devices, deviceCount, boundPetDeviceCount, removeDevice, setDeviceBoundPet],
  );

  return (
    <ProfileDevicesContext.Provider value={value}>{children}</ProfileDevicesContext.Provider>
  );
}

export function useProfileDevices(): ProfileDevicesContextValue {
  const ctx = useContext(ProfileDevicesContext);
  if (!ctx) {
    throw new Error("useProfileDevices must be used within ProfileDevicesProvider");
  }
  return ctx;
}
