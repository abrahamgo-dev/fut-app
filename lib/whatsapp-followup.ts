const DEFAULT_FOLLOW_UP_MESSAGE =
  "Hola, gracias por escribirnos. Bienvenido a Once FC. Si quieres seguir de cerca nuestras aperturas, horarios y novedades, te invitamos a seguirnos en Instagram: https://www.instagram.com/oncefcmx/";

export function getFollowUpMessage(): string {
  return DEFAULT_FOLLOW_UP_MESSAGE;
}

export function normalizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("52")) {
    return `+${digits}`;
  }

  if (digits.startsWith("1") && digits.length === 11) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length > 10) {
    return `+52${digits.slice(1)}`;
  }

  if (digits.startsWith("0")) {
    return `+52${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+52${digits}`;
  }

  if (digits.length > 10) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

export function getFollowUpSendTime(submittedAt = new Date()): Date {
  const scheduled = new Date(submittedAt.getTime() + 60 * 60 * 1000);
  const day = scheduled.getDay();
  const hour = scheduled.getHours();

  if (day === 0) {
    scheduled.setDate(scheduled.getDate() + 1);
    scheduled.setHours(9, 0, 0, 0);
    return scheduled;
  }

  if (day === 6) {
    scheduled.setDate(scheduled.getDate() + 2);
    scheduled.setHours(9, 0, 0, 0);
    return scheduled;
  }

  if (hour < 9) {
    scheduled.setHours(9, 0, 0, 0);
    return scheduled;
  }

  if (hour >= 19) {
    scheduled.setDate(scheduled.getDate() + 1);
    scheduled.setHours(9, 0, 0, 0);
    return scheduled;
  }

  return scheduled;
}

export async function sendFollowUpWhatsApp(
  toPhone: string,
  message = getFollowUpMessage(),
) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.warn(
      "META_ACCESS_TOKEN o META_WHATSAPP_PHONE_NUMBER_ID no configurados para follow-up.",
    );
    return { ok: false, reason: "missing-config" };
  }

  const normalizedTo = normalizeWhatsAppPhone(toPhone);
  if (!normalizedTo) {
    return { ok: false, reason: "invalid-phone" };
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
        to: normalizedTo,
        type: "text",
        text: { body: message },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Follow-up WhatsApp failed", response.status, text);
    return {
      ok: false,
      reason: "provider-error",
      status: response.status,
      text,
    };
  }

  return { ok: true };
}
