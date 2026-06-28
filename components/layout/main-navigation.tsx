"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ChevronDown, LogOut, Bell } from "lucide-react";
import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { SessionUser } from "@/types/auth";
import type { NavigationSection } from "@/lib/navigation";
import { isNavigationItemActive } from "@/lib/navigation";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signOutAction } from "@/features/authentication/actions";

type MainNavigationProps = {
  user: SessionUser;
  sections: NavigationSection[];
  children: ReactNode;
};

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      href={href}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      className="relative hidden max-w-sm flex-1 md:block"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Search"
        className="pl-9"
        placeholder="Search artists, users, activities"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}

export function MainNavigation({ user, sections, children }: MainNavigationProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeRole = user.primaryRole ?? "artist";
  const userDisplay = user.displayName || `${user.firstName} ${user.lastName}`.trim();
  const initials = useMemo(
    () =>
      userDisplay
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
    [userDisplay],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:shadow"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card/70 lg:flex lg:flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-border px-5">
            <Brand />
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {sections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.label}
                </p>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      active={isNavigationItemActive(pathname, item.href, item.exact)}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                    />
                  ))}
                </nav>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-md bg-muted/60 p-3">
              <Avatar name={userDisplay} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{userDisplay}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {activeRole}
              </Badge>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-background/80 lg:hidden"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card shadow-2xl transition-transform duration-200 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Brand />
            <Button
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>
          <div className="space-y-6 overflow-y-auto px-3 py-4">
            {sections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.label}
                </p>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      active={isNavigationItemActive(pathname, item.href, item.exact)}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                    />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <Button
                aria-label="Open navigation"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                size="icon"
                type="button"
                variant="outline"
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="lg:hidden">
                <Brand compact />
              </div>

              <SearchBar />

              <div className="ml-auto flex items-center gap-2">
                <Button asChild size="icon" type="button" variant="ghost">
                  <Link href="/notifications" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>
                <ThemeToggle compact />
                <details className="relative">
                  <summary className="flex list-none cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-sm font-medium shadow-sm">
                    <Avatar name={userDisplay} className="h-8 w-8" />
                    <span className="hidden max-w-28 truncate md:block">{initials}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </summary>
                  <div className="absolute right-0 z-30 mt-2 w-64 rounded-md border border-border bg-card p-2 shadow-lg">
                    <div className="space-y-1 p-2">
                      <p className="truncate text-sm font-medium">{userDisplay}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {activeRole}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid gap-1">
                      <Link
                        className="rounded-md px-3 py-2 text-sm transition hover:bg-muted"
                        href="/profile"
                      >
                        Profile
                      </Link>
                      <Link
                        className="rounded-md px-3 py-2 text-sm transition hover:bg-muted"
                        href="/settings"
                      >
                        Settings
                      </Link>
                      <form action={signOutAction}>
                        <Button className="w-full justify-start px-3" size="sm" variant="ghost">
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </Button>
                      </form>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </header>
          <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
