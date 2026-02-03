"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SiteShellWithSidebarProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  toc?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SiteShellWithSidebar({
  children,
  sidebar,
  toc,
  className,
  contentClassName,
}: SiteShellWithSidebarProps): JSX.Element {
  const hasToc = Boolean(toc);

  return (
    <SidebarProvider defaultOpen={false}>
      {sidebar}
      <SidebarInset className={cn("min-h-svh flex flex-col bg-transparent", className)}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <Header />

        <main
          id="main-content"
          className={cn("flex-1 pb-24 md:pb-28", contentClassName)}
        >
          {hasToc ? (
            <div className="mx-auto w-full px-4 lg:px-6 max-w-none">
              <div
                className={cn(
                  "grid",
                  "gap-8 lg:gap-[var(--content-gap)]",
                  "lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]"
                )}
              >
                <div className="min-w-0">{children}</div>
                <aside className="hidden lg:block">{toc}</aside>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full px-4 lg:px-6 max-w-none">
              {children}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SiteShellWithSidebar;
