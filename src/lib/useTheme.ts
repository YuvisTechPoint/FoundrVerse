"use client";

export function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  
  const stored = localStorage.getItem("theme") as "light" | "dark" | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
}

export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("theme", theme);
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  
  window.dispatchEvent(new Event("theme-change"));
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

