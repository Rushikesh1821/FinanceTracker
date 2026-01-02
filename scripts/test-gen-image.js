const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imgPath = path.resolve(__dirname, 'sample.png');
    const buffer = fs.readFileSync(imgPath);
    const base64 = buffer.toString('base64');

    console.log('Calling Gemini with image data length:', base64.length);

    const prompt = `Analyze the receipt image and return JSON: {"amount": number, "date":"ISO", "description":"string"}`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: 'image/png',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = await response.text();
    console.log('Gemini image response:', text);
  } catch (err) {
    console.error('Image test error:', err);
    process.exit(1);
  }
})();
