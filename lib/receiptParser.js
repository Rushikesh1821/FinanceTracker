export function parseReceiptResponse(text) {
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  try {
    const data = JSON.parse(cleanedText);
    return data;
  } catch (parseError) {
    // Fallback parsing
    const amountMatch = cleanedText.match(/(?:total|amount)[:\s$]*([\d,.]+)/i);
    const dateMatch = cleanedText.match(/(\d{4}-\d{2}-\d{2})/);
    const descMatch = cleanedText.match(/description[:\s]*([^\n\r]+)/i);
    const merchantMatch = cleanedText.match(/merchant[:\s]*([^\n\r]+)/i);
    const categoryMatch = cleanedText.match(/category[:\s]*([^\n\r]+)/i);

    if (amountMatch || dateMatch || descMatch) {
      return {
        amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined,
        date: dateMatch ? dateMatch[1] : undefined,
        description: descMatch ? descMatch[1].trim() : undefined,
        merchantName: merchantMatch ? merchantMatch[1].trim() : undefined,
        category: categoryMatch ? categoryMatch[1].trim() : undefined,
      };
    }

    throw new Error("Could not extract data from Gemini response");
  }
}
