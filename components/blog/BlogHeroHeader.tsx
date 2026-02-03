"use client";

import { MeshGradient, PaperTexture } from "@paper-design/shaders-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlogHeroHeaderProps {
  date?: string;
  categories?: string[];
  title: string;
  description?: string;
  className?: string;
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

  // Only render shaders after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
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
          {/* Light mode gradient */}
          <div className="dark:hidden absolute inset-0">
            <MeshGradient
              colors={["#e0f2fe", "#ddd6fe", "#fce7f3", "#fed7aa"]}
              speed={prefersReducedMotion ? 0 : 0.12}
              distortion={0.5}
              swirl={0.25}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          {/* Dark mode gradient - #0d0d0d base with vibrant colorful accents */}
          <div className="hidden dark:block absolute inset-0">
            <MeshGradient
              colors={["#0d0d0d", "#1e3a5f", "#0d2d2d", "#2d1b4e"]}
              speed={prefersReducedMotion ? 0 : 0.15}
              distortion={0.4}
              swirl={0.3}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
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
              colorFront="#666666"
              colorBack="#ffffff"
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
              colorFront="#ffffff"
              colorBack="#0d0d0d"
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
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {date && (
              <span className="text-[15px] text-foreground/60">
                {date}
              </span>
            )}
            {categories && categories.length > 0 && (
              <>
                {categories.map((category) => (
                  <span
                    key={category}
                    className="text-[15px] text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              className="text-[15px] text-foreground/60 max-w-2xl mx-auto leading-relaxed"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </header>
  );
}
