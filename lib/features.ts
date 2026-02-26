/**
 * Feature flags for controlling feature rollouts.
 *
 * These use NEXT_PUBLIC_ prefix so they're available in both
 * server and client components.
 *
 * Set values in .env.local:
 * NEXT_PUBLIC_FEATURE_AUTH=true
 * NEXT_PUBLIC_FEATURE_COURSES=true
 */

function parseBooleanFlag(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "true";
}

const coursesFlag = parseBooleanFlag(process.env.NEXT_PUBLIC_FEATURE_COURSES);
const experimentsFlag = parseBooleanFlag(process.env.NEXT_PUBLIC_FEATURE_EXPERIMENTS);

export const features = {
  /** Enable authentication UI (sign in, user menu) */
  auth: process.env.NEXT_PUBLIC_FEATURE_AUTH === "true",

  /**
   * Enable course/learning features.
   * Default behavior:
   * - development: enabled
   * - production: disabled
   * Override with NEXT_PUBLIC_FEATURE_COURSES=true/false
   */
  courses: coursesFlag ?? process.env.NODE_ENV === "development",

  /** Enable dashboard */
  dashboard: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD === "true",

  /**
   * Enable experiments page.
   * Default behavior:
   * - development: enabled
   * - production: disabled
   * Override with NEXT_PUBLIC_FEATURE_EXPERIMENTS=true/false
   */
  experiments: experimentsFlag ?? process.env.NODE_ENV === "development",
} as const;

/** Type for feature flag names */
export type FeatureFlag = keyof typeof features;

/**
 * Check if a feature is enabled.
 * Can be used in both server and client components.
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}

/**
 * React hook for feature flags (client components only).
 * Same as isFeatureEnabled but follows React naming conventions.
 */
export function useFeature(flag: FeatureFlag): boolean {
  return features[flag];
}
