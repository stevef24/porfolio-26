"use client";

/**
 * CanvasCodeStage - Code display with Shiki Magic Move animations
 *
 * Features:
 * - Animated token transitions between code steps
 * - Dual-theme support (CSS-based instant switching)
 * - Multi-file tab support with persistence
 * - Copy to clipboard
 * - Fullscreen mode
 * - Focus line highlighting
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ShikiMagicMoveRenderer } from "shiki-magic-move/react";
import { syncTokenKeys, toKeyedTokens } from "shiki-magic-move/core";
import { cn } from "@/lib/utils";
import { springGentle, springSnappy } from "@/lib/motion-variants";
import {
  MAGIC_MOVE_DEFAULTS,
  dedupeTokenKeys,
  type AnyCodeStep,
  type CodeStep,
  type CompiledCodeStep,
  type CodeFile,
  type GlobalFile,
  type KeyedTokensInfo,
} from "@/types/code-steps";

interface CanvasCodeStageProps {
  steps: AnyCodeStep[];
  activeIndex: number;
  className?: string;
  fullscreenEnabled?: boolean;
  showStepIndicator?: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

const EMPTY_TOKENS = toKeyedTokens("", []);

function isCompiled(step: AnyCodeStep): step is CompiledCodeStep {
  if ("files" in step && Array.isArray(step.files) && step.files.length > 0) {
    return "tokens" in step.files[0];
  }
  return "tokens" in step && step.tokens !== undefined;
}

function isMultiFile(step: AnyCodeStep): boolean {
  return "files" in step && Array.isArray(step.files) && step.files.length > 0;
}

function getCodeForCopy(step: AnyCodeStep, fileIndex: number = 0): string {
  if (isMultiFile(step)) {
    const files = step.files!;
    const file = files[fileIndex];
    if ("rawCode" in file) {
      return file.rawCode;
    }
    return (file as CodeFile).code || "";
  }
  if (isCompiled(step) && step.rawCode) {
    return step.rawCode;
  }
  return (step as CodeStep).code || "";
}

function getTokens(step: AnyCodeStep, fileIndex: number = 0): KeyedTokensInfo | null {
  if (isMultiFile(step) && step.files) {
    const file = step.files[fileIndex];
    if ("tokens" in file) {
      return file.tokens;
    }
    return null;
  }
  if (isCompiled(step) && step.tokens) {
    return step.tokens;
  }
  return null;
}

// ============================================================================
// Icons
// ============================================================================

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 opacity-60">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ============================================================================
// Magic Move Renderer
// ============================================================================

interface MagicMoveRendererProps {
  steps: AnyCodeStep[];
  activeIndex: number;
  fileIndex: number;
  animate: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

const CanvasMagicMove = memo(function CanvasMagicMove({
  steps,
  activeIndex,
  fileIndex,
  animate,
  onStart,
  onEnd,
}: MagicMoveRendererProps) {
  const [previousTokens, setPreviousTokens] =
    useState<KeyedTokensInfo>(EMPTY_TOKENS);

  const currentTokens = useMemo(() => {
    const currentStep = steps[Math.min(activeIndex, steps.length - 1)];
    return getTokens(currentStep, fileIndex) || EMPTY_TOKENS;
  }, [steps, activeIndex, fileIndex]);

  useEffect(() => {
    setPreviousTokens(currentTokens);
  }, [currentTokens]);

  const result = useMemo(() => {
    const synced = syncTokenKeys(previousTokens, currentTokens);
    return {
      from: dedupeTokenKeys(synced.from),
      to: dedupeTokenKeys(synced.to),
    };
  }, [previousTokens, currentTokens]);

  return (
    <ShikiMagicMoveRenderer
      tokens={result.to}
      previous={result.from}
      options={{
        duration: MAGIC_MOVE_DEFAULTS.duration,
        stagger: MAGIC_MOVE_DEFAULTS.stagger,
      }}
      animate={animate}
      onStart={onStart}
      onEnd={onEnd}
    />
  );
});

// ============================================================================
// Main Component
// ============================================================================

export function CanvasCodeStage({
  steps,
  activeIndex,
  className,
  fullscreenEnabled = true,
  showStepIndicator = true,
}: CanvasCodeStageProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStep = steps[activeIndex] ?? steps[0];
  const multiFile = currentStep ? isMultiFile(currentStep) : false;

  // Global files for cross-step persistence
  const globalFiles = useMemo((): GlobalFile[] => {
    const fileMap = new Map<string, number[]>();
    steps.forEach((step, stepIdx) => {
      const files = step.files?.map(f => f.name) || (step.file ? [step.file] : []);
      files.forEach(name => {
        const existing = fileMap.get(name) || [];
        existing.push(stepIdx);
        fileMap.set(name, existing);
      });
    });
    return Array.from(fileMap.entries())
      .sort((a, b) => a[1][0] - b[1][0])
      .map(([name, stepIndices]) => ({
        name,
        stepIndices,
        isActiveInStep: stepIndices.includes(activeIndex),
      }));
  }, [steps, activeIndex]);

  const displayFileName = useMemo(() => {
    const activeInStep = globalFiles.filter(f => f.isActiveInStep);
    if (activeFileName && activeInStep.some(f => f.name === activeFileName)) {
      return activeFileName;
    }
    return activeInStep[0]?.name || null;
  }, [activeFileName, globalFiles]);

  const renderFileIndex = useMemo(() => {
    if (!displayFileName) return 0;
    if (multiFile && currentStep.files) {
      const idx = currentStep.files.findIndex(f => f.name === displayFileName);
      return Math.max(0, idx);
    }
    return 0;
  }, [displayFileName, multiFile, currentStep]);

  // Track file changes between steps for animation
  const prevFileRef = useRef<string | undefined>(currentStep?.file);
  const [fileChanged, setFileChanged] = useState(false);
  const prevStepRef = useRef(activeIndex);

  useLayoutEffect(() => {
    if (prevStepRef.current === activeIndex) return;

    const newFile = steps[activeIndex]?.file;
    const oldFile = prevFileRef.current;
    const didFileChange = newFile && oldFile && newFile !== oldFile;

    if (didFileChange) {
      setFileChanged(true);
      const timer = setTimeout(() => setFileChanged(false), 400);
      prevFileRef.current = newFile;
      prevStepRef.current = activeIndex;
      return () => clearTimeout(timer);
    }

    prevFileRef.current = newFile;
    prevStepRef.current = activeIndex;
  }, [activeIndex, steps]);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Copy to clipboard
  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) return;
    const code = getCodeForCopy(currentStep, renderFileIndex);
    if (!code) return;
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentStep, renderFileIndex]);

  // Animation callbacks
  const handleAnimationStart = useCallback(() => setIsAnimating(true), []);
  const handleAnimationEnd = useCallback(() => setIsAnimating(false), []);

  // Focus lines CSS (from focusLines array)
  const focusLines = useMemo(() => currentStep?.focusLines || [], [currentStep]);
  const focusLineCSS = useMemo(() => {
    if (focusLines.length === 0) return "";

    const lineSelectors = focusLines
      .map(line => `.canvas-code-stage.has-focus .shiki-magic-move-line:nth-child(${line})`)
      .join(",\n");

    return `
      .canvas-code-stage.has-focus .shiki-magic-move-line {
        opacity: 0.35;
        transition: opacity 280ms ease;
      }
      ${lineSelectors} {
        opacity: 1 !important;
        background: var(--canvas-focus-bg);
        margin-left: -1rem;
        margin-right: -1rem;
        padding-left: calc(1rem - 2px);
        padding-right: 1rem;
        border-left: 2px solid var(--canvas-focus-border);
      }
    `;
  }, [focusLines]);

  if (!currentStep) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        No code step found
      </div>
    );
  }

  const hasFocus = focusLines.length > 0;
  const hasTokens = isCompiled(currentStep);

  // Render code content
  const renderContent = () => {
    if (!hasTokens) {
      // Fallback for non-compiled steps
      const rawCode = (currentStep as CodeStep).code || "";
      return (
        <pre className="font-mono text-sm leading-relaxed">
          <code className="block">
            {rawCode.split("\n").map((line, i) => (
              <span key={i} className="shiki-magic-move-line block" data-line={i + 1}>
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      );
    }

    return (
      <CanvasMagicMove
        steps={steps}
        activeIndex={activeIndex}
        fileIndex={renderFileIndex}
        animate={!prefersReducedMotion}
        onStart={handleAnimationStart}
        onEnd={handleAnimationEnd}
      />
    );
  };

  // Render header (shared between normal and fullscreen)
  const renderHeader = (layoutIdSuffix: string = "") => (
    <div className="canvas-code-stage-header">
      <div className="flex items-center gap-3">
        {showStepIndicator && steps.length > 1 && (
          <div className="canvas-code-stage-step-badge">
            <span className="canvas-code-stage-step-num">{activeIndex + 1}</span>
            <span className="canvas-code-stage-step-divider">/</span>
            <span className="canvas-code-stage-step-total">{steps.length}</span>
          </div>
        )}

        {globalFiles.length > 1 ? (
          <div className="canvas-code-stage-tabs">
            {globalFiles.map((file) => {
              const isSelected = file.name === displayFileName;
              const isAvailable = file.isActiveInStep;
              return (
                <button
                  key={file.name}
                  onClick={() => isAvailable && setActiveFileName(file.name)}
                  data-active={isSelected}
                  data-available={isAvailable}
                  disabled={!isAvailable}
                  className="canvas-code-stage-tab"
                >
                  {file.name}
                  {isSelected && (
                    <motion.span
                      layoutId={`canvas-tab-underline${layoutIdSuffix}`}
                      className="canvas-code-stage-underline"
                      transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          displayFileName && (
            <AnimatePresence mode="wait">
              <motion.div
                key={displayFileName}
                className={cn(
                  "canvas-code-stage-file",
                  fileChanged && "canvas-code-stage-file-changed"
                )}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
              >
                <FileIcon />
                {displayFileName}
              </motion.div>
            </AnimatePresence>
          )
        )}
      </div>

      <div className="canvas-code-stage-toolbar">
        {fullscreenEnabled && (
          <button onClick={handleFullscreen} className="canvas-code-stage-btn" aria-label="Fullscreen">
            {isFullscreen ? <CloseIcon /> : <ExpandIcon />}
          </button>
        )}
        <button onClick={handleCopy} className="canvas-code-stage-btn" aria-label="Copy code">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={springSnappy} className="text-[--canvas-focus-border]">
                <CheckIcon />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={springSnappy}>
                <CopyIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      layoutId={isFullscreen ? undefined : "canvas-code-stage-container"}
      className={cn(
        "canvas-code-stage relative h-full w-full flex flex-col",
        hasFocus && "has-focus",
        className
      )}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : springGentle}
    >
      {/* Focus line CSS injection */}
      {focusLineCSS && <style dangerouslySetInnerHTML={{ __html: focusLineCSS }} />}

      {renderHeader()}

      <div className={cn(
        "canvas-code-stage-content flex-1",
        "font-mono text-sm leading-relaxed",
        isAnimating && "pointer-events-none"
      )}>
        {renderContent()}
      </div>

      {/* Fullscreen portal */}
      <AnimatePresence>
        {isFullscreen && typeof document !== "undefined" && createPortal(
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={handleFullscreen}
            />
            <motion.div
              layoutId="canvas-code-stage-container"
              className={cn("canvas-code-stage absolute flex flex-col", hasFocus && "has-focus")}
              style={{ top: "2rem", left: "2rem", right: "2rem", bottom: "2rem" }}
              transition={prefersReducedMotion ? { duration: 0 } : springGentle}
            >
              {focusLineCSS && <style dangerouslySetInnerHTML={{ __html: focusLineCSS }} />}
              {renderHeader("-fullscreen")}
              <div className={cn(
                "canvas-code-stage-content flex-1",
                "font-mono text-sm leading-relaxed",
                isAnimating && "pointer-events-none"
              )}>
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export type { CodeStep, CompiledCodeStep, AnyCodeStep };
