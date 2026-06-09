import { cn } from "@/lib/utils";
import "./tech-background.css";

function TechGridBackground({ className, children, beams = 8, ...props }) {
  return (
    <div className={cn("tech-grid-background", className)} {...props}>
      <div className="tech-grid-lines" aria-hidden="true" />
      <div className="tech-grid-scan" aria-hidden="true" />
      {Array.from({ length: beams }).map((_, index) => (
        <span
          key={index}
          className={index % 2 === 0 ? "tech-beam tech-beam-horizontal" : "tech-beam tech-beam-vertical"}
          style={{
            "--beam-index": index,
            "--beam-offset": `${12 + index * 10}%`,
            "--beam-delay": `${index * 0.7}s`,
          }}
          aria-hidden="true"
        />
      ))}
      {children && <div className="tech-grid-content">{children}</div>}
    </div>
  );
}

export { TechGridBackground };
