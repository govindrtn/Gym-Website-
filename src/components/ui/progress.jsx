import { cn } from "@/lib/utils";
import "./progress.css";

function Progress({ className, indicatorClassName, value = 0, ...props }) {
  return (
    <div
      className={cn("ui-progress", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      {...props}
    >
      <span
        className={cn("ui-progress-indicator", indicatorClassName)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function ProgressCircle({
  className,
  trackClassName,
  indicatorClassName,
  value = 0,
  size = 64,
  strokeWidth = 5,
  children,
  ...props
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedValue = Math.max(0, Math.min(100, value));
  const offset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div
      className={cn("ui-progress-circle", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={cn("ui-progress-circle-track", trackClassName)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn("ui-progress-circle-indicator", indicatorClassName)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children && <span className="ui-progress-circle-content">{children}</span>}
    </div>
  );
}

export { Progress, ProgressCircle };
