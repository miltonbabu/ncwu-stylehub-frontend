"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "noir", label: "Noir & Terracotta", colors: ["#1f1d1b", "#b4553f"] },
  { id: "ocean", label: "Ocean & Brass", colors: ["#123a5c", "#c08a3e"] },
  { id: "blush", label: "Blush & Rose", colors: ["#6d2f4a", "#c2708a"] },
  { id: "forest", label: "Forest & Orange", colors: ["#059669", "#f97316"] },
];

export function ThemePicker() {
  const [theme, setTheme] = useState("noir");

  useEffect(() => {
    const saved = localStorage.getItem("stylehub_theme") || "noir";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const pick = (id: string) => {
    setTheme(id);
    localStorage.setItem("stylehub_theme", id);
    document.documentElement.setAttribute("data-theme", id);
  };

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Colour theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => pick(t.id)}
          title={t.label}
          aria-label={`Theme: ${t.label}`}
          className={`h-6 w-6 cursor-pointer rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
            theme === t.id ? "scale-110 border-brand-text" : "border-transparent"
          }`}
          style={{ background: `linear-gradient(135deg, ${t.colors[0]} 50%, ${t.colors[1]} 50%)` }}
        />
      ))}
    </div>
  );
}
