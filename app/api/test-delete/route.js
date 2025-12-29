import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { transactionId } = await request.json();
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Not authenticated" });
    }

    // Get user
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (clerkUser) {
        const existingUserByEmail = await db.user.findUnique({
          where: { email: clerkUser.emailAddresses[0].emailAddress },
        });
        user = existingUserByEmail;
      }
    }

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    // Delete single transaction
    const result = await db.transaction.deleteMany({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    return Response.json({ 
      success: true, 
      deletedCount: result.count,
      transactionId,
      userId: user.id 
    });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
