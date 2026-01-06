"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { features } from "@/lib/features";

const links = [
  { text: "Home", url: "/" },
  { text: "Blog", url: "/blog" },
];

interface NavbarProps {
  showSidebarTrigger?: boolean;
  containerClassName?: string;
  fullBleed?: boolean;
}

export default function Navbar({
  showSidebarTrigger = false,
  containerClassName,
  fullBleed = false,
}: NavbarProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const navRef = React.useRef<HTMLUListElement>(null);
  const [pillStyles, setPillStyles] = React.useState({ left: 0, width: 0 });
  const [isReady, setIsReady] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const { scrollY } = useScroll();

  // Track scroll direction to show/hide navbar
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollThreshold = 50;

    // Always show at top of page
    if (latest < scrollThreshold) {
      setIsVisible(true);
      setLastScrollY(latest);
      return;
    }

    // Scrolling down - hide navbar
    if (latest > lastScrollY && latest > scrollThreshold) {
      setIsVisible(false);
    }
    // Scrolling up - show navbar
    else if (latest < lastScrollY) {
      setIsVisible(true);
    }

    setLastScrollY(latest);
  });

  // Update pill position when pathname changes
  React.useEffect(() => {
    if (!navRef.current) return;

    const activeLink = navRef.current.querySelector(
      `[data-active="true"]`
    ) as HTMLElement;

    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      setPillStyles({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
      setIsReady(true);
    }
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 bg-background/90 backdrop-blur-sm border-b border-border",
        fullBleed &&
          "md:w-[calc(100%+var(--sidebar-width))] md:-ml-[var(--sidebar-width)] md:pl-[var(--sidebar-width)]"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-4 lg:px-6",
          containerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {showSidebarTrigger && <SidebarTrigger className="-ml-2" />}

          {/* Nav links with animated indicator - brutalist style */}
          <ul
            ref={navRef}
            className="relative flex items-center gap-0 bg-muted p-0.5 border border-border"
          >
            {/* Animated indicator - sharp rectangle */}
            {isReady && (
              <motion.li
                layoutId="nav-pill"
                className="absolute inset-y-0.5 bg-background border border-foreground/20"
                animate={pillStyles}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
                style={{
                  left: pillStyles.left,
                  width: pillStyles.width,
                }}
              />
            )}

            {links.map((link) => {
              const isActive = pathname === link.url;
              return (
                <li key={link.url} className="relative z-10">
                  <Link
                    href={link.url}
                    data-active={isActive}
                    className={cn(
                      "relative block px-4 py-1.5 text-xs font-medium cursor-pointer uppercase tracking-wider",
                      "transition-colors duration-150",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          {/* Auth buttons - behind feature flag */}
          {features.auth && !isLoading && (
            <>{isAuthenticated ? <UserMenu /> : <SignInButton />}</>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
