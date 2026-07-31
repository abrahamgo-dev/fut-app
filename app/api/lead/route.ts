import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

// Same phone number claiming another free session within this window gets
// silently skipped (no re-notification) — see prisma/schema.prisma Lead model.
const DUPLICATE_PHONE_WINDOW_DAYS = 90;
// More than this many submissions from one IP in 24h gets flagged for review,
// but still notified — shared IPs (offices, family wifi) are common enough
// that hard-blocking on IP alone would reject real leads.
const IP_RATE_LIMIT_PER_DAY = 3;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const age = typeof body?.age === "string" || typeof body?.age === "number" ? String(body.age).trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const cityName = typeof body?.cityName === "string" ? body.cityName.trim() : "";
  const preferredSchedule =
    typeof body?.preferredSchedule === "string" ? body.preferredSchedule.trim() : "";

  if (!name || !age || !phone) {
    return NextResponse.json({ error: "Faltan datos requeridos." }, { status: 400 });
  }

  const phoneNormalized = normalizePhone(phone);
  const ipAddress = getClientIp(request);

  const [duplicatePhone, recentFromIp] = await Promise.all([
    phoneNormalized.length === 10
      ? prisma.lead.findFirst({
          where: {
            phoneNormalized,
            createdAt: { gte: new Date(Date.now() - DUPLICATE_PHONE_WINDOW_DAYS * 86_400_000) },
          },
        })
      : null,
    ipAddress
      ? prisma.lead.count({
          where: { ipAddress, createdAt: { gte: new Date(Date.now() - 86_400_000) } },
        })
      : 0,
  ]);

  const isDuplicatePhone = Boolean(duplicatePhone);
  const isRateLimitedIp = recentFromIp >= IP_RATE_LIMIT_PER_DAY;

  await prisma.lead.create({
    data: {
      name,
      age,
      phone,
      phoneNormalized,
      cityName: cityName || null,
      preferredSchedule: preferredSchedule || null,
      ipAddress,
      isDuplicatePhone,
      isRateLimitedIp,
    },
  });

  // Same phone already claimed a free session recently: pretend it worked
  // (no error shown to the visitor) but skip notifying the coach again.
  if (isDuplicatePhone) {
    return NextResponse.json({ ok: true });
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    console.error(
      "RESEND_API_KEY o LEAD_NOTIFICATION_EMAIL no configurados — ver .env.example."
    );
    return NextResponse.json(
      { error: "El servicio de correo no está configurado todavía." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    // onboarding@resend.dev works without domain verification for testing.
    // Once you verify your own domain in Resend, switch this to e.g. leads@once-fc.com.
    from: "Once FC <onboarding@resend.dev>",
    to: [to],
    subject: `${isRateLimitedIp ? "[Revisar] " : ""}Nuevo lead${cityName ? ` — ${cityName}` : ""}: ${name}`,
    html: `
      <h2>Nueva solicitud de sesión gratuita</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Edad:</strong> ${escapeHtml(age)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
      ${cityName ? `<p><strong>Ciudad:</strong> ${escapeHtml(cityName)}</p>` : ""}
      ${preferredSchedule ? `<p><strong>Horario preferido:</strong> ${escapeHtml(preferredSchedule)}</p>` : ""}
      ${isRateLimitedIp ? `<p><em>Varias solicitudes desde la misma red en las últimas 24 horas — revisar antes de confirmar.</em></p>` : ""}
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "No se pudo enviar el correo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
