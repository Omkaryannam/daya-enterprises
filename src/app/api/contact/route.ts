import { NextRequest, NextResponse } from "next/server";
import { business } from "@/lib/content";

type ContactPayload = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  service?: string;
  details?: string;
};

export async function POST(request: NextRequest) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, company, phone, email, service, details } = data;

  if (!name || !phone || !email) {
    return NextResponse.json(
      { ok: false, error: "Name, phone and email are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email service configured yet — the client falls back to a mailto: link.
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 501 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || business.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Daya Enterprises Website <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Consultation request — ${service || "General enquiry"}`,
        text: [
          `Name: ${name}`,
          `Company: ${company || "-"}`,
          `Phone: ${phone}`,
          `Email: ${email}`,
          `Service Required: ${service || "-"}`,
          "",
          "Project Details:",
          details || "-",
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API error:", res.status, errText);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}
