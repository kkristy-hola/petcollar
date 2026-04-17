import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "ghost" | "outlineLight";
};

export function PrimaryButton({
  children,
  variant = "solid",
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition active:scale-[0.99]";
  const styles =
    variant === "solid"
      ? "bg-gradient-to-r from-primary to-[#a07820] text-on-primary shadow-sm"
      : variant === "ghost"
        ? "bg-transparent text-primary underline-offset-4 hover:underline"
        : "bg-white text-primary-deep shadow-sm";

  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
