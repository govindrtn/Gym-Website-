import { brand } from "@/data/siteData";
import { BrandWordmark } from "./BrandWordmark";
import "./SiteFooter.css";

function SiteFooter({ onNavigate }) {
  function handleRouteClick(event) {
    event.preventDefault();
    onNavigate("/");
  }

  return (
    <footer className="site-footer">
      <div className="container flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" className="flex items-center gap-3" onClick={handleRouteClick}>
          <BrandWordmark tone="dark" />
        </a>
        <div className="text-sm text-muted-foreground">
          Strength, conditioning, recovery, and coaching in one modern club.
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
