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
    const styleGuide = `현재 문구의 톤·무드·형식을 유지하되 단어만 바꿔줘. 같은 언어(한/영), 같은 글자 수 범위, 같은 문장 구조를 지켜야 해. 현재 문구와 완전히 동일한 텍스트는 절대 반환하지 마.`;
    const prompts = {
      heroSub: `현대카드 M몰 기획전 배너 영문 서브타이틀 대안 1개를 제안해줘.\n컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 영문 대문자 3~5단어. 텍스트만 반환.`,
      heroTitle: `현대카드 M몰 기획전 배너 메인 타이틀 대안 1개를 제안해줘.\n컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어 4~8자, 줄바꿈은 \\n. 텍스트만 반환.`,
      sectionName: `현대카드 M몰 섹션명 대안 1개를 제안해줘.\n컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 영문 대문자 1~2단어. 텍스트만 반환.`,
      textTitle: `현대카드 M몰 본문 타이틀 대안 1개를 제안해줘.\n컨셉: "${concept}", 혜택: "${benefits}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어 12~20자, 줄바꿈은 \\n. 텍스트만 반환.`,
      textDesc: `현대카드 M몰 본문 설명 대안 1개를 제안해줘.\n컨셉: "${concept}", 혜택: "${benefits}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어 20~50자. 텍스트만 반환.`,
      benefitTitle: `현대카드 M몰 혜택 섹션 타이틀 대안 1개를 제안해줘.\n컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어 6~14자. 텍스트만 반환.`,
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
