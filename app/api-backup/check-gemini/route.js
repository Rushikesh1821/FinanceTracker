export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  return Response.json({
    geminiKeySet: !!geminiKey,
    geminiKeyLength: geminiKey?.length || 0,
    geminiKeyStart: geminiKey?.substring(0, 10) || 'NOT_SET'
  });
}
