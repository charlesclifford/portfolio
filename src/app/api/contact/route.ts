import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@NsCliff.com";
    const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "hello@NsCliff.com";
    const FROM_NAME = process.env.CONTACT_FROM_NAME ?? "NsCliff";

    // Dev fallback — no API key configured
    if (!BREVO_API_KEY) {
      console.log("📨 Contact form submission (no BREVO_API_KEY configured):");
      console.log({ name, email, subject, message });
      return NextResponse.json({ success: true });
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: FROM_NAME,
          email: FROM_EMAIL,
        },
        to: [{ email: TO_EMAIL }],
        replyTo: { email, name },
        subject: subject?.trim()
          ? `[NsCliff.com] ${subject}`
          : `[NsCliff.com] New message from ${name}`,
        htmlContent: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
            <h2 style="font-weight: 300; font-size: 24px; margin: 0 0 24px; color: #fff;">
              New contact message
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #888; width: 100px; font-size: 13px;">From</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${
                subject?.trim()
                  ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #888; font-size: 13px;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 14px;">${subject}</td>
              </tr>`
                  : ""
              }
            </table>

            <div style="background: #111; border: 1px solid #27272a; border-radius: 8px; padding: 20px;">
              <p style="font-size: 13px; color: #888; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
              <p style="font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="font-size: 12px; color: #555; margin: 24px 0 0; text-align: center;">
              Sent from the contact form at NsCliff.com
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Brevo error:", err);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
