import Image from "next/image";
import { MapPin } from "lucide-react";
import type { PetProfile } from "@/state/pets-context";

export function PetSummaryCard({ pet }: { pet: PetProfile }) {
  return (
    <article className="rounded-xl bg-surface-elevated px-3 py-2.5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shrink-0">
            <Image src={pet.avatarUrl} alt="" fill className="object-cover" sizes="40px" />
          </div>

          {/* 左侧主信息区：是谁 -> 在哪 -> 更新时间（次级） */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary-deep">{pet.name}</p>

            <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-secondary">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{pet.locationSummary}</span>
            </p>

            <p className="mt-0.5 text-[10px] text-teal-muted">更新 {pet.lastUpdated}</p>
          </div>
        </div>

        {/* 右侧状态区：在线/离线（右上） + 电量（成组） */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              pet.online ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"
            }`}
          >
            {pet.online ? "在线" : "离线"}
          </span>

          <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-2 py-1">
            <span className="text-[11px] font-semibold text-primary-deep">电量</span>
            <span className="text-[12px] font-bold text-primary-deep">{pet.battery}%</span>
          </div>
        </div>
      </div>
    </article>
  );
}

