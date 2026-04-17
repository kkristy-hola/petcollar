import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MessageBellButton } from "@/components/navigation/MessageBellButton";

/** 顶栏主标题：全站统一字号与字重 */
export const APP_TOPBAR_TITLE_CLASS =
  "truncate text-[17px] font-bold leading-snug tracking-tight text-primary-deep";

/** 与顶栏一致的安全区 + 水平内边距（仅上、左右，不含底边距） */
export const APP_TOPBAR_INSET_X = "px-5";

export const APP_TOPBAR_SAFE_TOP = "pt-[max(0.65rem,env(safe-area-inset-top))]";

/** 返回按钮样式（与铃铛圆形按钮同系） */
export const APP_TOPBAR_BACK_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5ebe0] text-primary-deep shadow-sm transition active:scale-95";

type LayoutMode = "home" | "main" | "back" | "profile";

type Props = {
  /** 中间标题：main 左对齐；back 与标题同列居中 */
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: ReactNode;
  /** 标题下副文案（设备绑定摘要等） */
  meta?: string;
  /** 显式指定布局；不传则按 title / showBack / profile 字段推断 */
  layout?: LayoutMode;
  /** profile：用户区 + 铃铛 */
  profileTitle?: string;
  profileSubtitle?: string;
  profileAvatarSrc?: string;
};

function inferLayout(p: Props): LayoutMode {
  if (p.layout) return p.layout;
  if (p.profileTitle) return "profile";
  if (p.showBack) return "back";
  if (p.title) return "main";
  return "home";
}

const productTitle = "宠物智能项圈";

export function AppTopBar({
  title,
  showBack,
  backHref = "/",
  rightSlot,
  meta,
  layout: layoutProp,
  profileTitle,
  profileSubtitle,
  profileAvatarSrc = "/placeholders/user-avatar.svg",
}: Props) {
  const mode = inferLayout({
    layout: layoutProp,
    title,
    showBack,
    profileTitle,
  });

  const outer = `${APP_TOPBAR_SAFE_TOP} ${APP_TOPBAR_INSET_X} pb-3`;

  if (mode === "profile" && profileTitle) {
    return (
      <header className={`flex items-start justify-between gap-3 ${outer}`}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <Image
              src={profileAvatarSrc}
              alt="用户头像"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <p className={APP_TOPBAR_TITLE_CLASS}>{profileTitle}</p>
            {profileSubtitle ? (
              <p className="mt-0.5 truncate text-[13px] font-medium leading-snug text-teal-muted">
                {profileSubtitle}
              </p>
            ) : null}
            {meta ? (
              <p className="mt-0.5 truncate text-[11px] font-semibold leading-snug text-teal-muted">
                {meta}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {rightSlot ?? <MessageBellButton />}
        </div>
      </header>
    );
  }

  if (mode === "home") {
    return (
      <header className={`flex items-start justify-between gap-3 ${outer}`}>
        <div className="min-w-0 flex-1">
          <h1 className={APP_TOPBAR_TITLE_CLASS}>{productTitle}</h1>
          {meta ? (
            <p className="mt-0.5 truncate text-[11px] font-semibold leading-snug text-teal-muted">
              {meta}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {rightSlot ?? <MessageBellButton />}
        </div>
      </header>
    );
  }

  if (mode === "main" && title) {
    return (
      <header className={`flex w-full items-start justify-between gap-3 ${outer}`}>
        <div className="min-w-0 flex-1">
          <h1 className={APP_TOPBAR_TITLE_CLASS}>{title}</h1>
          {meta ? (
            <p className="mt-0.5 truncate text-[11px] font-semibold leading-snug text-teal-muted">
              {meta}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {rightSlot ?? <MessageBellButton />}
        </div>
      </header>
    );
  }

  /* back */
  return (
    <header className={`flex w-full items-start gap-2 ${outer}`}>
      <Link href={backHref} className={`${APP_TOPBAR_BACK_CLASS} mt-0.5`} aria-label="返回">
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </Link>
      <div className="min-w-0 flex-1 px-1 text-center">
        <h1 className={APP_TOPBAR_TITLE_CLASS}>{title ?? productTitle}</h1>
        {meta ? (
          <p className="mt-0.5 truncate text-[11px] font-semibold leading-snug text-teal-muted">
            {meta}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {rightSlot ?? <MessageBellButton />}
      </div>
    </header>
  );
}
