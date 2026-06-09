import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function CountingNumber({
  from = 0,
  to = 100,
  duration = 1200,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
  format,
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return undefined;
    }

    const startAnimation = () => {
      const start = performance.now();

      function frame(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(from + (to - from) * eased);

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      }

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [decimals, duration, from, to]);

  const value = format ? format(display) : `${prefix}${display.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
    </span>
  );
}

export { CountingNumber };
