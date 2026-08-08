"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className ?? "btn-gold"}
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.dispatchEvent(new Event("sanskriti:refresh"));
        router.push("/");
        router.refresh();
      }}
    >
      Log Out
    </button>
  );
}
