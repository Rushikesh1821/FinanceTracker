import { seedTransactions } from "@/actions/seed";

export async function POST() {
  try {
    const result = await seedTransactions();
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
