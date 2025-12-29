import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";

export async function POST() {
  try {
    const result = await sendEmail({
      to: "your-email@example.com", // Update with your email
      subject: "Test Email from Finance Platform",
      react: EmailTemplate({
        userName: "Test User",
        type: "monthly-report",
        data: {
          month: "December",
          stats: {
            totalIncome: 5000,
            totalExpenses: 3500,
            byCategory: {
              housing: 1500,
              groceries: 600,
              transportation: 400,
              entertainment: 300,
              utilities: 700,
            },
          },
          insights: [
            "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
            "Great job keeping entertainment expenses under control this month!",
            "Setting up automatic savings could help you save 20% more of your income.",
          ],
        },
      }),
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
