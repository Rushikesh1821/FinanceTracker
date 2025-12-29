import { db } from "@/lib/prisma";
import { seedTransactions } from "@/actions/seed";

export async function POST() {
  try {
    // Clear existing transactions for the current user
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ success: false, error: "Not authenticated" });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (user) {
      // Delete existing transactions
      await db.transaction.deleteMany({
        where: { userId: user.id },
      });
    }

    // Seed new transactions
    const result = await seedTransactions();
    return Response.json(result);
  } catch (error) {
    console.error("Reseed error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
