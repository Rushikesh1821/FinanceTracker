import { db } from "./prisma";

export async function getOrCreateUserByClerkId(clerkUserId) {
  if (!clerkUserId) throw new Error("Unauthorized");

  let user = await db.user.findUnique({ where: { clerkUserId: clerkUserId } });
  if (user) return user;

  // Dynamically import Clerk server helpers to avoid client-side bundling issues
  const { currentUser } = await import("@clerk/nextjs/server");
  const clerkUser = await currentUser();

  if (clerkUser) {
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (email) {
      const existingUserByEmail = await db.user.findUnique({ where: { email } });
      if (existingUserByEmail) {
        user = await db.user.update({
          where: { id: existingUserByEmail.id },
          data: { clerkUserId: clerkUserId },
        });
        return user;
      } else {
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null;
        user = await db.user.create({
          data: {
            clerkUserId: clerkUserId,
            name,
            imageUrl: clerkUser.imageUrl,
            email,
          },
        });
        return user;
      }
    }
  }

  // Fallback: create a placeholder user so flows don't 500
  const placeholderEmail = `${clerkUserId}@clerk.local`;
  user = await db.user.create({
    data: {
      clerkUserId: clerkUserId,
      email: placeholderEmail,
      name: "Unknown",
    },
  });

  return user;
}
