"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  // Add your API key directly here
  const apiKey = "re_Kzin7Lmg_82R8SWwUcxAVd8XKxVP2d4aZ"; // Your real API key
  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's default domain for testing
      to,
      subject,
      react,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
