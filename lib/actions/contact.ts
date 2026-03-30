'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<ContactResult> {
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'onboarding@resend.dev',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send message" };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
