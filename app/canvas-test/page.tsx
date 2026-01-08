import { BlogWithCanvas } from "@/components/blog/BlogWithCanvas";
import { CanvasEnd, CanvasGap, CanvasZone } from "@/components/blog/CanvasZone";

/**
 * Canvas Layout Test Page - Phase 2
 *
 * Tests scroll-triggered canvas activation using CanvasZone components.
 * Scroll through the page to see different zones activate the canvas.
 *
 * Test Checklist:
 * - [ ] Scrolling into Zone 1 activates canvas with red content
 * - [ ] Scrolling into Zone 2 swaps canvas to blue content
 * - [ ] Scrolling past all zones hides canvas
 * - [ ] Scrolling back up re-activates zones
 * - [ ] Fast scrolling doesn't cause flickering
 * - [ ] Mobile: zones render but no canvas animation
 */
export default function CanvasTestPage() {
  return (
    <BlogWithCanvas>
      {/* Sample blog content - intro section */}
      <article className="prose prose-lg dark:prose-invert max-w-none py-12">
        <h1>Canvas Zone Test - Phase 2</h1>

        <p className="lead">
          This page tests scroll-triggered canvas activation using the
          CanvasZone component. Scroll down to see different zones activate the
          canvas sidebar.
        </p>

        <h2>Before the Zones</h2>
        <p>
          This content appears before any CanvasZone. The canvas should be
          hidden (translated 100% off-screen) and the blog content should be
          centered.
        </p>

        {/* Spacer content */}
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={`before-${i}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </article>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Zone 1: Red theme */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <CanvasZone
        id="zone-1"
        type="code"
        canvasContent={
          <div className="w-full h-full bg-red-500/20 rounded-lg flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-6xl">🔴</div>
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
              Zone 1 Active
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              This content appears when Zone 1 is scrolled into view.
            </p>
          </div>
        }
      >
        <article className="prose prose-lg dark:prose-invert max-w-none py-12">
          <h2 className="text-red-600 dark:text-red-400">
            Zone 1: Introduction
          </h2>

          <p>
            <strong>You are now in Zone 1.</strong> Notice how the canvas
            sidebar has appeared with red-themed content. The blog column has
            shifted left to make room.
          </p>

          <p>
            The IntersectionObserver watches this zone and triggers when it
            enters the center 60% of the viewport (rootMargin: -20% 0px -20%
            0px).
          </p>

          {/* Spacer content to extend the zone */}
          {Array.from({ length: 4 }).map((_, i) => (
            <p key={`zone1-${i}`}>
              Continue scrolling to see the canvas content change when you reach
              Zone 2. The transition between zones should be smooth and
              immediate.
            </p>
          ))}
        </article>
      </CanvasZone>

      {/* Gap between zones - sentinel closes the canvas in the spacer */}
      <CanvasGap>
        <article className="prose prose-lg dark:prose-invert max-w-none py-12">
          <h2>Between Zones</h2>
          <p>
            This is a gap between Zone 1 and Zone 2. When you scroll past Zone
            1, the canvas should hide. When Zone 2 comes into view, it will show
            different content.
          </p>
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={`gap-${i}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </article>
      </CanvasGap>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Zone 2: Blue theme */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <CanvasZone
        id="zone-2"
        type="demo"
        canvasContent={
          <div className="w-full h-full bg-blue-500/20 rounded-lg flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-6xl">🔵</div>
            <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Zone 2 Active
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Different canvas content for Zone 2!
            </p>
          </div>
        }
      >
        <article className="prose prose-lg dark:prose-invert max-w-none py-12">
          <h2 className="text-blue-600 dark:text-blue-400">
            Zone 2: Deep Dive
          </h2>

          <p>
            <strong>Welcome to Zone 2!</strong> The canvas has swapped to
            blue-themed content. This demonstrates how different zones can show
            different content.
          </p>

          <p>
            Each CanvasZone can have completely different canvas content - code
            stages, interactive demos, visualizations, or anything else.
          </p>

          {/* Spacer content */}
          {Array.from({ length: 4 }).map((_, i) => (
            <p key={`zone2-${i}`}>
              Scroll past this zone to see the canvas slide back out. Then try
              scrolling back up to watch the zones re-activate in reverse order.
            </p>
          ))}
        </article>
      </CanvasZone>

      {/* After all zones - sentinel keeps the canvas closed */}
      <CanvasGap>
        <article className="prose prose-lg dark:prose-invert max-w-none py-12">
          <h2>After All Zones</h2>
          <p>
            You&apos;ve scrolled past all zones. The canvas should now be hidden
            and the blog content should be centered again.
          </p>

          <h3>Test Results</h3>
          <ul>
            <li>Zone 1 activated canvas with red content ✓/✗</li>
            <li>Zone 2 swapped to blue content ✓/✗</li>
            <li>Canvas hid when scrolling between zones ✓/✗</li>
            <li>Canvas hid after all zones ✓/✗</li>
            <li>No flickering during fast scroll ✓/✗</li>
          </ul>

          {/* Extra spacer to allow scrolling past */}
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={`after-${i}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </article>
      </CanvasGap>

      <CanvasEnd />
    </BlogWithCanvas>
  );
}
