"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_INBOX_MESSAGES, type InboxMessage } from "@/data/inbox-messages";

export type PetViewMode = "single" | "all";

export type AppPet = {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female" | "unknown";
  ageYears: number;
  ageLabel: string;
  weightKg: string;
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
  boundDeviceId: string | null;
};

export type AppDevice = {
  id: string;
  modelName: string;
  online: boolean;
  signalPct: number;
  firmware: string;
  batteryPct: number;
  network: string;
  boundPetId: string | null;
};

type AppState = {
  pets: AppPet[];
  devices: AppDevice[];
  notifications: InboxMessage[];
  selectedPetId: string | null;
  petViewMode: PetViewMode;
  hydrated: boolean;
};

type AppActions = {
  markHydrated: () => void;
  resetDemoData: () => void;
  setSelectedPetId: (petId: string | null) => void;
  setPetViewMode: (mode: PetViewMode) => void;
  addPet: (input: {
    name: string;
    breed: string;
    gender: "male" | "female" | "unknown";
    ageYears: number;
    weightKg: string;
    avatarUrl?: string;
  }) => void;
  updatePet: (petId: string, patch: Partial<AppPet>) => void;
  removePet: (petId: string) => void;
  addDevice: (input?: Partial<AppDevice>) => void;
  updateDevice: (deviceId: string, patch: Partial<AppDevice>) => void;
  removeDevice: (deviceId: string) => void;
  bindPetDevice: (petId: string, deviceId: string | null) => void;
  unbindPet: (petId: string) => void;
  unbindDevice: (deviceId: string) => void;
  setNotifications: (list: InboxMessage[]) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (item: InboxMessage) => void;
};

type AppStore = AppState & AppActions;

const demoPets: AppPet[] = [
  {
    id: "pet-1",
    name: "巴迪",
    breed: "金毛寻回犬",
    gender: "male",
    ageYears: 3,
    ageLabel: "3 岁",
    weightKg: "32",
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
    boundDeviceId: "PX-9281",
  },
  {
    id: "pet-2",
    name: "年糕",
    breed: "柴犬",
    gender: "female",
    ageYears: 2,
    ageLabel: "2 岁",
    weightKg: "14",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: true,
    battery: 76,
    lastUpdated: "2 分钟前",
    locationSummary: "河滨步道",
    speed: "3.1 km/h",
    signal: "良好",
    vitality: 82,
    steps: 7032,
    stepsGoal: 8000,
    calories: 286,
    caloriesGoal: 420,
    sleepHours: 8.8,
    boundDeviceId: "PX-4410",
  },
  {
    id: "pet-3",
    name: "露娜",
    breed: "边境牧羊犬",
    gender: "female",
    ageYears: 4,
    ageLabel: "4 岁",
    weightKg: "20",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: false,
    battery: 51,
    lastUpdated: "15 分钟前",
    locationSummary: "宠物学校",
    speed: "0.0 km/h",
    signal: "一般",
    vitality: 70,
    steps: 5210,
    stepsGoal: 9000,
    calories: 240,
    caloriesGoal: 430,
    sleepHours: 9.6,
    boundDeviceId: "TAG-102",
  },
];

const demoDevices: AppDevice[] = [
  {
    id: "PX-9281",
    modelName: "智能项圈 第二代",
    online: true,
    signalPct: 98,
    firmware: "固件 v1.2.3",
    batteryPct: 90,
    network: "LTE-M 网络",
    boundPetId: "pet-1",
  },
  {
    id: "PX-4410",
    modelName: "智能项圈 第二代",
    online: true,
    signalPct: 76,
    firmware: "固件 v1.2.3",
    batteryPct: 84,
    network: "LTE-M 网络",
    boundPetId: "pet-2",
  },
  {
    id: "TAG-102",
    modelName: "定位胸牌 Lite",
    online: false,
    signalPct: 0,
    firmware: "固件 v1.1.8",
    batteryPct: 61,
    network: "NB-IoT",
    boundPetId: "pet-3",
  },
];

function buildDemoState(): AppState {
  return {
    pets: demoPets,
    devices: demoDevices,
    notifications: INITIAL_INBOX_MESSAGES,
    selectedPetId: demoPets[0]?.id ?? null,
    petViewMode: "all",
    hydrated: false,
  };
}

