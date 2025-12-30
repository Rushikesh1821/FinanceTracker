import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Not authenticated" });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    // Get all user's transactions
    const allTransactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 10,
    });

    // Get user's accounts
    const accounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // Count transactions per account
    const transactionCounts = {};
    for (const account of accounts) {
      const count = await db.transaction.count({
        where: { 
          userId: user.id,
          accountId: account.id 
        },
      });
      transactionCounts[account.id] = count;
    }

    return Response.json({
      user: {
        clerkUserId: userId,
        dbUserId: user.id,
        email: user.email
      },
      accounts: accounts.map(acc => ({
        ...acc,
        transactionCount: transactionCounts[acc.id] || 0
      })),
      totalTransactions: allTransactions.length,
      recentTransactions: allTransactions
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
