"use client";

import React from "react";

type Direction = "prev" | "next";

export default function ChapterNavButton({
  direction,
  onClick,
  disabled,
  label,
  className = "",
}: {
  direction: Direction;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const isPrev = direction === "prev";
  const displayLabel = label ?? (isPrev ? "Previous" : "Next");

  const baseClasses =
    "inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-5 text-xl md:text-2xl rounded-2xl font-semibold text-white shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[.99]";
  const colorClasses = disabled
    ? "bg-gray-300 cursor-not-allowed opacity-60"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      type="button"
      data-direction={direction}
      aria-label={isPrev ? "Go to previous chapter" : "Go to next chapter"}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {isPrev ? "←" : null}
      {displayLabel}
      {!isPrev ? "→" : null}
    </button>
  );
}
