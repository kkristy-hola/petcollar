"use client";

import { Activity, BrainCircuit } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PetSwitch } from "@/components/pets/PetSwitch";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { usePets } from "@/state/pets-context";

export default function BehaviorReportPage() {
  const { pets, selectedPetId } = usePets();
  const currentPet =
    selectedPetId === "all"
      ? pets[0]
      : pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="行为分析报告" showBack backHref="/health" />
      <main className="space-y-4 px-5">
        <PetSwitch includeAll={false} />
        <SoftCard className="bg-surface-elevated p-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary-deep">
              {currentPet.name} 本周行为结论
            </p>
            <StatusBadge tone="green">稳定</StatusBadge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-teal-muted">
            行走节律、休息时段与日间活动峰值总体稳定，未出现持续性异常行为。
          </p>
        </SoftCard>
        <SoftCard className="bg-surface-blue p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            <p className="font-semibold text-secondary">行为分布</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-primary-deep">
            <li className="flex justify-between">
              <span>正常活动</span>
              <span className="font-semibold">90%</span>
            </li>
            <li className="flex justify-between">
              <span>抓挠行为</span>
              <span className="font-semibold">10%</span>
            </li>
          </ul>
        </SoftCard>
        <SoftCard className="bg-surface-peach p-5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <p className="font-semibold text-primary-deep">建议</p>
          </div>
          <p className="mt-2 text-sm text-teal-muted">
            继续保持当前运动节奏，并观察抓挠高峰时段的环境变化。
          </p>
        </SoftCard>
      </main>
    </MobileShell>
  );
}
