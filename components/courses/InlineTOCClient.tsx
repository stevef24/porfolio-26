"use client";

import type { ComponentProps } from "react";
import { InlineTOC as BaseInlineTOC } from "fumadocs-ui/components/inline-toc";
import { useTOCItems } from "fumadocs-ui/components/layout/toc";

type InlineTOCProps = Omit<ComponentProps<typeof BaseInlineTOC>, "items"> & {
  items?: Array<{ title: string; url: string; depth: number }>;
};

export function InlineTOCClient({ items, ...props }: InlineTOCProps): JSX.Element {
  const tocItems = useTOCItems();
  return <BaseInlineTOC items={items ?? tocItems ?? []} {...props} />;
}
