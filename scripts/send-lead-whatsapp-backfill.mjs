// One-off/manual backfill: sends the WhatsApp follow-up message to every
// lead that hasn't received it yet, then marks those phone numbers as sent
// (Lead.whatsappSentAt) so they're never messaged again by this script.
//
// The automatic send-on-submit path (app/api/lead/route.ts) schedules this
// with setTimeout, which does not survive Vercel's serverless function
// lifecycle — so in practice no follow-up has gone out. This script is the
// manual stand-in until that's replaced with something durable (cron/queue).
//
// Usage:
//   node scripts/send-lead-whatsapp-backfill.mjs           # sends for real
//   node scripts/send-lead-whatsapp-backfill.mjs --dry-run  # preview only, no sends, no DB writes
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

loadEnvFile();
const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_BETWEEN_SENDS_MS = 500;

// Same message as lib/whatsapp-followup.ts getFollowUpMessage().
const FOLLOW_UP_MESSAGE =
  "Hola, gracias por escribirnos. Bienvenido a Once FC. Si quieres seguir de cerca nuestras aperturas, horarios y novedades, te invitamos a seguirnos en Instagram: https://www.instagram.com/oncefcmx/";

// Same logic as lib/whatsapp-followup.ts normalizeWhatsAppPhone().
function normalizeWhatsAppPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("52")) return `+${digits}`;
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length > 10) return `+52${digits.slice(1)}`;
  if (digits.startsWith("0")) return `+52${digits.slice(1)}`;
  if (digits.length === 10) return `+52${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return `+${digits}`;
}

async function sendWhatsApp(toPhone) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error(
      "META_ACCESS_TOKEN o META_WHATSAPP_PHONE_NUMBER_ID no configurados (.env.local).",
    );
  }

  const to = normalizeWhatsAppPhone(toPhone);
  if (!to) throw new Error("Teléfono inválido");

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
        text: { body: FOLLOW_UP_MESSAGE },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Meta respondió ${response.status}: ${text}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (DRY_RUN) {
    console.log("=== DRY RUN: no se enviará nada ni se marcará nada ===\n");
  }

  const pendingLeads = await prisma.lead.findMany({
    where: { whatsappSentAt: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, phone: true, phoneNormalized: true },
  });

  const validLeads = pendingLeads.filter((l) => l.phoneNormalized.length === 10);
  const invalidCount = pendingLeads.length - validLeads.length;

  const leadsByPhone = new Map();
  for (const lead of validLeads) {
    const group = leadsByPhone.get(lead.phoneNormalized) ?? [];
    group.push(lead);
    leadsByPhone.set(lead.phoneNormalized, group);
  }

  console.log(
    `Leads pendientes: ${pendingLeads.length} (${invalidCount} con teléfono inválido, se omiten)`,
  );
  console.log(`Números únicos a contactar: ${leadsByPhone.size}\n`);

  let sent = 0;
  let failed = 0;

  for (const [phoneNormalized, leads] of leadsByPhone) {
    const primaryLead = leads[leads.length - 1]; // most recent submission for this phone
    const label = `${primaryLead.name} (${primaryLead.phone})`;

    if (DRY_RUN) {
      console.log(`[dry-run] Enviaría a ${label}`);
      continue;
    }

    try {
      await sendWhatsApp(primaryLead.phone);
      await prisma.lead.updateMany({
        where: { phoneNormalized },
        data: { whatsappSentAt: new Date() },
      });
      sent += 1;
      console.log(`OK   ${label}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${label}: ${error.message}`);
    }

    await sleep(DELAY_BETWEEN_SENDS_MS);
  }

  if (!DRY_RUN) {
    console.log(`\nEnviados: ${sent}  Fallidos: ${failed}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
