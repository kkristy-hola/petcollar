"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, PhoneIncoming, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { MobileShell } from "@/components/layout/MobileShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { useAppStore } from "@/state/app-store";

const MAX_NUMBERS = 10;

function normalizePhone(value: string) {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}`;
}

function WhitelistBody() {
  const searchParams = useSearchParams();
  const devices = useAppStore((state) => state.devices);
  const updateDevice = useAppStore((state) => state.updateDevice);
  const deviceId = searchParams.get("id");
  const device = useMemo(
    () => devices.find((item) => item.id === deviceId) ?? devices[0],
    [deviceId, devices],
  );
  const numbers = device?.callWhitelist ?? [];
  const [phone, setPhone] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  function clearForm() {
    setPhone("");
    setEditingIndex(null);
    setError("");
  }

  function saveNumber() {
    if (!device) return;
    const normalized = normalizePhone(phone);
    const digitCount = normalized.replace(/\D/g, "").length;
    if (digitCount < 6 || digitCount > 20) {
      setError("请输入 6–20 位有效电话号码");
      return;
    }
    if (numbers.some((item, index) => item === normalized && index !== editingIndex)) {
      setError("这个号码已经在白名单中");
      return;
    }
    if (editingIndex === null && numbers.length >= MAX_NUMBERS) {
      setError("最多只能添加 10 个号码");
      return;
    }

    const next = [...numbers];
    if (editingIndex === null) next.push(normalized);
    else next[editingIndex] = normalized;
    updateDevice(device.id, { callWhitelist: next });
    clearForm();
  }

  function removeNumber(index: number) {
    if (!device) return;
    updateDevice(device.id, {
      callWhitelist: numbers.filter((_, itemIndex) => itemIndex !== index),
    });
    if (editingIndex === index) clearForm();
  }

  if (!device) {
    return (
      <main className="px-5 py-10 text-center text-sm text-teal-muted">
        暂无设备，请先添加并绑定项圈。
      </main>
    );
  }

  return (
    <main className="space-y-4 px-5 pb-8">
      <SoftCard className="bg-gradient-to-br from-[#fff0d2] to-[#e4efec] p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-primary-deep">只接听可信号码</h2>
            <p className="mt-1 text-xs leading-relaxed text-teal-muted">
              白名单号码可以呼入这台项圈，其他号码会被自动拒接。最多添加 10 个。
            </p>
            <p className="mt-2 text-[11px] font-semibold text-secondary">当前设备：{device.id}</p>
          </div>
        </div>
      </SoftCard>

      <SoftCard className="bg-surface-elevated p-4">
        <label htmlFor="whitelist-phone" className="text-sm font-bold text-primary-deep">
          {editingIndex === null ? "添加号码" : "修改号码"}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="whitelist-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") saveNumber();
            }}
            placeholder="输入电话号码"
            className="min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-surface-muted px-3 py-3 text-sm font-semibold text-primary-deep outline-none transition placeholder:font-normal placeholder:text-teal-muted/70 focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={saveNumber}
            disabled={editingIndex === null && numbers.length >= MAX_NUMBERS}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <Plus className="h-4 w-4" />
            {editingIndex === null ? "添加" : "保存"}
          </button>
        </div>
        {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
        {editingIndex !== null ? (
          <button type="button" onClick={clearForm} className="mt-2 text-xs font-semibold text-teal-muted">
            取消修改
          </button>
        ) : null}
      </SoftCard>

      <section>
        <div className="mb-2 flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold text-primary-deep">已允许的号码</h2>
          <span className="text-xs font-semibold text-teal-muted">{numbers.length}/{MAX_NUMBERS}</span>
        </div>
        {numbers.length === 0 ? (
          <div className="rounded-2xl bg-surface-muted/75 px-5 py-8 text-center">
            <PhoneIncoming className="mx-auto h-7 w-7 text-teal-muted/65" />
            <p className="mt-2 text-sm font-semibold text-primary-deep">还没有白名单号码</p>
            <p className="mt-1 text-xs text-teal-muted">添加家人或照护人的号码即可</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {numbers.map((number, index) => (
              <li key={`${number}-${index}`} className="flex items-center gap-3 rounded-2xl bg-surface-muted/85 p-3.5 shadow-sm ring-1 ring-black/[0.04]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
                  <PhoneIncoming className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold tracking-wide text-primary-deep">
                  {number}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPhone(number);
                    setEditingIndex(index);
                    setError("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-secondary"
                  aria-label={`修改 ${number}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeNumber(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-rose-500"
                  aria-label={`删除 ${number}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default function WhitelistPage() {
  return (
    <MobileShell withBottomNav={false}>
      <AppTopBar title="通话白名单" showBack backHref="/profile/device" />
      <Suspense fallback={<main className="px-5 py-10 text-sm text-teal-muted">加载中…</main>}>
        <WhitelistBody />
      </Suspense>
    </MobileShell>
  );
}
