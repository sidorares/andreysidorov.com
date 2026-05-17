import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function SiteLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        key={loc.pathname}
        className="flex-1 animate-fade-in motion-reduce:animate-none"
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
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-serif text-lg tracking-tight">
          notes<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
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
        `transition-colors hover:text-foreground ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span>© {new Date().getFullYear()} — built with care</span>
        <div className="flex gap-4">
          <a href="/rss.xml" className="hover:text-foreground">RSS</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
