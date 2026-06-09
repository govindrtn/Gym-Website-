import {
  DEFAULT_THEME_PREFERENCES,
  THEME_ACCENT_OPTIONS,
  THEME_HEADER_TAB_OPTIONS,
  THEME_MODE_OPTIONS,
  THEME_STORAGE_KEY,
  THEME_TEMPLATE_OPTIONS,
} from "@/constants/theme";

const VALID_THEME_MODES = THEME_MODE_OPTIONS.map((option) => option.value);
const VALID_THEME_TEMPLATES = THEME_TEMPLATE_OPTIONS.map((option) => option.value);
const VALID_THEME_ACCENTS = THEME_ACCENT_OPTIONS.map((option) => option.value);
const VALID_HEADER_TABS = THEME_HEADER_TAB_OPTIONS.map((option) => option.value);
const CUSTOM_ACCENT_VALUE = "custom";
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function normalizeCustomAccent(color) {
  return HEX_COLOR_PATTERN.test(String(color || ""))
    ? String(color).toLowerCase()
    : DEFAULT_THEME_PREFERENCES.customAccent;
}

function normalizeThemePreferences(preferences = {}) {
  const customAccent = normalizeCustomAccent(preferences.customAccent);

  return {
    mode: VALID_THEME_MODES.includes(preferences.mode)
      ? preferences.mode
      : DEFAULT_THEME_PREFERENCES.mode,
    template: VALID_THEME_TEMPLATES.includes(preferences.template)
      ? preferences.template
      : DEFAULT_THEME_PREFERENCES.template,
    accent: VALID_THEME_ACCENTS.includes(preferences.accent) || preferences.accent === CUSTOM_ACCENT_VALUE
      ? preferences.accent
      : DEFAULT_THEME_PREFERENCES.accent,
    customAccent,
    headerTabs: VALID_HEADER_TABS.includes(preferences.headerTabs)
      ? preferences.headerTabs
      : DEFAULT_THEME_PREFERENCES.headerTabs,
  };
}

function getContrastColor(hexColor) {
  const red = Number.parseInt(hexColor.slice(1, 3), 16);
  const green = Number.parseInt(hexColor.slice(3, 5), 16);
  const blue = Number.parseInt(hexColor.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 155 ? "#111827" : "#ffffff";
}

function clearCustomAccentProperties(root) {
  [
    "--primary",
    "--primary-foreground",
    "--ring",
    "--accent",
    "--accent-foreground",
    "--color-primary-soft",
    "--color-primary-accent",
    "--color-success-soft",
    "--color-success-accent",
  ].forEach((property) => root.style.removeProperty(property));
}

function applyCustomAccent(root, color, resolvedMode) {
  const darkMode = resolvedMode === "dark";

  root.style.setProperty("--primary", color);
  root.style.setProperty("--primary-foreground", getContrastColor(color));
  root.style.setProperty("--ring", color);
  root.style.setProperty(
    "--accent",
    `color-mix(in oklab, ${color} ${darkMode ? "24%" : "12%"}, var(--card))`,
  );
  root.style.setProperty("--accent-foreground", darkMode ? "#f8fafc" : "#172033");
  root.style.setProperty(
    "--color-primary-soft",
    `color-mix(in oklab, ${color} ${darkMode ? "20%" : "10%"}, transparent)`,
  );
  root.style.setProperty("--color-primary-accent", color);
  root.style.setProperty(
    "--color-success-soft",
    `color-mix(in oklab, ${color} ${darkMode ? "20%" : "10%"}, transparent)`,
  );
  root.style.setProperty("--color-success-accent", color);
}

function getStoredThemePreferences() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_PREFERENCES;
  }

  try {
    const storedPreferences = window.localStorage.getItem(THEME_STORAGE_KEY);
    const parsedPreferences = storedPreferences ? JSON.parse(storedPreferences) : null;

    return normalizeThemePreferences(parsedPreferences);
  } catch {
    return DEFAULT_THEME_PREFERENCES;
  }
}

function saveThemePreferences(preferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    JSON.stringify(normalizeThemePreferences(preferences)),
  );
}

function getSystemThemeMode() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveThemeMode(mode) {
  return mode === "system" ? getSystemThemeMode() : mode;
}

function applyThemePreferences(preferences, resolvedMode) {
  if (typeof document === "undefined") {
    return;
  }

  const normalizedPreferences = normalizeThemePreferences(preferences);
  const root = document.documentElement;
  const nextResolvedMode = resolvedMode || resolveThemeMode(normalizedPreferences.mode);

  root.classList.toggle("dark", nextResolvedMode === "dark");
  root.dataset.themeMode = normalizedPreferences.mode;
  root.dataset.resolvedTheme = nextResolvedMode;
  root.dataset.template = normalizedPreferences.template;
  root.dataset.accent = normalizedPreferences.accent;
  root.dataset.headerTabs = normalizedPreferences.headerTabs;

  if (normalizedPreferences.accent === CUSTOM_ACCENT_VALUE) {
    applyCustomAccent(root, normalizedPreferences.customAccent, nextResolvedMode);
  } else {
    clearCustomAccentProperties(root);
  }
}

export {
  applyThemePreferences,
  getStoredThemePreferences,
  resolveThemeMode,
  saveThemePreferences,
};
