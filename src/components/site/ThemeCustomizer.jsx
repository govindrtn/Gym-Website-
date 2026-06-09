import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Monitor, Moon, Palette, Pipette, Settings2, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  THEME_ACCENT_OPTIONS,
  THEME_HEADER_TAB_OPTIONS,
  THEME_MODE_OPTIONS,
  THEME_TEMPLATE_OPTIONS,
} from "@/constants";
import "./ThemeCustomizer.css";

const modeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

function ThemeCustomizer({
  preferences,
  resolvedMode,
  onChange,
  className = "",
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const [customAccentDraft, setCustomAccentDraft] = useState(preferences.customAccent);
  const activeAccent = useMemo(
    () => preferences.accent === "custom"
      ? { label: "Custom", color: preferences.customAccent }
      : THEME_ACCENT_OPTIONS.find((option) => option.value === preferences.accent),
    [preferences.accent, preferences.customAccent],
  );
  const activeHeaderTabs = useMemo(
    () => THEME_HEADER_TAB_OPTIONS.find((option) => option.value === preferences.headerTabs),
    [preferences.headerTabs],
  );

  useEffect(() => {
    setCustomAccentDraft(preferences.customAccent);
  }, [preferences.customAccent]);

  useEffect(() => {
    if (!open || !compact) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [compact, open]);

  function updatePreference(field, value) {
    onChange({
      ...preferences,
      [field]: value,
    });
  }

  function updateCustomAccent(color) {
    setCustomAccentDraft(color);
    onChange({
      ...preferences,
      accent: "custom",
      customAccent: color,
    });
  }

  const panel = (
    <div
      className={compact ? "theme-customizer-panel theme-customizer-panel-modal" : "theme-customizer-panel"}
      role={compact ? "dialog" : undefined}
      aria-modal={compact ? "true" : undefined}
      aria-label={compact ? "Customize theme" : undefined}
    >
      <div className="theme-customizer-heading">
        <span className="theme-customizer-icon">
          <Palette className="size-4" />
        </span>
        <span>
          <strong>Client Theme</strong>
          <small>{activeAccent?.label} / {activeHeaderTabs?.label} / {resolvedMode}</small>
        </span>
        {compact && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="theme-customizer-close"
            aria-label="Close theme settings"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        )}
      </div>

      <ThemeOptionGroup title="Mode">
        <div className="theme-mode-grid">
          {THEME_MODE_OPTIONS.map((option) => {
            const ModeIcon = modeIcons[option.value];
            const active = preferences.mode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={active ? "theme-mode-option is-active" : "theme-mode-option"}
                onClick={() => updatePreference("mode", option.value)}
              >
                <ModeIcon className="size-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </ThemeOptionGroup>

      <ThemeOptionGroup title="Template">
        <div className="theme-template-grid">
          {THEME_TEMPLATE_OPTIONS.map((option) => {
            const active = preferences.template === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={active ? "theme-template-option is-active" : "theme-template-option"}
                onClick={() => updatePreference("template", option.value)}
              >
                <span
                  className={`theme-template-preview theme-template-preview-${option.value}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
      </ThemeOptionGroup>

      <ThemeOptionGroup title="Header Tabs">
        <div className="theme-tab-grid">
          {THEME_HEADER_TAB_OPTIONS.map((option) => {
            const active = preferences.headerTabs === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={active ? "theme-tab-option is-active" : "theme-tab-option"}
                onClick={() => updatePreference("headerTabs", option.value)}
              >
                <span
                  className={`theme-tab-preview theme-tab-preview-${option.value}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
      </ThemeOptionGroup>

      <ThemeOptionGroup title="Colors">
        <div className="theme-color-grid">
          {THEME_ACCENT_OPTIONS.map((option) => {
            const active = preferences.accent === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={active ? "theme-color-option is-active" : "theme-color-option"}
                style={{ "--theme-swatch": option.color }}
                aria-label={`Use ${option.label} color`}
                onClick={() => updatePreference("accent", option.value)}
              >
                <span />
                <small>{option.label}</small>
              </button>
            );
          })}
        </div>
        <div className={preferences.accent === "custom" ? "theme-custom-color is-active" : "theme-custom-color"}>
          <label className="theme-custom-color-picker" htmlFor={`theme-custom-accent-${compact ? "mobile" : "desktop"}`}>
            <span style={{ "--theme-swatch": preferences.customAccent }}>
              <Pipette className="size-3.5" />
            </span>
            <span>
              <strong>Custom color</strong>
              <small>Choose any brand color</small>
            </span>
            <input
              id={`theme-custom-accent-${compact ? "mobile" : "desktop"}`}
              type="color"
              value={preferences.customAccent}
              onChange={(event) => updateCustomAccent(event.target.value)}
            />
          </label>
          <input
            className="theme-custom-color-hex"
            type="text"
            value={customAccentDraft}
            aria-label="Custom accent hex color"
            maxLength={7}
            onChange={(event) => {
              const color = event.target.value;

              setCustomAccentDraft(color);

              if (/^#[0-9a-f]{6}$/i.test(color)) {
                updateCustomAccent(color);
              }
            }}
            onBlur={() => setCustomAccentDraft(preferences.customAccent)}
          />
        </div>
      </ThemeOptionGroup>
    </div>
  );

  return (
    <div className={`theme-customizer ${className}`}>
      <Button
        type="button"
        variant={compact ? "outline" : "ghost"}
        size={compact ? "md" : "icon"}
        className={compact ? "theme-customizer-trigger-wide" : "theme-customizer-trigger"}
        aria-label="Customize theme"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {compact ? (
          <>
            <Settings2 />
            Theme
          </>
        ) : (
          <Settings2 />
        )}
      </Button>

      {open && !compact && panel}
      {open && compact && createPortal(
        <div
          className="theme-customizer-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          {panel}
        </div>,
        document.body,
      )}
    </div>
  );
}

function ThemeOptionGroup({ title, children }) {
  return (
    <div className="theme-option-group">
      <div className="theme-option-title">{title}</div>
      {children}
    </div>
  );
}

export { ThemeCustomizer };
