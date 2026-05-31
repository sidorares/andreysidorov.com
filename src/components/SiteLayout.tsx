import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export function SiteLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        key={loc.pathname}
        className="flex-1" // animate-fade-in motion-reduce:animate-none" TODO: I want some page transition animation, but fade-in feels like slow page loafing
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border">
      <div className="site-container flex h-14 items-center justify-between">
        <Link
          to="/"
          aria-label={siteConfig.name}
          className="flex items-center gap-2 font-mono-native text-sm tracking-tight"
        >
          <img
            src="/favicon.svg"
            alt=""
            width={20}
            height={20}
            decoding="async"
            fetchPriority="low"
            className="size-5 dark:hidden"
          />
          <img
            src="/favicon-dark.svg"
            alt=""
            width={20}
            height={20}
            decoding="async"
            fetchPriority="low"
            className="size-5 hidden dark:block"
          />
          <span className="hidden md:inline">andreysidorov.com</span>
     
        </Link>
        <nav className="flex items-center gap-6 font-mono-native text-xs uppercase tracking-widest">
          <NavItem to="/blog">Blog</NavItem>
          <NavItem to="/projects">Projects</NavItem>
          <NavItem to="/about">About</NavItem>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "border-2 p-0.5 transition-colors",
          isActive
            ? "border-transparent border-b-brand text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="site-container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span>© {new Date().getFullYear()} — built with care</span>
        <div className="flex gap-4">
          <a href="/rss.xml" className="hover:text-foreground">RSS</a>
          <a href="https://github.com/sidorares/andreysidorov.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
