import { brand } from "@/data/siteData";
import "./BrandWordmark.css";

function BrandWordmark({ className = "", tone = "light" }) {
  return (
    <span className={`brand-wordmark brand-wordmark-${tone} ${className}`}>
      <span className="brand-wordmark-text" aria-label={brand.name}>
        <span className="brand-wordmark-silver">Silver</span>
        <span className="brand-wordmark-gym">Gym</span>
      </span>
    </span>
  );
}

export { BrandWordmark };
