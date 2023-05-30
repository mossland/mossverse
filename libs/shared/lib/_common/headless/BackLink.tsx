"use client";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

export interface BackLinkProps {
  className?: string;
  children?: any;
}
export default function BackLink({ className, children }: BackLinkProps) {
  const router = useRouter();
  return (
    <div className={twMerge("cursor-pointer", className)} onClick={() => router.back()}>
      {children}
    </div>
  );
}
