"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    console.log("Bulk delete called with:", transactionIds);
    
    const { userId } = await auth();
    if (!userId) {
      console.error("Unauthorized - no userId");
      return { success: false, error: "Unauthorized" };
    }

    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.log("User not found by clerkUserId, checking by email");
      // Check if user exists by email (might have been created with different clerkUserId)
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (clerkUser) {
        const existingUserByEmail = await db.user.findUnique({
          where: { email: clerkUser.emailAddresses[0].emailAddress },
        });
        
        if (existingUserByEmail) {
          // Update existing user with new clerkUserId
          user = await db.user.update({
            where: { id: existingUserByEmail.id },
            data: { clerkUserId: userId },
          });
          console.log("Updated user clerkUserId:", user);
        } else {
          console.error("User not found by email either");
          return { success: false, error: "User not found" };
        }
      } else {
        console.error("No clerk user found");
        return { success: false, error: "User not found" };
      }
    }

    console.log("Found user:", user.id);

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    console.log("Found transactions to delete:", transactions.length);

    if (transactions.length === 0) {
      console.log("No transactions found to delete");
      return { success: true, deletedCount: 0 };
    }

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    console.log("Account balance changes:", accountBalanceChanges);

    // Delete transactions and update account balances in a transaction
    const result = await db.$transaction(async (tx) => {
      console.log("Starting database transaction");
      
      // Delete transactions
      const deleteResult = await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });
      
      console.log("Deleted transactions count:", deleteResult.count);

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        console.log(`Updating account ${accountId} balance by ${balanceChange}`);
        const account = await tx.account.findUnique({
          where: { id: accountId },
        });
        
        if (account) {
          const newBalance = parseFloat(account.balance.toString()) + parseFloat(balanceChange.toString());
          await tx.account.update({
            where: { id: accountId },
            data: {
              balance: newBalance,
            },
          });
        }
      }
      
      console.log("Database transaction completed");
      return deleteResult.count;
    });

    console.log("Final result:", result);

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true, deletedCount: result };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // First, unset any existing default account
    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then set the new default account
    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeTransaction(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

