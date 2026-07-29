import { NextResponse } from "next/server";
import { Resend } from "resend";

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
    console.error("Resend error:", error);
    return NextResponse.json({ error: "No se pudo enviar el correo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
