"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { springGentle, springSmooth } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

// ── 404 Quote Pool — emptiness, the path, returning ──────────────────────────

const QUOTES_404 = [
  { text: "Return is the movement of the Tao. Yielding is the way of the Tao.", source: "Tao Te Ching · Ch. 40" },
  { text: "It is the empty space that makes the vessel useful.", source: "Tao Te Ching · Ch. 11" },
  { text: "The Tao that can be named is not the eternal Tao.", source: "Tao Te Ching · Ch. 1" },
  { text: "A good traveler has no fixed plans and is not intent upon arriving.", source: "Tao Te Ching · Ch. 27" },
  { text: "Those who know do not speak. Those who speak do not know.", source: "Tao Te Ching · Ch. 56" },
  { text: "In pursuit of Tao, every day something is dropped.", source: "Tao Te Ching · Ch. 48" },
  { text: "When you realize there is nothing lacking, the whole world belongs to you.", source: "Tao Te Ching · Ch. 44" },
  { text: "He who knows when to stop does not find himself in trouble.", source: "Tao Te Ching · Ch. 44" },
  { text: "The journey of a thousand miles begins beneath your feet.", source: "Tao Te Ching · Ch. 64" },
  { text: "Act without expectation.", source: "Tao Te Ching · Ch. 81" },
  { text: "Knowing others is wisdom. Knowing yourself is enlightenment.", source: "Tao Te Ching · Ch. 33" },
  { text: "Silence is a source of great strength.", source: "Laozi" },
  { text: "When nothing is done, nothing is left undone.", source: "Tao Te Ching · Ch. 48" },
  { text: "To realize that you do not understand is a virtue.", source: "Tao Te Ching · Ch. 71" },
  { text: "To the mind that is still, the whole universe surrenders.", source: "Zhuangzi" },
  { text: "Flow with whatever may happen and let your mind be free.", source: "Zhuangzi" },
  { text: "The soft overcomes the hard, the gentle overcomes the rigid.", source: "Tao Te Ching · Ch. 78" },
  { text: "Stop thinking, and end your problems.", source: "Tao Te Ching · Ch. 20" },
  { text: "Life is a series of natural changes. Don't resist them.", source: "Laozi" },
  { text: "The usefulness of a cup is in its emptiness.", source: "Tao Te Ching · Ch. 11" },
  { text: "I have just three things to teach: simplicity, patience, compassion.", source: "Tao Te Ching · Ch. 67" },
  { text: "Going back to the origin is called peace.", source: "Tao Te Ching · Ch. 16" },
  { text: "Thirty spokes meet at the hub; it is the center hole that makes it useful.", source: "Tao Te Ching · Ch. 11" },
  { text: "What the caterpillar calls the end of the world, the master calls a butterfly.", source: "Zhuangzi" },
] as const;

// ── Error Quote Pool — patience, mud settling, restoration ───────────────────

const QUOTES_ERROR = [
  { text: "Muddy water, let stand, becomes clear.", source: "Zhuangzi" },
  { text: "Who can wait quietly while the mud settles? Who can remain still until the moment of action?", source: "Tao Te Ching · Ch. 15" },
  { text: "Good fortune follows upon disaster; disaster lurks within good fortune.", source: "Tao Te Ching · Ch. 58" },
  { text: "Nature does not hurry, yet everything is accomplished.", source: "Laozi" },
  { text: "From caring comes courage.", source: "Tao Te Ching · Ch. 67" },
  { text: "A tree that is unbending is easily broken.", source: "Tao Te Ching · Ch. 76" },
  { text: "Water is fluid, soft, and yielding. But water will wear away rock.", source: "Laozi" },
  { text: "The flame that burns twice as bright burns half as long.", source: "Laozi" },
  { text: "Returning to the source is called stillness.", source: "Tao Te Ching · Ch. 16" },
  { text: "He who conquers himself is mighty.", source: "Tao Te Ching · Ch. 33" },
  { text: "Respond to anger with virtue.", source: "Tao Te Ching · Ch. 63" },
  { text: "The Tao does not force, and yet nothing is left undone.", source: "Tao Te Ching · Ch. 37" },
  { text: "When you are content to be simply yourself and don't compare, everybody will respect you.", source: "Tao Te Ching · Ch. 8" },
  { text: "The wise do not contend, and therefore no one can contend with them.", source: "Tao Te Ching · Ch. 22" },
  { text: "If you correct your mind, the rest of your life will fall into place.", source: "Laozi" },
  { text: "To remain whole, be twisted. To become straight, let yourself be bent.", source: "Tao Te Ching · Ch. 22" },
  { text: "He who knows that enough is enough will always have enough.", source: "Tao Te Ching · Ch. 46" },
  { text: "By letting go it all gets done.", source: "Tao Te Ching · Ch. 48" },
  { text: "Embrace the nature of things and you will not be broken.", source: "Laozi" },
  { text: "All things arise from Tao. They are nourished by Virtue.", source: "Tao Te Ching · Ch. 51" },
  { text: "Give evil nothing to oppose and it will disappear by itself.", source: "Tao Te Ching · Ch. 60" },
] as const;

