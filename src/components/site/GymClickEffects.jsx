import { useEffect, useRef, useState } from "react";
import "./GymClickEffects.css";

const CLICK_TARGET_SELECTOR = "button:not(:disabled), a.inline-flex, .home-action-tile";
const RIPPLE_LIFETIME = 900;

function GymClickEffects() {
  const rippleIdRef = useRef(0);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    function handlePointerDown(event) {
      const clickTarget = event.target.closest(CLICK_TARGET_SELECTOR);

      if (!clickTarget || clickTarget.getAttribute("aria-disabled") === "true") {
        return;
      }

      const targetRect = clickTarget.getBoundingClientRect();
      const ripple = {
        id: `water-ripple-${++rippleIdRef.current}`,
        x: event.clientX,
        y: event.clientY,
        size: Math.max(targetRect.width, targetRect.height, 56),
      };

      setRipples((currentRipples) => [...currentRipples, ripple]);

      window.setTimeout(() => {
        setRipples((currentRipples) =>
          currentRipples.filter((currentRipple) => currentRipple.id !== ripple.id),
        );
      }, RIPPLE_LIFETIME);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="gym-click-effects" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="water-click-ripple"
          style={{
            "--water-x": `${ripple.x}px`,
            "--water-y": `${ripple.y}px`,
            "--water-size": `${ripple.size}px`,
          }}
        >
          <span />
        </span>
      ))}
    </div>
  );
}

export { GymClickEffects };
