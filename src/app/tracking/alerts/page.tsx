import { BellRing, ShieldAlert } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

const mockAlerts = [
  { id: 1, title: "围栏离开提醒", time: "今天 09:12", level: "中" },
  { id: 2, title: "定位信号短时波动", time: "今天 08:41", level: "低" },
  { id: 3, title: "夜间静止时间偏长", time: "昨天 22:05", level: "低" },
];

export default function TrackingAlertsPage() {
  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="定位 · 告警记录" showBack backHref="/tracking" />
      <main className="space-y-4 px-5">
        <SoftCard className="flex items-center gap-3 bg-surface-peach p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-primary-deep">安全守护提醒</p>
            <p className="text-xs text-teal-muted">
              当前为演示数据，后续接入真实告警事件流。
            </p>
          </div>
        </SoftCard>
        {mockAlerts.map((item) => (
          <SoftCard key={item.id} className="bg-surface-elevated p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-primary-deep">{item.title}</p>
                <p className="mt-1 text-xs text-teal-muted">{item.time}</p>
              </div>
              <StatusBadge tone={item.level === "中" ? "amber" : "neutral"}>
                {item.level}风险
              </StatusBadge>
            </div>
          </SoftCard>
        ))}
        <SoftCard className="flex items-center justify-center gap-2 bg-surface-muted p-4 text-sm text-teal-muted">
          <BellRing className="h-4 w-4" />
          最近 7 天共 3 条告警
        </SoftCard>
      </main>
    </MobileShell>
  );
}
