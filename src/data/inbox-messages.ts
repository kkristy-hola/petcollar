export type InboxCategory = "safety" | "health" | "device" | "service";
export type InboxPriority = "critical" | "warning" | "info";

export type InboxMessage = {
  id: string;
  category: InboxCategory;
  priority: InboxPriority;
  title: string;
  time: string;
  read: boolean;
};

export const INITIAL_INBOX_MESSAGES: InboxMessage[] = [
  {
    id: "s1",
    category: "safety",
    priority: "critical",
    title: "巴迪 于 14:32 离开「阳光社区公园」安全围栏",
    time: "今天 14:32",
    read: false,
  },
  {
    id: "s2",
    category: "safety",
    priority: "warning",
    title: "小凯 的实时位置已 10 分钟未更新，请检查网络状态",
    time: "今天 13:58",
    read: false,
  },
  {
    id: "s3",
    category: "safety",
    priority: "warning",
    title: "巴迪 的定位设备暂时离线，已进入重连中",
    time: "今天 11:06",
    read: true,
  },
  {
    id: "s4",
    category: "safety",
    priority: "info",
    title: "已为 巴迪 启动寻宠模式，指示灯与声音控制可用",
    time: "昨天 19:41",
    read: true,
  },
  {
    id: "s5",
    category: "safety",
    priority: "info",
    title: "小凯 已回到围栏范围内，位置恢复正常",
    time: "昨天 18:20",
    read: true,
  },
  {
    id: "h1",
    category: "health",
    priority: "warning",
    title: "巴迪 今日活跃度较过去 3 天平均值下降 18%",
    time: "今天 17:05",
    read: false,
  },
  {
    id: "h2",
    category: "health",
    priority: "info",
    title: "小凯 今日抓挠行为出现轻微增加，建议关注皮肤状态",
    time: "今天 15:22",
    read: false,
  },
  {
    id: "h3",
    category: "health",
    priority: "warning",
    title: "巴迪 昨夜睡眠时长低于平时水平，恢复状态一般",
    time: "今天 08:30",
    read: true,
  },
  {
    id: "h4",
    category: "health",
    priority: "info",
    title: "小凯 今日状态平稳，活动与休息节律正常",
    time: "昨天 21:15",
    read: true,
  },
  {
    id: "h5",
    category: "health",
    priority: "info",
    title: "智能提示：巴迪今日午后活跃明显，建议补充饮水并观察休息节奏",
    time: "昨天 16:48",
    read: false,
  },
  {
    id: "d1",
    category: "device",
    priority: "critical",
    title: "巴迪 项圈当前电量为 18%，建议尽快充电",
    time: "今天 12:10",
    read: false,
  },
  {
    id: "d2",
    category: "device",
    priority: "info",
    title: "小凯 的设备已充电完成，可恢复正常佩戴",
    time: "今天 09:55",
    read: true,
  },
  {
    id: "d3",
    category: "device",
    priority: "info",
    title: "检测到新的固件版本，建议升级以获得更稳定定位体验",
    time: "昨天 22:03",
    read: false,
  },
  {
    id: "d4",
    category: "device",
    priority: "info",
    title: "巴迪 项圈连接已恢复，数据同步正常",
    time: "前天 20:17",
    read: true,
  },
  {
    id: "d5",
    category: "device",
    priority: "warning",
    title: "摄像头当前不可用，请检查权限或设备连接状态",
    time: "前天 14:02",
    read: false,
  },
  {
    id: "v1",
    category: "service",
    priority: "info",
    title: "数字陪伴+ 新增 AI 健康洞察能力，已为你开放试用",
    time: "今天 10:00",
    read: false,
  },
  {
    id: "v2",
    category: "service",
    priority: "info",
    title: "系统更新：健康页现已支持日 / 周 / 月切换查看",
    time: "昨天 09:00",
    read: true,
  },
  {
    id: "v3",
    category: "service",
    priority: "info",
    title: "你于今天 16:20 发起了一次拨号操作",
    time: "今天 16:20",
    read: true,
  },
  {
    id: "v4",
    category: "service",
    priority: "info",
    title: "广播语音功能已完成升级，支持更快触达附近设备",
    time: "前天 11:40",
    read: false,
  },
  {
    id: "v5",
    category: "service",
    priority: "info",
    title: "新版定位页已上线，寻宠模式入口更快捷",
    time: "3 天前",
    read: true,
  },
];

export function countUnreadInbox(messages: InboxMessage[]) {
  return messages.filter((m) => !m.read).length;
}
