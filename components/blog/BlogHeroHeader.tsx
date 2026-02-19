"use client";

import { MeshGradient, PaperTexture } from "@paper-design/shaders-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { springSmooth, springGentle } from "@/lib/motion-variants";

interface BlogHeroHeaderProps {
  date?: string;
  categories?: string[];
  title: string;
  description?: string;
  className?: string;
}

interface BlogHeroVisualTokens {
  mesh: [string, string, string, string];
  paperFront: string;
  paperBack: string;
}

const FALLBACK_HERO_TOKENS: BlogHeroVisualTokens = {
  mesh: [
    "rgb(224 242 254)",
    "rgb(221 214 254)",
    "rgb(252 231 243)",
    "rgb(254 215 170)",
  ],
  paperFront: "rgb(102 102 102)",
  paperBack: "rgb(255 255 255)",
};

function readColorToken(
  styles: CSSStyleDeclaration,
  token: string,
  fallback: string
): string {
  return styles.getPropertyValue(token).trim() || fallback;
}

export function BlogHeroHeader({
  date,
  categories,
  title,
  description,
  className,
}: BlogHeroHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [heroTokens, setHeroTokens] =
    useState<BlogHeroVisualTokens>(FALLBACK_HERO_TOKENS);

  // Only render shaders after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;

    const syncHeroTokens = () => {
      const styles = getComputedStyle(root);
      setHeroTokens({
        mesh: [
          readColorToken(styles, "--blog-hero-mesh-1", FALLBACK_HERO_TOKENS.mesh[0]),
          readColorToken(styles, "--blog-hero-mesh-2", FALLBACK_HERO_TOKENS.mesh[1]),
          readColorToken(styles, "--blog-hero-mesh-3", FALLBACK_HERO_TOKENS.mesh[2]),
          readColorToken(styles, "--blog-hero-mesh-4", FALLBACK_HERO_TOKENS.mesh[3]),
        ],
        paperFront: readColorToken(
          styles,
          "--blog-hero-paper-front",
          FALLBACK_HERO_TOKENS.paperFront
        ),
        paperBack: readColorToken(
          styles,
          "--blog-hero-paper-back",
          FALLBACK_HERO_TOKENS.paperBack
        ),
      });
    };

    syncHeroTokens();

    const observer = new MutationObserver(syncHeroTokens);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "relative overflow-hidden -mx-4 md:-mx-8 lg:-mx-12 -mt-8 lg:-mt-6 mb-8",
        className
      )}
    >
      {/* Mesh Gradient Background - only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          <MeshGradient
            colors={heroTokens.mesh}
            speed={prefersReducedMotion ? 0 : 0.13}
            distortion={0.45}
            swirl={0.28}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}

      {/* Minimal vignette fade - subtle and elegant */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 90% 80% at 50% 45%,
            transparent 0%,
            transparent 50%,
            rgba(var(--background-rgb), 0.4) 75%,
            var(--background) 100%
          )`,
        }}
      />

      {/* Left edge fade - subtle blend */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none"
        style={{
          background: `linear-gradient(to right, var(--background) 0%, transparent 100%)`,
        }}
      />

      {/* Right edge fade - subtle blend */}
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none"
        style={{
          background: `linear-gradient(to left, var(--background) 0%, transparent 100%)`,
        }}
      />

      {/* Bottom edge fade - smooth transition to content */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--background) 0%, transparent 100%)`,
        }}
      />

      {/* Paper texture overlay - only render after mount */}
      {mounted && (
        <>
          <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay dark:hidden">
            <PaperTexture
              colorFront={heroTokens.paperFront}
              colorBack={heroTokens.paperBack}
              scale={1.5}
              contrast={0.2}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-soft-light hidden dark:block">
            <PaperTexture
              colorFront={heroTokens.paperFront}
              colorBack={heroTokens.paperBack}
              scale={1.5}
              contrast={0.15}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-12 pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Meta info - date and categories */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 0.1 }}
          >
            {date && (
              <span className="text-swiss-caption text-foreground/60">
                {date}
              </span>
            )}
            {categories && categories.length > 0 && (
              <>
                {categories.map((category) => (
                  <span
                    key={category}
                    className="text-swiss-caption text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {category}
                  </span>
                ))}
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-[1.1] mb-6"
            style={{
              textWrap: "balance",
            }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              className="text-swiss-body text-foreground/60 max-w-2xl mx-auto leading-relaxed"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSmooth, delay: 0.35 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </header>
  );
}
