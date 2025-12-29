import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();
    
    if (!userId) {
      return Response.json({ error: "Not authenticated" });
    }

    // Get user from database
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Check by email
      if (clerkUser) {
        const existingUserByEmail = await db.user.findUnique({
          where: { email: clerkUser.emailAddresses[0].emailAddress },
        });
        
        if (existingUserByEmail) {
          user = existingUserByEmail;
        }
      }
    }

    // Get some sample transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user?.id },
      take: 5,
      select: { id: true, description: true, userId: true }
    });

    return Response.json({
      clerkUserId: userId,
      clerkUserEmail: clerkUser?.emailAddresses[0]?.emailAddress,
      dbUser: user ? {
        id: user.id,
        email: user.email,
        clerkUserId: user.clerkUserId
      } : null,
      sampleTransactions: transactions
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
