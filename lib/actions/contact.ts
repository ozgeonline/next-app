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
  message: string,
  captchaToken: string
): Promise<ContactResult> {
  if (!name || !email || !message || !captchaToken) {
    return { success: false, error: "All fields and CAPTCHA verification are required" };
  }
  if (name.trim().length < 2 || name.trim().length > 50) {
    return { success: false, error: "Name must be between 2 and 50 characters" };
  }

  if (message.trim().length < 10 || message.trim().length > 2000) {
    return { success: false, error: "Message must be between 10 and 2000 characters" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email format" };
  }

  // Google reCAPTCHA Verification
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is missing in .env");
      return { success: false, error: "Server configuration error" };
    }

    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${captchaToken}`,
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return { success: false, error: "Verification failed. Please try again." };
    }
  } catch (error) {
    console.error("Captcha verification error:", error);
    return { success: false, error: "Verification could not be completed. Please try again." };
  }

  // Send the Email if everything is safe
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
      return { success: false, error: "Message could not be sent. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { success: false, error: "Message could not be sent. Please try again." };
  }
}
