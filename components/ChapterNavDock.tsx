"use client";

import { usePathname } from "next/navigation";
import ChapterNavButton from "@/components/ChapterNavButton";

export default function ChapterNavDock() {
  const pathname = usePathname() || "/";
  const isBible = pathname.startsWith("/bible");

  if (!isBible) return null;

  const dispatch = (name: string) => {
    try {
      window.dispatchEvent(new CustomEvent(name));
    } catch (e) {}
  };

  return (
    <div
      className="fixed right-4 md:right-8 z-40 flex items-center gap-2"
      style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
    >
      <ChapterNavButton direction="prev" onClick={() => dispatch("bible-prev-chapter")} />
      <ChapterNavButton direction="next" onClick={() => dispatch("bible-next-chapter")} />
    </div>
  );
}
