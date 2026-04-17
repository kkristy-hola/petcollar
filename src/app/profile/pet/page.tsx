"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronsUpDown, Minus, PawPrint, Pencil, Plus, Trash2 } from "lucide-react";
import {
  APP_TOPBAR_BACK_CLASS,
  APP_TOPBAR_INSET_X,
  APP_TOPBAR_SAFE_TOP,
  APP_TOPBAR_TITLE_CLASS,
} from "@/components/layout/AppTopBar";
import { MobileShell } from "@/components/layout/MobileShell";
import {
  emptyPetEditPreset,
  petEditPresets,
  type PetEditFormMock,
} from "@/data/profile-design-mock";

function resolvePreset(isNew: boolean, petKey: string): PetEditFormMock {
  if (isNew) return emptyPetEditPreset;
  return petEditPresets[petKey] ?? petEditPresets.buddy;
}

function PetEditForm({ isNew, petKey }: { isNew: boolean; petKey: string }) {
  const router = useRouter();
  const [form, setForm] = useState<PetEditFormMock>(() => resolvePreset(isNew, petKey));

  const setGender = (gender: PetEditFormMock["gender"]) =>
    setForm((s) => ({ ...s, gender }));

  const bumpAge = (delta: number) =>
    setForm((s) => ({
      ...s,
      ageYears: Math.min(30, Math.max(0, s.ageYears + delta)),
    }));

  const onSave = () => {
    router.push("/profile");
  };

  return (
    <MobileShell>
      <div className="bg-[#fffbf7] pb-8 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <header
          className={`flex items-center gap-2 ${APP_TOPBAR_INSET_X} ${APP_TOPBAR_SAFE_TOP} pb-3`}
        >
          <Link href="/profile" className={APP_TOPBAR_BACK_CLASS} aria-label="返回">
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
          <h1 className={`min-w-0 flex-1 text-center ${APP_TOPBAR_TITLE_CLASS}`}>编辑宠物档案</h1>
          <button
            type="button"
            onClick={onSave}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-on-primary shadow-[0_6px_18px_rgb(127_87_0/0.28)] transition active:scale-[0.98]"
          >
            保存
          </button>
        </header>

        <main className="space-y-6 px-5">
          <div className="flex flex-col items-center pt-1">
            <div className="relative">
              <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full shadow-[0_12px_32px_rgb(38_26_0/0.12)] ring-[3px] ring-[#e8c97a] ring-offset-[3px] ring-offset-[#fffbf7]">
                <Image
                  src={form.avatarUrl}
                  alt="宠物头像"
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <button
                type="button"
                className="absolute -right-1 -bottom-1 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg transition active:scale-95"
                aria-label="更换头像"
              >
                <Pencil className="h-[18px] w-[18px]" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-[#5a6968]">
                宠物昵称
              </label>
              <div className="relative">
                <input
                  value={form.petName}
                  onChange={(e) => setForm((s) => ({ ...s, petName: e.target.value }))}
                  className="w-full rounded-[1.25rem] border-0 bg-[#fdf2e0] py-3.5 pr-12 pl-4 text-[16px] font-semibold text-[#2c2419] shadow-[inset_0_1px_0_rgb(255_255_255/0.65)] outline-none ring-1 ring-black/[0.03] placeholder:text-[#a49a8c]"
                  placeholder="请输入昵称"
                />
                <PawPrint className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-[#b9a990]" strokeWidth={1.75} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-[#5a6968]">
                品种
              </label>
              <div className="relative">
                <input
                  value={form.breed}
                  onChange={(e) => setForm((s) => ({ ...s, breed: e.target.value }))}
                  className="w-full rounded-[1.25rem] border-0 bg-[#fdf2e0] py-3.5 pr-12 pl-4 text-[16px] font-semibold text-[#2c2419] shadow-[inset_0_1px_0_rgb(255_255_255/0.65)] outline-none ring-1 ring-black/[0.03]"
                  placeholder="例如：金毛寻回犬"
                />
                <ChevronsUpDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-[#6f7f82]" strokeWidth={2} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-[#5a6968]">
                性别
              </label>
              <div className="flex gap-1.5 rounded-[1.25rem] bg-[#fdf2e0] p-1.5 ring-1 ring-black/[0.03]">
                {(
                  [
                    { key: "male" as const, label: "公", sym: "♂" },
                    { key: "female" as const, label: "母", sym: "♀" },
                    { key: "unknown" as const, label: "未知", sym: "?" },
                  ] as const
                ).map(({ key, label, sym }) => {
                  const on = form.gender === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGender(key)}
                      className={
                        on
                          ? "flex flex-1 flex-col items-center gap-0.5 rounded-[1rem] bg-primary py-2.5 text-on-primary shadow-md"
                          : "flex flex-1 flex-col items-center gap-0.5 rounded-[1rem] py-2.5 text-[#4a4540] transition hover:bg-white/40"
                      }
                    >
                      <span className="text-[15px] font-semibold leading-none">{sym}</span>
                      <span className="text-[11px] font-semibold leading-none">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-[#5a6968]">
                年龄
              </label>
              <div className="flex items-stretch gap-0 overflow-hidden rounded-[1.25rem] bg-[#fdf2e0] ring-1 ring-black/[0.03]">
                <button
                  type="button"
                  onClick={() => bumpAge(-1)}
                  className="flex w-[3.25rem] shrink-0 items-center justify-center text-primary-deep transition active:bg-black/[0.04]"
                  aria-label="减少一岁"
                >
                  <Minus className="h-5 w-5" strokeWidth={2} />
                </button>
                <div className="flex flex-1 items-center justify-center py-3.5">
                  <span className="text-[16px] font-bold text-[#2c2419]">{form.ageYears} 岁</span>
                </div>
                <button
                  type="button"
                  onClick={() => bumpAge(1)}
                  className="flex w-[3.25rem] shrink-0 items-center justify-center text-primary-deep transition active:bg-black/[0.04]"
                  aria-label="增加一岁"
                >
                  <Plus className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-[#5a6968]">
                体重
              </label>
              <div className="relative">
                <input
                  inputMode="decimal"
                  value={form.weightKg}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, weightKg: e.target.value.replace(/[^\d.]/g, "") }))
                  }
                  className="w-full rounded-[1.25rem] border-0 bg-[#fdf2e0] py-3.5 pr-14 pl-4 text-[16px] font-semibold text-[#2c2419] shadow-[inset_0_1px_0_rgb(255_255_255/0.65)] outline-none ring-1 ring-black/[0.03]"
                  placeholder="0"
                />
                <span className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[14px] font-semibold text-[#5a6968]">
                  公斤
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#feecec] py-4 text-[15px] font-semibold text-rose-600 shadow-[0_8px_22px_rgb(225_29_72/0.08)] transition active:scale-[0.99]"
            >
              <Trash2 className="h-5 w-5" strokeWidth={2} />
              删除档案
            </button>
            <p className="mt-3 px-2 text-center text-[11px] leading-relaxed text-[#8a8f92]">
              删除后，病历、活动记录等所有相关数据将被永久清除，且无法恢复。
            </p>
          </div>
        </main>
      </div>
    </MobileShell>
  );
}

function PetEditRouteBody() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const petKey = (searchParams.get("pet") ?? "buddy").toLowerCase();
  const remountKey = `${isNew ? "new" : "edit"}-${petKey}`;
  return <PetEditForm key={remountKey} isNew={isNew} petKey={petKey} />;
}

function PetEditFallback() {
  return (
    <MobileShell>
      <div className="flex min-h-[40vh] items-center justify-center bg-[#fffbf7] px-5">
        <p className="text-sm text-teal-muted">加载中…</p>
      </div>
    </MobileShell>
  );
}

export default function PetProfilePage() {
  return (
    <Suspense fallback={<PetEditFallback />}>
      <PetEditRouteBody />
    </Suspense>
  );
}
