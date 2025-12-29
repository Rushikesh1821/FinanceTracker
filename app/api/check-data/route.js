import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();
    
    if (!userId) {
      return Response.json({ error: "Not authenticated" });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // Get user's accounts
    const accounts = await db.account.findMany({
      where: { userId: user?.id },
    });

    // Get user's transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user?.id },
      take: 5,
    });

    return Response.json({
      clerkUserId: userId,
      userEmail: clerkUser?.emailAddresses[0]?.emailAddress,
      dbUser: user,
      accounts: accounts,
      recentTransactions: transactions,
      totalTransactions: transactions.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
