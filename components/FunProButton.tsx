import React from "react";
import Link from "next/link";

type FunProButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export default function FunProButton({ label, href, onClick, className }: FunProButtonProps) {
  const style: React.CSSProperties = {
    // Use site-blue tones to match other buttons
    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.transform = "translateY(-2px)";
    el.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.transform = "translateY(0)";
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  };

  const btn = (
    <button
      type="button"
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {label} ✨
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {btn}
      </Link>
    );
  }

  return btn;
}
