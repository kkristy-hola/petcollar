"use client";

import type { ReactNode } from "react";
import { useAppStore, type AppPet } from "@/state/app-store";

export type PetProfile = AppPet;

type NewPetInput = {
  name: string;
  breed: string;
  gender: "male" | "female" | "unknown";
  age: string;
  weight: string;
  avatarUrl?: string;
};

export function PetProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function parseAgeYears(age: string): number {
  const m = age.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

export function usePets() {
  const pets = useAppStore((s) => s.pets);
  const selectedPetIdRaw = useAppStore((s) => s.selectedPetId);
  const petViewMode = useAppStore((s) => s.petViewMode);
  const setSelectedPetIdRaw = useAppStore((s) => s.setSelectedPetId);
  const setPetViewMode = useAppStore((s) => s.setPetViewMode);
  const addPetRaw = useAppStore((s) => s.addPet);
  const updatePet = useAppStore((s) => s.updatePet);
  const removePet = useAppStore((s) => s.removePet);

  const selectedPetId = petViewMode === "all" ? "all" : selectedPetIdRaw ?? "all";

  const setSelectedPetId = (id: string) => {
    if (id === "all") {
      setPetViewMode("all");
      return;
    }
    setPetViewMode("single");
    setSelectedPetIdRaw(id);
  };

  const addPet = (payload: NewPetInput) => {
    addPetRaw({
      name: payload.name,
      breed: payload.breed,
      gender: payload.gender,
      ageYears: parseAgeYears(payload.age),
      weightKg: payload.weight,
      avatarUrl: payload.avatarUrl,
    });
  };

  return {
    pets,
    selectedPetId,
    petViewMode,
    setSelectedPetId,
    setPetViewMode,
    addPet,
    updatePet,
    removePet,
  };
}
