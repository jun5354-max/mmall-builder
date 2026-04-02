export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { concept, period, benefits, field, currentValue } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });

  let prompt;

  if (field === 'all') {
    prompt = `현대카드 M몰 기획전 페이지 카피를 작성해줘.

컨셉: "${concept}"
기간: "${period}"
혜택: "${benefits}"

JSON 형식으로만 응답 (다른 텍스트 없이):
{
  "heroSub": "영문 서브타이틀 (3~5단어, 예: SPRING COLLECTION)",
  "heroTitle": "메인 타이틀 (한국어 4~8자, 줄바꿈은 \\n 사용)",
  "sectionName": "섹션명 (영문 1~2단어)",
  "textTitle": "본문 타이틀 (한국어 12~20자, 줄바꿈은 \\n 사용)",
  "textDesc": "본문 설명 (한국어 20~50자, 자연스럽게, 줄바꿈은 \\n 사용)",
  "benefitTitle": "혜택 섹션 타이틀 (한국어 6~14자)",
  "btnText": "버튼 텍스트 (한국어 6~10자)",
  "couponCond": "쿠폰 조건 (한국어 4~8자)"
}`;
  } else {
    const prompts = {
      heroSub: `현대카드 M몰 기획전 배너의 영문 서브타이틀을 새로 1개 제안해줘. 컨셉: "${concept}". 현재값: "${currentValue}". 현재와 다른 방향으로, 3~5 영문 단어. 텍스트만 반환.`,
      heroTitle: `현대카드 M몰 기획전 배너 메인 타이틀을 새로 1개 제안해줘. 컨셉: "${concept}". 현재값: "${currentValue}". 현재와 다른 방향으로, 한국어 4~8자, 줄바꿈은 \\n. 텍스트만 반환.`,
      sectionName: `현대카드 M몰 섹션명을 새로 1개 제안해줘. 컨셉: "${concept}". 현재값: "${currentValue}". 영문 1~2단어. 텍스트만 반환.`,
      textTitle: `현대카드 M몰 본문 타이틀을 새로 1개 제안해줘. 컨셉: "${concept}", 혜택: "${benefits}". 현재값: "${currentValue}". 한국어 12~20자, 줄바꿈은 \\n. 텍스트만 반환.`,
      textDesc: `현대카드 M몰 본문 설명을 새로 1개 제안해줘. 컨셉: "${concept}", 혜택: "${benefits}". 현재값: "${currentValue}". 한국어 20~50자, 자연스럽게. 텍스트만 반환.`,
      benefitTitle: `현대카드 M몰 혜택 섹션 타이틀을 새로 1개 제안해줘. 컨셉: "${concept}". 현재값: "${currentValue}". 한국어 6~14자. 텍스트만 반환.`,
    };
    prompt = prompts[field];
    if (!prompt) return res.status(400).json({ error: 'Invalid field', received: field });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: field === 'all' ? 500 : 80, temperature: 0.9 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    if (field === 'all') {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        return res.status(200).json(parsed);
      } catch {
        return res.status(500).json({ error: 'JSON parse failed', raw: text });
      }
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
