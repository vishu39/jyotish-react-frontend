import { createContext, useContext, useState, useEffect } from "react";
import { theme as antdTheme } from "antd";

export const themes = {
  cosmic: {
    key: "cosmic",
    name: "Cosmic",
    icon: "🔮",
    antdConfig: {
      algorithm: antdTheme.darkAlgorithm,
      token: {
        colorPrimary: "#9c6fde",
        colorBgBase: "#0d0820",
        colorBgContainer: "#1a1035",
        colorBgElevated: "#1f1545",
        colorBorder: "#3d2a6e",
        colorText: "#e8d5ff",
        colorTextSecondary: "#b8a0d8",
        colorTextPlaceholder: "#6b5a9e",
        borderRadius: 12,
        borderRadiusLG: 16,
      },
    },
    vars: {
      "--bg-primary": "#0d0820",
      "--bg-secondary": "#1a1035",
      "--bg-card": "rgba(31,21,69,0.85)",
      "--accent": "#9c6fde",
      "--accent-2": "#667eea",
      "--accent-soft": "rgba(156,111,222,0.12)",
      "--text-primary": "#e8d5ff",
      "--text-muted": "#b8a0d8",
      "--border": "#3d2a6e",
      "--login-gradient": "linear-gradient(135deg,#0d0820 0%,#1e0f5c 50%,#1a0533 100%)",
      "--header-bg": "rgba(13,8,32,0.96)",
      "--card-shadow": "0 8px 32px rgba(156,111,222,0.18)",
      "--glow": "0 0 24px rgba(156,111,222,0.25)",
      "--stat1": "linear-gradient(135deg,#9c6fde,#667eea)",
      "--stat2": "linear-gradient(135deg,#764ba2,#9c6fde)",
      "--stat3": "linear-gradient(135deg,#667eea,#764ba2)",
      "--tab-active": "#9c6fde",
    },
  },
  saffron: {
    key: "saffron",
    name: "Saffron",
    icon: "🌅",
    antdConfig: {
      token: {
        colorPrimary: "#d97706",
        colorBgBase: "#fffbf0",
        colorBgContainer: "#ffffff",
        colorBgElevated: "#ffffff",
        colorBorder: "#fcd34d",
        colorText: "#451a03",
        colorTextSecondary: "#92400e",
        colorTextPlaceholder: "#b45309",
        borderRadius: 12,
        borderRadiusLG: 16,
      },
    },
    vars: {
      "--bg-primary": "#fffbf0",
      "--bg-secondary": "#fef3c7",
      "--bg-card": "rgba(255,255,255,0.95)",
      "--accent": "#d97706",
      "--accent-2": "#b45309",
      "--accent-soft": "rgba(217,119,6,0.08)",
      "--text-primary": "#451a03",
      "--text-muted": "#92400e",
      "--border": "#fcd34d",
      "--login-gradient": "linear-gradient(135deg,#f97316 0%,#dc2626 40%,#9f1239 100%)",
      "--header-bg": "rgba(255,251,240,0.98)",
      "--card-shadow": "0 8px 32px rgba(217,119,6,0.14)",
      "--glow": "0 0 24px rgba(217,119,6,0.2)",
      "--stat1": "linear-gradient(135deg,#f97316,#ea580c)",
      "--stat2": "linear-gradient(135deg,#d97706,#b45309)",
      "--stat3": "linear-gradient(135deg,#dc2626,#c2410c)",
      "--tab-active": "#d97706",
    },
  },
  midnight: {
    key: "midnight",
    name: "Midnight",
    icon: "🌊",
    antdConfig: {
      algorithm: antdTheme.darkAlgorithm,
      token: {
        colorPrimary: "#06b6d4",
        colorBgBase: "#020617",
        colorBgContainer: "#0f172a",
        colorBgElevated: "#1e293b",
        colorBorder: "#1e3a5f",
        colorText: "#e2e8f0",
        colorTextSecondary: "#94a3b8",
        colorTextPlaceholder: "#4b6a8e",
        borderRadius: 12,
        borderRadiusLG: 16,
      },
    },
    vars: {
      "--bg-primary": "#020617",
      "--bg-secondary": "#0f172a",
      "--bg-card": "rgba(30,41,59,0.85)",
      "--accent": "#06b6d4",
      "--accent-2": "#3b82f6",
      "--accent-soft": "rgba(6,182,212,0.12)",
      "--text-primary": "#e2e8f0",
      "--text-muted": "#94a3b8",
      "--border": "#1e3a5f",
      "--login-gradient": "linear-gradient(135deg,#020617 0%,#0f172a 50%,#0c4a6e 100%)",
      "--header-bg": "rgba(2,6,23,0.96)",
      "--card-shadow": "0 8px 32px rgba(6,182,212,0.15)",
      "--glow": "0 0 24px rgba(6,182,212,0.2)",
      "--stat1": "linear-gradient(135deg,#06b6d4,#3b82f6)",
      "--stat2": "linear-gradient(135deg,#3b82f6,#06b6d4)",
      "--stat3": "linear-gradient(135deg,#0ea5e9,#6366f1)",
      "--tab-active": "#06b6d4",
    },
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem("jyotish-theme") || "cosmic"
  );

  const currentTheme = themes[themeKey];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    localStorage.setItem("jyotish-theme", themeKey);
    document.body.setAttribute("data-theme", themeKey);
  }, [themeKey, currentTheme]);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, currentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
