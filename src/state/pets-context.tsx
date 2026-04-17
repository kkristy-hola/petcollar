"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PetProfile = {
  id: string;
  name: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  avatarUrl: string;
  online: boolean;
  battery: number;
  lastUpdated: string;
  locationSummary: string;
  speed: string;
  signal: string;
  vitality: number;
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  sleepHours: number;
};

type NewPetInput = {
  name: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  avatarUrl?: string;
};

type PetContextValue = {
  pets: PetProfile[];
  selectedPetId: string;
  setSelectedPetId: (id: string) => void;
  addPet: (payload: NewPetInput) => void;
};

const STORAGE_KEY = "pet-collar-multi-pets-v1";

const initialPets: PetProfile[] = [
  {
    id: "pet-1",
    name: "Buddy",
    breed: "金毛寻回犬",
    gender: "公",
    age: "2 岁 4 个月",
    weight: "32 kg",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: true,
    battery: 88,
    lastUpdated: "刚刚",
    locationSummary: "阳光社区公园",
    speed: "4.2 km/h",
    signal: "良好",
    vitality: 75,
    steps: 6432,
    stepsGoal: 8000,
    calories: 320,
    caloriesGoal: 450,
    sleepHours: 9.2,
  },
];

const PetContext = createContext<PetContextValue | null>(null);

function randomIn(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readFromStorage() {
  if (typeof window === "undefined") {
    return { pets: initialPets, selectedPetId: "all" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { pets: initialPets, selectedPetId: "all" };
    }
    const parsed = JSON.parse(raw) as {
      pets?: PetProfile[];
      selectedPetId?: string;
    };
    return {
      pets: parsed.pets?.length ? parsed.pets : initialPets,
      selectedPetId: parsed.selectedPetId ?? "all",
    };
  } catch {
    return { pets: initialPets, selectedPetId: "all" };
  }
}

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<PetProfile[]>(() => readFromStorage().pets);
  const [selectedPetId, setSelectedPetId] = useState<string>(
    () => readFromStorage().selectedPetId,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pets, selectedPetId }));
  }, [pets, selectedPetId]);

  const value = useMemo<PetContextValue>(
    () => ({
      pets,
      selectedPetId,
      setSelectedPetId,
      addPet: (payload) => {
        const newPet: PetProfile = {
          id: `pet-${Date.now()}`,
          name: payload.name,
          breed: payload.breed,
          gender: payload.gender,
          age: payload.age,
          weight: payload.weight,
          avatarUrl: payload.avatarUrl || "/placeholders/pet-avatar.svg",
          online: true,
          battery: randomIn(45, 98),
          lastUpdated: "刚刚",
          locationSummary: "待同步位置",
          speed: "0.0 km/h",
          signal: "一般",
          vitality: randomIn(62, 90),
          steps: randomIn(2800, 9800),
          stepsGoal: 8000,
          calories: randomIn(160, 520),
          caloriesGoal: 450,
          sleepHours: randomIn(7, 11),
        };
        setPets((prev) => [...prev, newPet]);
        setSelectedPetId(newPet.id);
      },
    }),
    [pets, selectedPetId],
  );

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets() {
  const ctx = useContext(PetContext);
  if (!ctx) {
    throw new Error("usePets must be used within PetProvider");
  }
  return ctx;
}

