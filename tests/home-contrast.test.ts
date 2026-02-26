import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage contrast classes", () => {
  it("avoids low-contrast text-foreground/50 usage", () => {
    const homeSource = readFileSync(
      resolve(process.cwd(), "components/landing/Home.tsx"),
      "utf8",
    );

    expect(homeSource).not.toMatch(/text-foreground\/50/g);
  });
});
