import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

async function loadFeaturesModule(
  env: Record<string, string | undefined>
): Promise<typeof import("@/lib/features")> {
  process.env = { ...ORIGINAL_ENV, ...env };
  vi.resetModules();
  return import("@/lib/features");
}

describe("feature flags", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.resetModules();
  });

  it("enables courses by default in development", async () => {
    const mod = await loadFeaturesModule({
      NODE_ENV: "development",
      NEXT_PUBLIC_FEATURE_COURSES: undefined,
    });

    expect(mod.features.courses).toBe(true);
  });

  it("disables courses by default in production", async () => {
    const mod = await loadFeaturesModule({
      NODE_ENV: "production",
      NEXT_PUBLIC_FEATURE_COURSES: undefined,
    });

    expect(mod.features.courses).toBe(false);
  });

  it("respects explicit enable in production", async () => {
    const mod = await loadFeaturesModule({
      NODE_ENV: "production",
      NEXT_PUBLIC_FEATURE_COURSES: "true",
    });

    expect(mod.features.courses).toBe(true);
  });

  it("respects explicit disable in development", async () => {
    const mod = await loadFeaturesModule({
      NODE_ENV: "development",
      NEXT_PUBLIC_FEATURE_COURSES: "false",
    });

    expect(mod.features.courses).toBe(false);
  });
});
