export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: '3:4' },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);

  res.status(200).json(data);
}
