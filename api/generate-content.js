export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { concept, period, benefits, field, currentValue } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });

  let prompt;

  if (field === 'all') {
    prompt = `당신은 현대카드 M몰 기획전 페이지 전문 카피라이터입니다. 아래 정보를 바탕으로 기획전 컨셉에 딱 맞는 감각적인 한국어 카피를 작성해주세요.

기획전 컨셉: "${concept}"
기간: "${period}"
혜택: "${benefits}"

작성 기준:
- heroSub: 기획전 분위기를 담은 영문 대문자 서브타이틀, 3~5단어 (예: SPRING SENSATION, SUMMER ESCAPE)
- heroTitle: 컨셉을 압축한 임팩트 있는 한국어 메인 타이틀, 6~12자, 줄바꿈은 \\n
- sectionName: 섹션을 표현하는 영문 대문자 1~2단어 (예: BENEFIT, SPECIAL, SEASON)
- textTitle: 혜택과 컨셉을 담은 한국어 본문 타이틀, 14~22자, 줄바꿈은 \\n
- textDesc: 혜택을 자연스럽게 풀어쓴 한국어 설명, 30~55자, 줄바꿈은 \\n
- benefitTitle: 혜택 섹션 제목 한국어, 8~14자
- btnText: 행동 유도 버튼 텍스트 한국어, 6~10자 (예: 지금 쇼핑하기, 혜택 받기)
- couponCond: 쿠폰 적용 조건 한국어, 4~8자 (예: 5만원 이상)

JSON 형식으로만 응답 (코드블록, 설명 없이 순수 JSON만):
{
  "heroSub": "...",
  "heroTitle": "...",
  "sectionName": "...",
  "textTitle": "...",
  "textDesc": "...",
  "benefitTitle": "...",
  "btnText": "...",
  "couponCond": "..."
}`;
  } else {
    const byteLen = Buffer.byteLength(currentValue || '', 'utf8');
    const charLen = (currentValue || '').replace(/\n/g, '').length;
    const styleGuide = `현재 문구의 톤·무드·형식을 유지하되 다른 표현으로 바꿔줘. 같은 언어(한/영), 같은 문장 구조를 지켜야 해. 현재 문구와 완전히 동일한 텍스트는 절대 반환하지 마. 글자 수는 현재 ${charLen}자(${byteLen}바이트) 기준 ±20% 이내로 맞춰줘. 기획전 컨셉에 맞는 워딩을 사용해.`;
    const prompts = {
      heroSub: `현대카드 M몰 기획전 배너 영문 서브타이틀 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 영문 대문자. 텍스트만 반환.`,
      heroTitle: `현대카드 M몰 기획전 배너 메인 타이틀 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어, 줄바꿈은 \\n. 텍스트만 반환.`,
      sectionName: `현대카드 M몰 섹션명 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 영문 대문자. 텍스트만 반환.`,
      textTitle: `현대카드 M몰 본문 타이틀 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}", 혜택: "${benefits}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어, 줄바꿈은 \\n. 텍스트만 반환.`,
      textDesc: `현대카드 M몰 본문 설명 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}", 혜택: "${benefits}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어. 텍스트만 반환.`,
      benefitTitle: `현대카드 M몰 혜택 섹션 타이틀 대안 1개를 제안해줘.\n기획전 컨셉: "${concept}"\n현재 문구: "${currentValue}"\n지침: ${styleGuide} 한국어. 텍스트만 반환.`,
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
          generationConfig: {
            maxOutputTokens: field === 'all' ? 2000 : 300,
            temperature: 0.9,
          },
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
