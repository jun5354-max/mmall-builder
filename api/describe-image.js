export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { imageDataUrl } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  const match = imageDataUrl?.match(/^data:(.+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: 'Invalid image data' });

  const [, mimeType, base64Data] = match;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'Describe the visual style, color palette, mood, and composition of this image in 2-3 concise sentences. Focus on elements that can be reproduced as a background image.' },
            { inlineData: { mimeType, data: base64Data } },
          ],
        }],
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  res.status(200).json({ description: text });
}
