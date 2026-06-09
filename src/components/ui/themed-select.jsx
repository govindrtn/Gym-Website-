import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import "./themed-select.css";

function ThemedSelect({
  id,
  label,
  value,
  options,
  onChange,
  getDescription = (option) => option.description ?? option.detail ?? option.tag,
  className,
  labelClassName,
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const [mounted, setMounted] = useState(false);
  const selectedOption = options.find((option) => String(option.value) === String(value)) ?? options[0];
  const labelId = `${id}-label`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    function updateMenuPosition() {
      const triggerRect = triggerRef.current?.getBoundingClientRect();

      if (!triggerRect) {
        return;
      }

      const gap = 8;
      const menuMaxHeight = Math.min(288, window.innerHeight - 32);
      const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
      const placeAbove = spaceBelow < 220 && triggerRect.top > spaceBelow;
      const top = placeAbove
        ? Math.max(16, triggerRect.top - menuMaxHeight - gap)
        : triggerRect.bottom + gap;

      setMenuStyle({
        left: `${triggerRect.left}px`,
        top: `${top}px`,
        width: `${triggerRect.width}px`,
        maxHeight: `${placeAbove ? Math.min(menuMaxHeight, triggerRect.top - 24) : Math.min(menuMaxHeight, spaceBelow - 8)}px`,
      });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleDocumentPointerDown(event) {
      if (
        triggerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      setOpen(false);
    }

    function handleDocumentKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [open]);

  function handleSelect(nextValue) {
    onChange(String(nextValue));
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={cn("ui-themed-select", className)}>
      {label && (
        <label id={labelId} className={cn("ui-themed-select-label", labelClassName)}>
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={open ? "ui-themed-select-trigger is-open" : "ui-themed-select-trigger"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ui-themed-select-copy">
          <span className="ui-themed-select-title">{selectedOption?.label}</span>
          {getDescription(selectedOption) && (
            <span className="ui-themed-select-detail">{getDescription(selectedOption)}</span>
          )}
        </span>
        <ChevronDown className="ui-themed-select-chevron size-4" />
      </button>

      {open && mounted && createPortal(
        <div
          ref={menuRef}
          className="ui-themed-select-menu"
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          style={menuStyle}
        >
          {options.map((option) => {
            const selected = String(option.value) === String(value);

            return (
              <button
                key={`${option.label}-${option.value}`}
                type="button"
                role="option"
                aria-selected={selected}
                className={selected ? "ui-themed-select-option is-selected" : "ui-themed-select-option"}
                onClick={() => handleSelect(option.value)}
              >
                <span>
                  <span className="ui-themed-select-title">{option.label}</span>
                  {getDescription(option) && (
                    <span className="ui-themed-select-detail">{getDescription(option)}</span>
                  )}
                </span>
                {selected && <Check className="size-4" />}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

export { ThemedSelect };