function randomIn(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function syncBindings(pets: AppPet[], devices: AppDevice[]) {
  const nextPets = pets.map((p) => ({ ...p, boundDeviceId: null as string | null }));
  const nextDevices = devices.map((d) => ({ ...d, boundPetId: null as string | null }));
  const petById = new Map(nextPets.map((p) => [p.id, p]));
  const devById = new Map(nextDevices.map((d) => [d.id, d]));

  for (const p of pets) {
    if (!p.boundDeviceId) continue;
    const d = devById.get(p.boundDeviceId);
    if (d) {
      d.boundPetId = p.id;
      petById.get(p.id)!.boundDeviceId = d.id;
    }
  }

  for (const d of devices) {
    if (!d.boundPetId) continue;
    const p = petById.get(d.boundPetId);
    if (p && !p.boundDeviceId) {
      p.boundDeviceId = d.id;
      devById.get(d.id)!.boundPetId = p.id;
    }
  }

  return {
    pets: Array.from(petById.values()),
    devices: Array.from(devById.values()),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...buildDemoState(),
      markHydrated: () => set({ hydrated: true }),
      resetDemoData: () => set(buildDemoState()),
      setSelectedPetId: (petId) => set({ selectedPetId: petId }),
      setPetViewMode: (mode) => set({ petViewMode: mode }),
      addPet: (input) =>
        set((state) => {
          const id = `pet-${Date.now()}`;
          const pet: AppPet = {
            id,
            name: input.name || "新宠物",
            breed: input.breed || "未设置",
            gender: input.gender,
            ageYears: input.ageYears,
            ageLabel: `${Math.max(0, input.ageYears)} 岁`,
            weightKg: input.weightKg || "0",
            avatarUrl: input.avatarUrl || "/placeholders/pet-avatar.svg",
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
            boundDeviceId: null,
          };
          return {
            pets: [...state.pets, pet],
            selectedPetId: pet.id,
            petViewMode: "single" as PetViewMode,
          };
        }),
      updatePet: (petId, patch) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId
              ? {
                  ...p,
                  ...patch,
                  ageLabel:
                    typeof patch.ageYears === "number" ? `${Math.max(0, patch.ageYears)} 岁` : p.ageLabel,
                }
              : p,
          ),
        })),
      removePet: (petId) =>
        set((state) => {
          const pets = state.pets.filter((p) => p.id !== petId).map((p) =>
            p.boundDeviceId && state.devices.some((d) => d.id === p.boundDeviceId && d.boundPetId === petId)
              ? { ...p, boundDeviceId: null }
              : p,
          );
          const devices = state.devices.map((d) =>
            d.boundPetId === petId ? { ...d, boundPetId: null } : d,
          );
          const synced = syncBindings(pets, devices);
          const selectedPetId =
            state.selectedPetId === petId ? (synced.pets[0]?.id ?? null) : state.selectedPetId;
          return { ...synced, selectedPetId };
        }),
      addDevice: (input) =>
        set((state) => {
          const id = input?.id || `DEV-${Date.now().toString().slice(-6)}`;
          const device: AppDevice = {
            id,
            modelName: input?.modelName || "智能项圈 第二代",
            online: input?.online ?? true,
            signalPct: input?.signalPct ?? randomIn(45, 99),
            firmware: input?.firmware || "固件 v1.2.3",
            batteryPct: input?.batteryPct ?? randomIn(40, 98),
            network: input?.network || "LTE-M 网络",
            boundPetId: null,
          };
          return { devices: [device, ...state.devices] };
        }),
      updateDevice: (deviceId, patch) =>
        set((state) => ({
          devices: state.devices.map((d) => (d.id === deviceId ? { ...d, ...patch } : d)),
        })),
      removeDevice: (deviceId) =>
        set((state) => {
          const devices = state.devices.filter((d) => d.id !== deviceId);
          const pets = state.pets.map((p) =>
            p.boundDeviceId === deviceId ? { ...p, boundDeviceId: null } : p,
          );
          return syncBindings(pets, devices);
        }),
      bindPetDevice: (petId, deviceId) =>
        set((state) => {
          let pets = state.pets.map((p) => ({ ...p }));
          let devices = state.devices.map((d) => ({ ...d }));

          pets = pets.map((p) => (p.id === petId ? { ...p, boundDeviceId: null } : p));
          devices = devices.map((d) => (d.boundPetId === petId ? { ...d, boundPetId: null } : d));

          if (deviceId) {
            pets = pets.map((p) => (p.boundDeviceId === deviceId ? { ...p, boundDeviceId: null } : p));
            devices = devices.map((d) => (d.id === deviceId ? { ...d, boundPetId: null } : d));
            pets = pets.map((p) => (p.id === petId ? { ...p, boundDeviceId: deviceId } : p));
            devices = devices.map((d) => (d.id === deviceId ? { ...d, boundPetId: petId } : d));
          }

          return syncBindings(pets, devices);
        }),
      unbindPet: (petId) => get().bindPetDevice(petId, null),
      unbindDevice: (deviceId) =>
        set((state) => {
          const devices = state.devices.map((d) =>
            d.id === deviceId ? { ...d, boundPetId: null } : d,
          );
          const pets = state.pets.map((p) =>
            p.boundDeviceId === deviceId ? { ...p, boundDeviceId: null } : p,
          );
          return syncBindings(pets, devices);
        }),
      setNotifications: (list) => set({ notifications: list }),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      addNotification: (item) =>
        set((state) => ({ notifications: [item, ...state.notifications] })),
    }),
    {
      name: "pet-collar-global-store-v1",
      partialize: (state) => ({
        pets: state.pets,
        devices: state.devices,
        notifications: state.notifications,
        selectedPetId: state.selectedPetId,
        petViewMode: state.petViewMode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

export function getUnreadNotifications(notifications: InboxMessage[]) {
  return notifications.filter((n) => !n.read).length;
}

export function getVisiblePets(pets: AppPet[], selectedPetId: string | null, petViewMode: PetViewMode) {
  if (petViewMode === "all") return pets;
  if (!selectedPetId) return pets.length ? [pets[0]] : [];
  const selected = pets.find((p) => p.id === selectedPetId);
  return selected ? [selected] : pets.length ? [pets[0]] : [];
}

export function getBoundDeviceForPet(pet: AppPet, devices: AppDevice[]): AppDevice | null {
  if (!pet.boundDeviceId) return null;
  return devices.find((d) => d.id === pet.boundDeviceId) ?? null;
}

export function getEffectivePetDeviceStatus(pet: AppPet, devices: AppDevice[]) {
  const boundDevice = getBoundDeviceForPet(pet, devices);
  if (!boundDevice) {
    return {
      online: false,
      batteryPct: null as number | null,
      signalLabel: "未绑定设备",
      signalPct: 0,
    };
  }
  const signalLabel = boundDevice.online
    ? boundDevice.signalPct >= 80
      ? "强"
      : boundDevice.signalPct >= 45
        ? "中"
        : "弱"
    : "无信号";
  return {
    online: boundDevice.online,
    batteryPct: boundDevice.batteryPct,
    signalLabel,
    signalPct: boundDevice.signalPct,
  };
}
