"use client";

import { useTabVisibility } from "@/hooks/useTabVisibility";

interface TabVisibilityProps {
  awayMessage?: string;
  originalTitle?: string;
  enabled?: boolean;
}

export function TabVisibility({
  awayMessage,
  originalTitle,
  enabled = true,
}: TabVisibilityProps): null {
  useTabVisibility({ awayMessage, originalTitle, enabled });
  return null;
}

export default TabVisibility;
