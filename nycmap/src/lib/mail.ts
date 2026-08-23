import { appBaseUrl } from "@/lib/stripe";

export async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim() || "NYC MAP <maps@nycmap.lol>";
  if (!key || !to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error("[mail]", await res.text());
    return false;
  }
  return true;
}

export function takeoverEmailHtml(input: {
  previousOwner: string;
  newOwner: string;
  neighborhood: string;
  lotId: string;
  amount: number;
}) {
  const origin = appBaseUrl();
  return `
    <div style="font-family:Georgia,serif;background:#f6f4ef;padding:32px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e4e0d8;border-radius:24px;padding:28px;color:#141414">
        <p style="letter-spacing:.18em;font-size:11px;color:#8a847e;text-transform:uppercase;margin:0">NYC MAP</p>
        <h1 style="font-size:28px;margin:8px 0 16px">Someone took your lot.</h1>
        <p style="font-size:16px;line-height:1.5;color:#5c574f">
          ${escapeHtml(input.newOwner)} just stole <strong>${escapeHtml(input.lotId)}</strong> in
          ${escapeHtml(input.neighborhood)} for $${input.amount.toFixed(0)}.
        </p>
        <p style="font-size:16px;line-height:1.5;color:#5c574f">
          Take it back at 1.5× — or let them keep the flag.
        </p>
        <p style="margin:24px 0 0">
          <a href="${origin}" style="display:inline-block;background:#141414;color:#fff;text-decoration:none;padding:12px 18px;border-radius:16px;font-size:14px">
            Open the map
          </a>
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch] ?? ch));
}
