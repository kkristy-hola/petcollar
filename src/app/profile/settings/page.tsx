import { MobileShell } from "@/components/layout/MobileShell";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { SoftCard } from "@/components/ui/SoftCard";

export default function SettingsPage() {
  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="设置" showBack backHref="/profile" />
      <main className="space-y-3 px-5">
        <SoftCard className="bg-surface-elevated p-4">
          <p className="font-semibold text-primary-deep">通知设置</p>
          <p className="mt-1 text-xs text-teal-muted">告警、健康、系统消息</p>
        </SoftCard>
        <SoftCard className="bg-surface-elevated p-4">
          <p className="font-semibold text-primary-deep">隐私设置</p>
          <p className="mt-1 text-xs text-teal-muted">位置共享与数据授权</p>
        </SoftCard>
        <SoftCard className="bg-surface-elevated p-4">
          <p className="font-semibold text-primary-deep">账户安全</p>
          <p className="mt-1 text-xs text-teal-muted">登录设备与密码管理</p>
        </SoftCard>
      </main>
    </MobileShell>
  );
}
