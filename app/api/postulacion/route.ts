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
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Faltan datos requeridos." }, { status: 400 });
  }

  try {
    await prisma.jobApplication.create({
      data: { name, phone, message },
    });
  } catch (err) {
    console.error("No se pudo guardar la postulación en la base de datos:", err);
    return NextResponse.json({ error: "No se pudo guardar tu postulación." }, { status: 500 });
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    console.error(
      "RESEND_API_KEY o LEAD_NOTIFICATION_EMAIL no configurados — ver .env.example."
    );
    // The application is already saved and visible in the admin panel, so a missing
    // email config shouldn't block the visitor-facing submission.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Once FC <onboarding@resend.dev>",
    to: [to],
    subject: `Nueva postulación — bolsa de trabajo: ${name}`,
    html: `
      <h2>Nueva postulación de bolsa de trabajo</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Mensaje:</strong> ${escapeHtml(message)}</p>
    `,
  });

  if (error) {
    // Notification email failed, but the application is already saved — don't
    // surface this as a failure to the visitor.
    console.error("Resend error:", error);
  }

  return NextResponse.json({ ok: true });
}
