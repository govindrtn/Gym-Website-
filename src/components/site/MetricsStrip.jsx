import { CountingNumber } from "@/components/ui/counting-number";
import { metrics } from "@/data/siteData";
import "./MetricsStrip.css";

function MetricsStrip() {
  return (
    <section className="metrics-strip">
      <div className="container grid grid-cols-2 gap-px py-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-cell px-3 py-5 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {metric.display ?? (
                <CountingNumber
                  to={metric.value}
                  decimals={metric.decimals ?? 0}
                  duration={1250}
                />
              )}
            </div>
            <div className="mt-1 text-xs font-medium uppercase text-muted-foreground">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { MetricsStrip };
