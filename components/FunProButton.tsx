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
    background: "linear-gradient(135deg, #D6BB87, #CCCC99)",
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

  const handleMouseEnter = (el: HTMLElement) => {
    el.style.transform = "translateY(-2px)";
    el.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
  };

  const handleMouseLeave = (el: HTMLElement) => {
    el.style.transform = "translateY(0)";
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  };

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {label} <span style={{ marginLeft: 8 }}>✨</span>
    </span>
  );

  if (href) {
    // Render an anchor when href is provided (avoid button inside link)
    return (
      <Link href={href} className="inline-block">
        <a
          role="button"
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget as HTMLElement)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget as HTMLElement)}
          style={style}
          className={className}
        >
          {content}
        </a>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
      onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
      style={style}
      className={className}
    >
      {content}
    </button>
  );
}
