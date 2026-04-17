"use client";

import type { ReactNode } from "react";
import { PetProvider } from "@/state/pets-context";
import { NotificationProvider } from "@/state/notification-context";
import { ProfileDevicesProvider } from "@/state/profile-devices-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PetProvider>
      <ProfileDevicesProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </ProfileDevicesProvider>
    </PetProvider>
  );
}

