import { NextRequest, NextResponse } from "next/server";

/**
 * Mux Direct Upload API Endpoint
 *
 * Creates a direct upload URL for uploading videos directly to Mux
 * from the client, bypassing your server for the actual video bytes.
 *
 * Required Environment Variables:
 * - MUX_TOKEN_ID: Your Mux access token ID
 * - MUX_TOKEN_SECRET: Your Mux access token secret
 *
 * Usage:
 * 1. POST to this endpoint to get an upload URL
 * 2. Use the returned URL to upload video directly to Mux
 * 3. Mux will process the video and create an asset
 * 4. The asset's playback_id can be used in VideoPlayer component
 */

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

interface MuxUploadResponse {
  data: {
    id: string;
    url: string;
    status: string;
    new_asset_settings: {
      playback_policy: string[];
      encoding_tier: string;
    };
    cors_origin: string;
    timeout: number;
  };
}

interface MuxAssetResponse {
  data: {
    id: string;
    playback_ids: Array<{
      id: string;
      policy: string;
    }>;
    status: string;
  };
}

export async function POST(request: NextRequest) {
  // Validate environment variables
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return NextResponse.json(
      {
        error: "Mux credentials not configured",
        message:
          "Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in your environment variables",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const corsOrigin = body.corsOrigin || "*";

    // Create a direct upload URL
    const response = await fetch("https://api.mux.com/video/v1/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ["public"],
          encoding_tier: "baseline",
        },
        cors_origin: corsOrigin,
        timeout: 3600, // 1 hour timeout for upload
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Mux API error:", error);
      return NextResponse.json(
        { error: "Failed to create upload URL", details: error },
        { status: response.status }
      );
    }

    const data: MuxUploadResponse = await response.json();

    return NextResponse.json({
      uploadId: data.data.id,
      uploadUrl: data.data.url,
      status: data.data.status,
    });
  } catch (error) {
    console.error("Upload creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check upload status and retrieve playback ID
 * Query params: uploadId
 */
export async function GET(request: NextRequest) {
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return NextResponse.json(
      { error: "Mux credentials not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get("uploadId");

  if (!uploadId) {
    return NextResponse.json(
      { error: "uploadId query parameter required" },
      { status: 400 }
    );
  }

  try {
    // Check upload status
    const uploadResponse = await fetch(
      `https://api.mux.com/video/v1/uploads/${uploadId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get upload status" },
        { status: uploadResponse.status }
      );
    }

    const uploadData = await uploadResponse.json();
    const assetId = uploadData.data.asset_id;

    // If asset is created, get the playback ID
    if (assetId) {
      const assetResponse = await fetch(
        `https://api.mux.com/video/v1/assets/${assetId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`
            ).toString("base64")}`,
          },
        }
      );

      if (assetResponse.ok) {
        const assetData: MuxAssetResponse = await assetResponse.json();
        const playbackId = assetData.data.playback_ids?.[0]?.id;

        return NextResponse.json({
          uploadStatus: uploadData.data.status,
          assetId,
          assetStatus: assetData.data.status,
          playbackId,
        });
      }
    }

    return NextResponse.json({
      uploadStatus: uploadData.data.status,
      assetId: assetId || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
