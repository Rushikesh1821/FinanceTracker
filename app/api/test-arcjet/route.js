import aj from "@/lib/arcjet";

export async function GET(request) {
  try {
    // Test ArcJet with request object
    const decision = await aj.protect(request);
    
    return Response.json({ 
      arcjetWorking: true,
      decision: {
        id: decision.id,
        conclusion: decision.conclusion,
        isDenied: decision.isDenied(),
        reason: decision.reason,
      }
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      working: false 
    });
  }
}
