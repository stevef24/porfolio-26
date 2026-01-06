import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribePayload = {
  email?: string;
  source?: string;
  website?: string;
};

export async function POST(request: Request) {
  let payload: SubscribePayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const email = payload.email?.trim().toLowerCase() ?? "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true, status: "ignored" });
  }

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Loops API key." },
      { status: 500 }
    );
  }

  const source = payload.source?.trim().slice(0, 64);
  const listId = process.env.LOOPS_MAILING_LIST_ID;

  const requestBody: Record<string, unknown> = {
    email,
    subscribed: true,
  };

  if (source) {
    requestBody.userGroup = source;
  }

  if (listId) {
    requestBody.mailingLists = {
      [listId]: true,
    };
  }

  const response = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json().catch(() => null);

  if (response.status === 409) {
    return NextResponse.json({ ok: true, status: "exists" });
  }

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: data?.message ?? "Unable to subscribe right now." },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, status: "subscribed" });
}