type QuoteEntry = { text: string; source: string };

interface ZenConsultationProps {
  type: "404" | "error";
  errorMessage?: string;
  onReset?: () => void;
  hideNumber?: boolean;
}

export function ZenConsultation({ type, errorMessage, onReset, hideNumber }: ZenConsultationProps) {
  const prefersReducedMotion = useReducedMotion();
  const pool: readonly QuoteEntry[] = type === "404" ? QUOTES_404 : QUOTES_ERROR;

  const [quote, setQuote] = useState<QuoteEntry | null>(null);
  const [consultationNo, setConsultationNo] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setQuote(pool[Math.floor(Math.random() * pool.length)]);
    setConsultationNo(Math.floor(Math.random() * 99) + 1);
  }, [pool]);

  const shuffle = () => {
    setQuote((prev) => {
      const candidates = pool.filter((q) => q !== prev);
      return candidates[Math.floor(Math.random() * candidates.length)];
    });
    setConsultationNo(Math.floor(Math.random() * 99) + 1);
    setAnimKey((k) => k + 1);
  };

  if (!quote || consultationNo === null) return null;

  return (
    <div className="text-center max-w-lg mx-auto w-full px-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={animKey}
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springGentle}
        >
          {/* Consultation number — optional */}
          {!hideNumber && (
            <motion.p
              className="text-swiss-subheading tracking-widest text-foreground/40 mb-6"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springGentle, delay: 0.05 }}
            >
              CONSULTATION №{String(consultationNo).padStart(2, "0")}
            </motion.p>
          )}

          {/* Top rule */}
          <motion.div
            className="w-8 h-px bg-foreground/20 mx-auto mb-10"
            initial={prefersReducedMotion ? {} : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springSmooth, delay: 0.15 }}
          />

          {/* Quote */}
          <motion.blockquote
            className="italic text-foreground/80 mb-5"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(1.25rem, 2.8vw, 1.625rem)",
              lineHeight: 1.5,
            }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 0.2 }}
          >
            &ldquo;{quote.text}&rdquo;
          </motion.blockquote>

          {/* Source */}
          <motion.p
            className="text-swiss-meta tracking-widest text-foreground/35 mb-10"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springGentle, delay: 0.35 }}
          >
            — {quote.source}
          </motion.p>

          {/* Bottom rule */}
          <motion.div
            className="w-8 h-px bg-foreground/20 mx-auto mb-8"
            initial={prefersReducedMotion ? {} : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springSmooth, delay: 0.4 }}
          />

          {/* Practical message */}
          <motion.p
            className="text-swiss-body text-foreground/40 mb-8"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springGentle, delay: 0.45 }}
          >
            {type === "404"
              ? "This page does not exist."
              : "Something went wrong on our end."}
          </motion.p>

          {/* Error details */}
          {type === "error" && errorMessage && (
            <motion.pre
              className="text-swiss-code text-foreground/40 bg-foreground/5 rounded-[4px] px-4 py-3 mb-8 overflow-auto text-left max-h-24 border border-foreground/[0.08]"
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...springGentle, delay: 0.5 }}
            >
              {errorMessage}
            </motion.pre>
          )}

          {/* Actions */}
          <motion.div
            className="flex items-center justify-center gap-6 flex-wrap"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 0.55 }}
          >
            <Link
              href="/"
              className={cn(
                "text-swiss-body text-foreground/60 hover:text-foreground",
                "transition-colors duration-150 underline underline-offset-4",
                "decoration-foreground/20 hover:decoration-foreground/60"
              )}
            >
              Return home
            </Link>

            {type === "error" && onReset && (
              <button
                type="button"
                onClick={onReset}
                className={cn(
                  "text-swiss-body text-foreground/60 hover:text-foreground",
                  "transition-colors duration-150 underline underline-offset-4",
                  "decoration-foreground/20 hover:decoration-foreground/60"
                )}
              >
                Try again
              </button>
            )}

            {!hideNumber && (
              <button
                type="button"
                onClick={shuffle}
                className={cn(
                  "text-swiss-meta text-foreground/30 hover:text-foreground/50",
                  "transition-colors duration-150 tracking-widest",
                  "flex items-center gap-1.5"
                )}
                aria-label="Draw a new consultation"
              >
                <span className="text-base leading-none" aria-hidden="true">↺</span>
                <span>NEW CONSULTATION</span>
              </button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
