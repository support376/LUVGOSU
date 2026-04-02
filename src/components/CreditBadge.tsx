"use client";

import { useState, useEffect } from "react";

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/check-free")
      .then((r) => r.json())
      .then(({ isFree }) => setCredits(isFree ? 1 : 0))
      .catch(() => setCredits(0));
  }, []);

  if (credits === null) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-1.5 bg-card border border-card-border rounded-full px-3 py-1.5 shadow-lg">
      <span className="text-sm">💝</span>
      <span className="text-xs font-bold text-accent">{credits}</span>
      <span className="text-[10px] text-muted">회 남음</span>
    </div>
  );
}
