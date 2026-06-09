import { ArrowRight, LogOut, Menu, Phone, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/routes/routeConfig";
import { brand, navItems } from "@/data/siteData";
import { BrandWordmark } from "./BrandWordmark";
import { ThemeCustomizer } from "./ThemeCustomizer";
import "./SiteHeader.css";

function SiteHeader({
  menuOpen,
  setMenuOpen,
  onNavigate,
  currentUser,
  onLogout,
  currentPath = "/",
  currentHash = "",
  themePreferences,
  resolvedThemeMode,
  onThemeChange,
}) {
  const visibleNavItems = currentUser
    ? navItems.filter((item) => !item.roles?.length || item.roles.includes(currentUser.role))
    : [];
  const homeHref = currentUser ? APP_ROUTES.HOME : APP_ROUTES.LOGIN;

  function handleRouteClick(event, href) {
    event.preventDefault();
    onNavigate(href);
  }

  function isActiveLink(href) {
    if (typeof window === "undefined") {
      return false;
    }

    const linkUrl = new URL(href, window.location.origin);

    if (linkUrl.pathname !== currentPath) {
      return false;
    }

    if (linkUrl.hash) {
      return linkUrl.hash === currentHash;
    }

    return !currentHash;
  }

  return (
    <header className="site-header">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a
          href={homeHref}
          className="flex items-center gap-3"
          aria-label={`${brand.name} home`}
          onClick={(event) => handleRouteClick(event, homeHref)}
        >
          <BrandWordmark />
        </a>

        <nav className="site-header-nav hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {visibleNavItems.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={active ? "site-header-link is-active" : "site-header-link"}
                aria-current={active ? "page" : undefined}
                onClick={(event) => handleRouteClick(event, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeCustomizer
            preferences={themePreferences}
            resolvedMode={resolvedThemeMode}
            onChange={onThemeChange}
          />
          {currentUser ? (
            <>
              <span className="site-role-pill">
                <UserRound className="size-3.5" />
                {currentUser.role}
              </span>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <a href={brand.phoneHref}>
                  <Phone />
                  Call
                </a>
              </Button>
              <Button variant="outline" className="site-logout-button" onClick={onLogout}>
                Logout
                <LogOut />
              </Button>
            </>
          ) : (
            <Button asChild>
              <a href={APP_ROUTES.LOGIN} onClick={(event) => handleRouteClick(event, APP_ROUTES.LOGIN)}>
                Login
                <ArrowRight />
              </a>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {menuOpen && (
        <div className="site-mobile-menu lg:hidden">
          <nav id="mobile-navigation" className="site-mobile-nav container grid gap-1 py-4" aria-label="Mobile navigation">
            {visibleNavItems.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={active ? "site-mobile-link is-active" : "site-mobile-link"}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => handleRouteClick(event, item.href)}
                >
                  {item.label}
                </a>
              );
            })}
            {currentUser ? (
              <>
                <ThemeCustomizer
                  compact
                  preferences={themePreferences}
                  resolvedMode={resolvedThemeMode}
                  onChange={onThemeChange}
                />
                <div className="site-mobile-user">
                  <UserRound className="size-4" />
                  <span>{currentUser.name}</span>
                  <strong>{currentUser.role}</strong>
                </div>
                <Button variant="outline" className="site-mobile-logout" onClick={onLogout}>
                  Logout
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button asChild className="mt-2">
                <a href={APP_ROUTES.LOGIN} onClick={(event) => handleRouteClick(event, APP_ROUTES.LOGIN)}>
                  Login
                  <ArrowRight />
                </a>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export { SiteHeader };
