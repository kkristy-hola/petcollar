"use client";

import { usePets } from "@/state/pets-context";

type Props = {
  includeAll?: boolean;
  className?: string;
};

export function PetSwitch({ includeAll = true, className = "" }: Props) {
  const { pets, selectedPetId, setSelectedPetId } = usePets();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {includeAll ? (
        <button
          type="button"
          onClick={() => setSelectedPetId("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            selectedPetId === "all"
              ? "bg-primary text-on-primary"
              : "bg-surface-elevated text-teal-muted"
          }`}
        >
          全部宠物
        </button>
      ) : null}
      {pets.map((pet) => (
        <button
          key={pet.id}
          type="button"
          onClick={() => setSelectedPetId(pet.id)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            selectedPetId === pet.id
              ? "bg-primary text-on-primary"
              : "bg-surface-elevated text-teal-muted"
          }`}
        >
          {pet.name}
        </button>
      ))}
    </div>
  );
}

