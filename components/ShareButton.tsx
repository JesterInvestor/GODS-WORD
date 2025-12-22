"use client";

import { useEffect, useState } from "react";

export default function ShareButton() {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareTitle, setShareTitle] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setShareUrl(window.location.href);
      setShareTitle(document.title || "Share");
    } catch {
      // ignore
    }
  }, []);

  const handlePrimaryShare = async () => {
    try {
      if (typeof navigator !== "undefined") {
        const nav = navigator as Navigator & {
          share?: (data: { title?: string; url?: string }) => Promise<void>;
        };
        if (nav.share) {
          await nav.share({
          title: shareTitle || "Share",
          url: shareUrl || window.location.href,
          });
          return;
        }
      }
    } catch {
      // fall back to menu
    }
    setMenuOpen((open) => !open);
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore copy errors
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedText = encodeURIComponent(shareTitle || "");

  return (
    <div className="relative mr-2">
      <button
        onClick={handlePrimaryShare}
        className="control-button hover:scale-105 transition-transform"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        title="Share"
      >
        
        517
      </button>

      {menuOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white text-xs rounded shadow-lg p-2 space-y-1 z-50 min-w-[10rem]">
          <button
            onClick={handleCopy}
            className="block w-full text-left hover:text-yellow-300"
            type="button"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-yellow-300"
          >
            Share on X / Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-yellow-300"
          >
            Share on Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-yellow-300"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-yellow-300"
          >
            Share on Reddit
          </a>
        </div>
      )}
    </div>
  );
}
