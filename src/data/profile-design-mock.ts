/** 「我的 / 编辑宠物档案」页展示用 mock */

export const profileBrand = {
  name: "宠物智能项圈",
  welcomeLine: "欢迎回来，Alex！",
};

export const premiumMembershipCard = {
  tag: "高级会员",
  title: "数字陪伴+",
  description:
    "解锁进阶健康分析、实时 GPS 轨迹回放，以及 7×24 小时在线兽医咨询服务。",
  cta: "立即升级",
};

export type ProfilePetRow = {
  slug: string;
  name: string;
  breed: string;
  /** 宫格卡片展示用，如「3 岁」 */
  ageLabel: string;
  avatarUrl: string;
  online: boolean;
};

export const profilePetsList: ProfilePetRow[] = [
  {
    slug: "buddy",
    name: "巴迪",
    breed: "金毛寻回犬",
    ageLabel: "3 岁",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: true,
  },
  {
    slug: "mochi",
    name: "年糕",
    breed: "柴犬",
    ageLabel: "2 岁",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: true,
  },
  {
    slug: "luna",
    name: "露娜",
    breed: "边境牧羊犬",
    ageLabel: "4 岁",
    avatarUrl: "/placeholders/pet-avatar.svg",
    online: false,
  },
];

/** 设备与宠物的绑定关系以 boundPetSlug 为准（与 profilePetsList.slug 对应） */
export type ProfileDeviceRow = {
  id: string;
  modelName: string;
  online: boolean;
  /** 0–100，离线时可置 0 仅作展示 */
  signalPct: number;
  boundPetSlug: string | null;
};

export const profileDevicesList: ProfileDeviceRow[] = [
  {
    id: "PX-9281",
    modelName: "智能项圈 第二代",
    online: true,
    signalPct: 98,
    boundPetSlug: "buddy",
  },
  {
    id: "PX-4410",
    modelName: "智能项圈 第二代",
    online: true,
    signalPct: 76,
    boundPetSlug: "mochi",
  },
  {
    id: "TAG-102",
    modelName: "定位胸牌 Lite",
    online: false,
    signalPct: 0,
    boundPetSlug: "luna",
  },
];

export const profileDevicesSection = {
  title: "已绑定设备",
  manageLabel: "管理设备",
};

export function getDeviceBoundToPetFromList(
  devices: readonly ProfileDeviceRow[],
  petSlug: string,
): ProfileDeviceRow | undefined {
  return devices.find((d) => d.boundPetSlug === petSlug);
}

export function getDeviceBoundToPet(petSlug: string): ProfileDeviceRow | undefined {
  return getDeviceBoundToPetFromList(profileDevicesList, petSlug);
}

export function getPetNameBySlug(slug: string | null): string | null {
  if (!slug) return null;
  return profilePetsList.find((p) => p.slug === slug)?.name ?? null;
}

export type PetEditFormMock = {
  petName: string;
  breed: string;
  gender: "male" | "female" | "unknown";
  ageYears: number;
  weightKg: string;
  avatarUrl: string;
};

export const petEditPresets: Record<string, PetEditFormMock> = {
  buddy: {
    petName: "巴迪",
    breed: "金毛寻回犬",
    gender: "male",
    ageYears: 3,
    weightKg: "32",
    avatarUrl: "/placeholders/pet-avatar.svg",
  },
  mochi: {
    petName: "年糕",
    breed: "柴犬",
    gender: "female",
    ageYears: 2,
    weightKg: "10",
    avatarUrl: "/placeholders/pet-avatar.svg",
  },
  luna: {
    petName: "露娜",
    breed: "边境牧羊犬",
    gender: "unknown",
    ageYears: 4,
    weightKg: "18",
    avatarUrl: "/placeholders/pet-avatar.svg",
  },
};

export const emptyPetEditPreset: PetEditFormMock = {
  petName: "",
  breed: "",
  gender: "male",
  ageYears: 1,
  weightKg: "",
  avatarUrl: "/placeholders/pet-avatar.svg",
};
