import { NextRequest, NextResponse } from "next/server";

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

// Simple in-memory cache for link previews
const cache = new Map<string, { data: LinkMetadata; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const metadata = parseMetadata(html, url);

    // Cache the result
    cache.set(url, { data: metadata, timestamp: Date.now() });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Link preview error:", error);

    // Return basic metadata on error
    const parsedUrl = new URL(url);
    const fallback: LinkMetadata = {
      siteName: parsedUrl.hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
    };

    return NextResponse.json(fallback);
  }
}

function parseMetadata(html: string, url: string): LinkMetadata {
  const parsedUrl = new URL(url);
  const metadata: LinkMetadata = {
    favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
  };

  // Extract Open Graph metadata
  const ogTitle = extractMeta(html, 'property="og:title"') || extractMeta(html, "property='og:title'");
  const ogDescription = extractMeta(html, 'property="og:description"') || extractMeta(html, "property='og:description'");
  const ogImage = extractMeta(html, 'property="og:image"') || extractMeta(html, "property='og:image'");
  const ogSiteName = extractMeta(html, 'property="og:site_name"') || extractMeta(html, "property='og:site_name'");

  // Extract Twitter card metadata as fallback
  const twitterTitle = extractMeta(html, 'name="twitter:title"') || extractMeta(html, "name='twitter:title'");
  const twitterDescription = extractMeta(html, 'name="twitter:description"') || extractMeta(html, "name='twitter:description'");
  const twitterImage = extractMeta(html, 'name="twitter:image"') || extractMeta(html, "name='twitter:image'");

  // Extract standard metadata as fallback
  const title = extractTag(html, "title");
  const description = extractMeta(html, 'name="description"') || extractMeta(html, "name='description'");

  // Use the best available metadata
  metadata.title = ogTitle || twitterTitle || title;
  metadata.description = ogDescription || twitterDescription || description;
  metadata.image = ogImage || twitterImage;
  metadata.siteName = ogSiteName || parsedUrl.hostname;

  // Resolve relative image URLs
  if (metadata.image && !metadata.image.startsWith("http")) {
    metadata.image = new URL(metadata.image, url).href;
  }

  // Truncate long descriptions
  if (metadata.description && metadata.description.length > 200) {
    metadata.description = metadata.description.slice(0, 200) + "...";
  }

  return metadata;
}

function extractMeta(html: string, attribute: string): string | undefined {
  const regex = new RegExp(`<meta[^>]*${attribute}[^>]*content=["']([^"']+)["'][^>]*>`, "i");
  const altRegex = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*${attribute}[^>]*>`, "i");

  const match = html.match(regex) || html.match(altRegex);
  return match?.[1]?.trim();
}

function extractTag(html: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i");
  const match = html.match(regex);
  return match?.[1]?.trim();
}
