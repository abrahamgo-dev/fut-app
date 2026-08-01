import { NextResponse } from "next/server";
import { buildAutoReply } from "@/lib/whatsapp";

function getProvider(): "meta" | "twilio" | "mock" {
  const provider = (process.env.WHATSAPP_PROVIDER || "meta").toLowerCase();
  if (provider === "twilio") return "twilio";
  if (provider === "mock") return "mock";
  return "meta";
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractMessage(payload: any) {
  const provider = getProvider();

  if (provider === "twilio") {
    return {
      from: normalizeText(payload?.From || payload?.from),
      text: normalizeText(
        payload?.Body || payload?.body || payload?.text || payload?.message,
      ),
    };
  }

  if (provider === "meta") {
    const entry = Array.isArray(payload?.entry) ? payload.entry[0] : null;
    const change = Array.isArray(entry?.changes) ? entry.changes[0] : null;
    const value = change?.value ?? null;
    const message = Array.isArray(value?.messages) ? value.messages[0] : null;

    return {
      from: normalizeText(message?.from || value?.contacts?.[0]?.wa_id),
      text: normalizeText(
        message?.text?.body || message?.text || message?.body,
      ),
    };
  }

  return {
    from: normalizeText(payload?.from || payload?.From || payload?.sender),
    text: normalizeText(
      payload?.text || payload?.body || payload?.message || payload?.Body,
    ),
  };
}

async function sendWhatsAppReply(to: string, message: string) {
  const autoReplyEnabled = process.env.WHATSAPP_AUTO_REPLY_ENABLED !== "false";
  if (!autoReplyEnabled) {
    return;
  }

  const provider = getProvider();

  if (provider === "twilio") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !from || !to) {
      console.warn(
        "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM no están completos.",
      );
      return;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Body: message,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Twilio replied with ${response.status}`);
    }

    return;
  }

  if (provider === "meta") {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId || !to) {
      console.warn(
        "META_ACCESS_TOKEN / META_WHATSAPP_PHONE_NUMBER_ID no están completos.",
      );
      return;
    }

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Meta replied with ${response.status}`);
    }

    return;
  }

  console.info(
    "WhatsApp auto-reply está en modo mock; no se envía ningún mensaje real.",
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (
    mode === "subscribe" &&
    token &&
    expectedToken &&
    token === expectedToken
  ) {
    return new NextResponse(challenge || "ok", {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const provider = getProvider();
  const contentType = request.headers.get("content-type") || "";
  let payload: any = null;

  if (contentType.includes("application/json")) {
    payload = await request.json().catch(() => null);
  } else {
    const text = await request.text().catch(() => "");
    const params = new URLSearchParams(text);
    payload = Object.fromEntries(params.entries());
  }

  const incoming = extractMessage(payload);
  const reply = buildAutoReply(incoming.text);

  if (incoming.from) {
    console.log(
      `[whatsapp] ${provider} incoming from ${incoming.from}: ${incoming.text}`,
    );

    try {
      await sendWhatsAppReply(incoming.from, reply);
    } catch (error) {
      console.error(
        "No se pudo enviar la respuesta automática de WhatsApp",
        error,
      );
    }
  }

  return NextResponse.json({
    ok: true,
    received: true,
    provider,
    from: incoming.from || null,
    reply,
  });
}
