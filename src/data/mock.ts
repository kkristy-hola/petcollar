export const appBrand = {
  nameZh: "爪伴",
  nameEn: "爪伴智能项圈",
};

export const mockPet = {
  name: "Buddy",
  breed: "金毛寻回犬",
  breedEn: "Golden Retriever",
  age: "2 岁 4 个月",
  weight: "32 kg",
  gender: "公",
  avatarUrl: "/placeholders/pet-avatar.svg",
  vitality: 75,
  steps: 6432,
  stepsGoal: 8000,
  calories: 320,
  caloriesGoal: 450,
  battery: 88,
  heartStatus: "正常",
  online: true,
};

export const mockLocation = {
  place: "阳光社区公园",
  zoneLabel: "居家区域",
  lastUpdated: "刚刚",
};

export const mockMapPet = {
  name: "小金 (Mochi)",
  speed: "4.2 km/h",
  status: "运动中",
  battery: 84,
  signal: "良好",
  accuracy: "±3 米",
};

export const mockFence = {
  centerLabel: "阳光花园 - 中心广场",
  radiusM: 500,
  enabled: true,
  fences: [
    {
      id: "1",
      title: "温馨之家",
      subtitle: "半径 200m · 始终开启",
      tone: "yellow" as const,
      icon: "home" as const,
    },
    {
      id: "2",
      title: "中央公园",
      subtitle: "半径 800m · 周末开启",
      tone: "blue" as const,
      icon: "tree" as const,
    },
    {
      id: "3",
      title: "宠物学校",
      subtitle: "半径 300m · 工作日开启",
      tone: "sage" as const,
      icon: "school" as const,
    },
  ],
};

export const mockFindPet = {
  distanceM: 12,
  stepsHint: "大约 15 步远",
  lastUpdate: "2 秒前",
  signal: "信号极佳",
};

export const mockJourneyEvents = [
  {
    id: "1",
    time: "07:30",
    period: "AM",
    title: "晨间散步",
    badge: "2.4 km",
    type: "walk" as const,
    caption: "Peaceful trail through Pine Ridge",
  },
  {
    id: "2",
    time: "10:45",
    period: "AM",
    title: "午休小憩",
    type: "nap" as const,
    deepSleep: "深度睡眠",
    bpm: "心率 58 bpm",
    duration: "2h 15m",
  },
  {
    id: "3",
    time: "04:00",
    period: "PM",
    title: "后院玩耍",
    type: "play" as const,
  },
  {
    id: "4",
    time: "07:15",
    period: "PM",
    title: "傍晚散步",
    type: "evening" as const,
    routine: "Routine neighborhood loop completed",
    goalLeft: "1.2km remaining",
    goalPct: 75,
  },
];

export const mockDevice = {
  model: "智能项圈 第二代",
  firmware: "固件 v1.2.3",
  active: true,
  otaTitle: "检测到 OTA 更新",
  otaDesc: "提升 GPS 精度与续航表现。",
  batteryPct: 90,
  batteryLabel: "状态优秀",
  network: "LTE-M 网络",
  networkLabel: "信号强",
  uptime: 99.4,
};

export const mockProfile = {
  userName: "Alex",
  petName: "Luna",
  petBreed: "金毛寻回犬，2 岁",
  hubName: "PawsLink Hub",
  hubId: "设备 ID：PX-9281-AS",
  signal: 98,
  unread: 3,
};

export const mockHealthOverview = {
  steps: 10000,
  distanceKm: 7.2,
  calories: 500,
  activeHours: 1.5,
  sleepHours: 9.2,
  deepSleepPct: 70,
  weekBars: [40, 55, 48, 62, 50, 44, 92],
};

export const mockAiLive = {
  vitalityPct: 94,
  behaviorNormal: 90,
  behaviorScratch: 10,
  emotion: "愉悦且稳定",
  emotionDesc: "全天检测到稳定的摇尾模式。",
  sleep: "8h 12m",
  sleepDeepPct: 65,
};

export const mockAiWeekly = {
  range: "10 月 12 日 — 10 月 19 日",
  activityPct: 74,
  distribution: [
    { label: "行走与奔跑", hours: "4.2h", color: "brown" as const },
    { label: "休息", hours: "8.5h", color: "teal" as const },
    { label: "睡眠", hours: "11.3h", color: "gray" as const },
  ],
  safety: "98 /100",
  anomalies: 0,
  summary:
    "本周活动节律稳定，户外时长较上周 12% 提升，夜间恢复充分。",
  streak: "14 天",
  mood: "爱玩",
};
