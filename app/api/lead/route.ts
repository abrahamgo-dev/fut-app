import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  try {
    await prisma.leadMessage.create({
      data: {
        name,
        age,
        phone,
        cityName: cityName || null,
        preferredSchedule: preferredSchedule || null,
      },
    });
  } catch (err) {
    console.error("No se pudo guardar el lead en la base de datos:", err);
    return NextResponse.json({ error: "No se pudo guardar tu solicitud." }, { status: 500 });
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    console.error(
      "RESEND_API_KEY o LEAD_NOTIFICATION_EMAIL no configurados — ver .env.example."
    );
    // The lead is already saved and visible in the admin panel, so a missing
    // email config shouldn't block the visitor-facing submission.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    // onboarding@resend.dev works without domain verification for testing.
    // Once you verify your own domain in Resend, switch this to e.g. leads@once-fc.com.
    from: "Once FC <onboarding@resend.dev>",
    to: [to],
    subject: `Nuevo lead${cityName ? ` — ${cityName}` : ""}: ${name}`,
    html: `
      <h2>Nueva solicitud de sesión gratuita</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Edad:</strong> ${escapeHtml(age)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
      ${cityName ? `<p><strong>Ciudad:</strong> ${escapeHtml(cityName)}</p>` : ""}
      ${preferredSchedule ? `<p><strong>Horario preferido:</strong> ${escapeHtml(preferredSchedule)}</p>` : ""}
    `,
  });

  if (error) {
    // Notification email failed, but the lead is already saved — don't surface
    // this as a failure to the visitor.
    console.error("Resend error:", error);
  }

  return NextResponse.json({ ok: true });
}
