const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment');
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Simple prompt to verify key and connectivity
    const prompt = 'Return a short JSON: {"ok": true, "msg": "gemini test"}';

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    console.log('Gemini test raw response:', text);
  } catch (err) {
    console.error('Gemini test error:', err);
    process.exit(1);
  }
})();
