import { useState, useReducer, useRef } from "react";

const MAIN_COLORS = [
  { name:'블루', value:'#2097ff' },
  { name:'레드', value:'#fc4514' },
  { name:'그린', value:'#00b050' },
  { name:'퍼플', value:'#7c3aed' },
  { name:'오렌지', value:'#ff6b35' },
  { name:'핑크', value:'#e91e8c' },
  { name:'골드', value:'#c8962e' },
  { name:'블랙', value:'#1a1a1a' },
];

function lightenHex(hex,amount=0.55){
  const h=(hex||'#FFE100').replace('#','');
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  return '#'+[r,g,b].map(v=>Math.round(v+(255-v)*amount).toString(16).padStart(2,'0')).join('');
}
const BENEFIT_ICONS={
  coin:(c,lc)=>`<svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M71.0309 42.7114C61.3713 42.7114 53.5342 47.1702 53.5342 52.677V57.1488C53.5342 62.6491 61.3647 65.9232 71.0309 65.9232C80.6971 65.9232 88.5276 62.6556 88.5276 57.1488V52.677C88.5276 47.1767 80.6971 42.7114 71.0309 42.7114Z" fill="white" stroke="black" stroke-width="1.84476" stroke-linecap="round" stroke-linejoin="round"/><path d="M71.0309 35.1405C61.3713 35.1405 53.5342 39.5993 53.5342 45.1061V49.5779C53.5342 55.0782 61.3647 58.3523 71.0309 58.3523C80.6971 58.3523 88.5276 55.0847 88.5276 49.5779V45.1061C88.5276 39.6058 80.6971 35.1405 71.0309 35.1405Z" fill="white" stroke="black" stroke-width="1.84476" stroke-linecap="round" stroke-linejoin="round"/><path d="M88.5208 37.536C88.5208 32.0357 80.6902 27.5704 71.0241 27.5704C61.3579 27.5704 53.5273 32.0292 53.5273 37.536V42.0078C53.5273 47.5081 61.3579 50.7822 71.0241 50.7822C80.6902 50.7822 88.5208 47.5146 88.5208 42.0078V37.536Z" fill="white" stroke="black" stroke-width="1.84476" stroke-linecap="round" stroke-linejoin="round"/><path d="M71.0309 39.9312C80.6941 39.9312 88.5276 35.4694 88.5276 29.9656C88.5276 24.4617 80.6941 20 71.0309 20C61.3677 20 53.5342 24.4617 53.5342 29.9656C53.5342 35.4694 61.3677 39.9312 71.0309 39.9312Z" fill="${lc}" stroke="black" stroke-width="1.84476" stroke-linecap="round" stroke-linejoin="round"/><path d="M53.5342 35.9213C53.5342 41.4216 61.3647 44.3963 71.0309 44.3963C80.6971 44.3963 88.5276 41.4216 88.5276 35.9213V29.9589C88.5276 35.4591 78.8354 37.7048 71.0309 37.7048C64.2548 37.7048 53.5342 35.4591 53.5342 29.9589V35.9213Z" fill="white" stroke="black" stroke-width="1.84476" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.031 80.1302C49.8552 80.1302 61.062 68.9235 61.062 55.0992C61.062 41.275 49.8552 30.0682 36.031 30.0682C22.2068 30.0682 11 41.275 11 55.0992C11 68.9235 22.2068 80.1302 36.031 80.1302Z" fill="${c}" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M44.3471 62.0682H41.5888V52.0809H41.5068L37.4872 61.9247H35.539L31.5195 52.0809H31.4374V62.0682H28.6791V47.2719H32.268L36.4721 57.7616H36.5541L40.7582 47.2719H44.3471V62.0682Z" fill="black"/><path d="M36.0308 34.874C47.2303 34.8742 56.3403 43.985 56.3403 55.1846C56.3401 66.3839 47.2301 75.4939 36.0308 75.4941C24.8312 75.4941 15.7204 66.3841 15.7202 55.1846C15.7202 43.9849 24.8311 34.874 36.0308 34.874Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  free:(c,lc)=>`<svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7706 32.5425L7.33887 50.0049V66.8216H34.237V50.0049V32.5425H18.7706Z" fill="white" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.5061 36.2783V47.4805H13.46L20.7929 36.2783H30.5061Z" fill="${lc}" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.5062 50.9125H26.2046" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M82.7282 62.4027H5.85498V66.8217H82.7282V62.4027Z" fill="white" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.6616 73.9995C24.626 73.9995 27.8398 70.7858 27.8398 66.8214C27.8398 62.857 24.626 59.6432 20.6616 59.6432C16.6972 59.6432 13.4834 62.857 13.4834 66.8214C13.4834 70.7858 16.6972 73.9995 20.6616 73.9995Z" fill="black" stroke="black" stroke-width="1.60108" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.6618 70.302C22.5836 70.302 24.1415 68.7441 24.1415 66.8223C24.1415 64.9006 22.5836 63.3427 20.6618 63.3427C18.74 63.3427 17.1821 64.9006 17.1821 66.8223C17.1821 68.7441 18.74 70.302 20.6618 70.302Z" fill="white" stroke="black" stroke-width="1.60108" stroke-linecap="round" stroke-linejoin="round"/><path d="M82.7287 25.9995H34.2373V62.4027H82.7287V25.9995Z" fill="${c}" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M69.622 73.9995C73.5864 73.9995 76.8002 70.7858 76.8002 66.8214C76.8002 62.857 73.5864 59.6432 69.622 59.6432C65.6576 59.6432 62.4438 62.857 62.4438 66.8214C62.4438 70.7858 65.6576 73.9995 69.622 73.9995Z" fill="black" stroke="black" stroke-width="1.60108" stroke-linecap="round" stroke-linejoin="round"/><path d="M69.6223 70.302C71.544 70.302 73.1019 68.7441 73.1019 66.8223C73.1019 64.9006 71.544 63.3427 69.6223 63.3427C67.7005 63.3427 66.1426 64.9006 66.1426 66.8223C66.1426 68.7441 67.7005 70.302 69.6223 70.302Z" fill="white" stroke="black" stroke-width="1.60108" stroke-linecap="round" stroke-linejoin="round"/><path d="M87.0728 66.8219H92.6018" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M87.0728 62.4027H94.9181" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M87.0728 57.9891H92.6018" stroke="black" stroke-width="1.92002" stroke-linecap="round" stroke-linejoin="round"/><path d="M44.231 49.668V38.8454H51.3186V40.7129H46.496V43.6154H50.8986V45.4079H46.496V49.668H44.231ZM52.4736 49.668V41.6279H54.6636V43.0304H54.7086C54.9486 42.0404 55.6011 41.4629 56.5386 41.4629C56.7786 41.4629 57.0036 41.5004 57.1686 41.5454V43.4729C56.9886 43.3979 56.6886 43.3529 56.3736 43.3529C55.2936 43.3529 54.6636 43.9979 54.6636 45.1679V49.668H52.4736ZM61.4587 49.833C58.9987 49.833 57.5061 48.2355 57.5061 45.6629V45.6554C57.5061 43.0979 59.0137 41.4629 61.3687 41.4629C63.7237 41.4629 65.2012 43.0604 65.2012 45.4904V46.1654H59.6662C59.6887 47.4479 60.3862 48.198 61.5037 48.198C62.4037 48.198 62.9512 47.703 63.1087 47.2529L63.1237 47.2079H65.1337L65.1112 47.2904C64.8637 48.4755 63.7537 49.833 61.4587 49.833ZM61.4062 43.0979C60.5062 43.0979 59.8312 43.6979 59.6887 44.7854H63.1012C62.9662 43.6754 62.3137 43.0979 61.4062 43.0979ZM69.9937 49.833C67.5337 49.833 66.0412 48.2355 66.0412 45.6629V45.6554C66.0412 43.0979 67.5487 41.4629 69.9037 41.4629C72.2588 41.4629 73.7363 43.0604 73.7363 45.4904V46.1654H68.2012C68.2237 47.4479 68.9212 48.198 70.0387 48.198C70.9388 48.198 71.4863 47.703 71.6438 47.2529L71.6588 47.2079H73.6688L73.6463 47.2904C73.3988 48.4755 72.2888 49.833 69.9937 49.833ZM69.9412 43.0979C69.0412 43.0979 68.3662 43.6979 68.2237 44.7854H71.6363C71.5013 43.6754 70.8488 43.0979 69.9412 43.0979Z" fill="black"/></svg>`,
};

/* 쿠폰 전용 컬러 팔레트 */
const COUPON_COLORS = [
  { name:'메인 컬러', value:'__main__' },
  { name:'블루', value:'#2097ff' },
  { name:'레드', value:'#fc4514' },
  { name:'그린', value:'#00b050' },
  { name:'퍼플', value:'#7c3aed' },
  { name:'오렌지', value:'#ff6b35' },
  { name:'핑크', value:'#e91e8c' },
  { name:'골드', value:'#c8962e' },
  { name:'블랙', value:'#1a1a1a' },
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function contrastTextColor(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const toL = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  const L = 0.2126*toL(r) + 0.7152*toL(g) + 0.0722*toL(b);
  return L > 0.4 ? '#000000' : '#ffffff';
}

function genGeminiPrompt(concept, mainColor) {
  const txt = concept || '';

  /* 키비주얼 커스텀 지시 추출: "* 키 비주얼은 ..." 또는 "키비주얼: ..." */
  const kvMatch = txt.match(/[*•·\-]\s*키\s*비주얼[은이:]?\s*(.+)/s);
  const customVisual = kvMatch ? kvMatch[1].trim() : null;

  /* 컨셉 키워드 → 오브젝트 지침 */
  let objectGuide = 'elegant abstract shapes and soft light beams';

  if (/플래시|타임|긴급|한정|오늘만/.test(txt))
    objectGuide = 'bold lightning bolts, dynamic speed lines, electric sparks radiating upward — sense of urgency and energy';
  else if (/여름|썸머|summer/i.test(txt))
    objectGuide = 'tropical leaves, sun rays, soft waves, bright summer flowers arranged naturally';
  else if (/겨울|윈터|winter/i.test(txt))
    objectGuide = 'snowflakes, frosted pine branches, soft snow drifts, ice crystal patterns';
  else if (/봄|스프링|spring/i.test(txt))
    objectGuide = 'cherry blossom petals, fresh green leaves, soft pastel flower clusters';
  else if (/가을|오텀|autumn/i.test(txt))
    objectGuide = 'maple leaves, warm acorn and harvest elements, golden falling leaves';
  else if (/첫\s*구매|신규|가입|welcome/i.test(txt))
    objectGuide = 'elegant gift ribbon bow, scattered small gift boxes, welcoming soft sparkles and confetti';
  else if (/뷰티|beauty|코스메|화장품/.test(txt))
    objectGuide = 'perfume bottles, blooming flowers, soft pearl-like orbs, beauty product silhouettes';
  else if (/패션|fashion|의류|스타일/.test(txt))
    objectGuide = 'abstract fabric folds, elegant silhouette lines, minimalist clothing shapes';
  else if (/가전|디지털|전자/.test(txt))
    objectGuide = 'sleek tech device silhouettes, circuit-inspired geometric lines, glowing nodes';
  else if (/푸드|food|식품|맛/.test(txt))
    objectGuide = 'fresh ingredients, abstract food shapes, soft botanical herbs and spices';
  else if (/가\s*정\s*의\s*달|어버이\s*날|어린이\s*날|가족/.test(txt))
    objectGuide = 'pink and red carnation flowers, soft ribbon bows, warm family-themed pastel elements, delicate petals scattered gently';
  else if (/발\s*렌\s*타\s*인|valentine/i.test(txt))
    objectGuide = 'red and pink roses, heart shapes, soft ribbon bows, romantic chocolate box silhouettes';
  else if (/크\s*리\s*스\s*마\s*스|성\s*탄|christmas/i.test(txt))
    objectGuide = 'pine branches with snow, red berries, gold star ornaments, soft snowflakes';
  else if (/추\s*석|한\s*가\s*위/.test(txt))
    objectGuide = 'golden full moon, pine trees silhouette, traditional Korean lanterns, soft autumn harvest elements';
  else if (/설\s*날|새\s*해|신\s*년|명\s*절/.test(txt))
    objectGuide = 'red and gold festive elements, abstract fireworks, lucky knot patterns, soft celebratory confetti';
  else if (/웨딩|결혼|브라이덜/.test(txt))
    objectGuide = 'white roses and peonies, soft tulle fabric folds, gold ring silhouettes, elegant floral arrangements';
  else if (/세일|할인|특가|sale/i.test(txt))
    objectGuide = 'shopping bags, ribbon accents, soft confetti, celebratory balloon shapes';

  return `Hyundai Card M Mall promotional banner background. Mobile portrait 3:4 ratio.

CRITICAL LAYOUT RULE:
- TOP 30% of image: completely empty, solid color ${mainColor} background only — reserved for text overlay
- FROM 30% TO 100% (bottom): place decorative visual objects — objects must start at the 30% line with no large empty gap between text area and objects
- Objects are naturally and loosely composed — not overly crowded, breathing room is allowed between elements
- Objects should anchor at the bottom and gradually thin out upward, with the densest arrangement at the bottom 52% and lighter scattered elements up to the 30% line

Background: solid ${mainColor} color throughout. No gradients unless very subtle within the same hue.

Main visual objects (30%~100% zone, natural and airy):
${customVisual ? `CUSTOM VISUAL DIRECTION (highest priority — override defaults): ${customVisual}` : objectGuide}

Style: clean, minimal, premium, contemporary Korean luxury brand aesthetic. Soft lighting, no harsh shadows.
Objects should feel natural and elegant — not cluttered. Plenty of negative space is allowed within the object zone.
Color palette: objects should harmonize with ${mainColor}, using lighter tints, white, or soft complementary accents.

STRICT RULES — violation will ruin the image:
- ABSOLUTELY NO text, letters, numbers, words, logos, brand names, or typography of ANY kind anywhere in the image
- Do NOT include "Hyundai", "Card", "M Mall", "M몰", or any brand/product name
- Do NOT write any Korean or English characters anywhere
- NO objects in the top 30% of the image
- Objects must stay within the bottom 70% only`;
}

/* ── 모듈별 Figma 기반 기본 여백 (px) ── */
const DEFAULT_PADDING = {
  hero:     { top:0,  bottom:0  },
  text:     { top:52, bottom:40 },
  coupon:   { top:0,  bottom:30 },
  benefits: { top:60, bottom:40 },
  products: { top:0,  bottom:0  },
  button:   { top:20, bottom:20 },
  notice:   { top:24, bottom:24 },
};

function pt(m){ return m.paddingTop != null ? m.paddingTop : (DEFAULT_PADDING[m.type]?.top ?? 0); }
function pb(m){ return m.paddingBottom != null ? m.paddingBottom : (DEFAULT_PADDING[m.type]?.bottom ?? 0); }

const MODULE_TYPES = [
  { type:'hero', label:'이미지 배너', icon:'🖼️' },
  { type:'text', label:'텍스트', icon:'📝' },
  { type:'coupon', label:'쿠폰', icon:'🎟️' },
  { type:'benefits', label:'혜택', icon:'🎁' },
  { type:'products', label:'상품리스트', icon:'🛍️' },
  { type:'button', label:'버튼', icon:'🔘' },
  { type:'notice', label:'유의사항', icon:'📋' },
];

/* ──── 생성 이미지에서 배경 대표색 추출 ──── */
function extractBgColor(base64Src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      /* 상단 10~20% 중앙 → 텍스트 오버레이 영역 = 순수 배경색 */
      const samplePoints = [
        { x: Math.floor(img.width * 0.5), y: Math.floor(img.height * 0.10) },
        { x: Math.floor(img.width * 0.3), y: Math.floor(img.height * 0.15) },
        { x: Math.floor(img.width * 0.7), y: Math.floor(img.height * 0.15) },
      ];
      let r = 0, g = 0, b = 0;
      samplePoints.forEach(p => {
        const d = ctx.getImageData(p.x, p.y, 1, 1).data;
        r += d[0]; g += d[1]; b += d[2];
      });
      r = Math.round(r / samplePoints.length);
      g = Math.round(g / samplePoints.length);
      b = Math.round(b / samplePoints.length);
      /* 채도 부스트 */
      const rn=r/255,gn=g/255,bn=b/255;
      const max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn);
      let h=0,s=0,l=(max+min)/2;
      if(max!==min){
        const d=max-min;
        s=l>0.5?d/(2-max-min):d/(max+min);
        if(max===rn)h=(gn-bn)/d+(gn<bn?6:0);
        else if(max===gn)h=(bn-rn)/d+2;
        else h=(rn-gn)/d+4;
        h/=6;
      }
      s=Math.min(1,s*1.5);
      const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;
      const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
      const [fr,fg,fb]=s===0?[l,l,l]:[hue2rgb(p,q,h+1/3),hue2rgb(p,q,h),hue2rgb(p,q,h-1/3)];
      resolve('#'+[fr,fg,fb].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join(''));
    };
    img.onerror = () => resolve(null);
    img.src = base64Src;
  });
}

/* ──── Imagen 4 API (Vercel 서버리스 프록시) ──── */
async function callNanoBanana(prompt) {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`이미지 생성 오류: ${res.status} — ${errText}`);
  }
  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  const mime = data.predictions?.[0]?.mimeType || 'image/png';
  if (!b64) throw new Error('이미지 데이터 없음');
  return `data:${mime};base64,${b64}`;
}

/* ──── 참고 이미지 분석 (Gemini Vision 프록시) ──── */
async function describeRefImage(imageDataUrl) {
  const res = await fetch('/api/describe-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl }),
  });
  if (!res.ok) return '';
  const data = await res.json();
  return data.description || '';
}

const DEFAULT_MODULES = [
  { id:'1', type:'hero', height:520, subtitle:'Welcome M·MALL', title:'첫 구매 혜택', date:'2025. 9. 4 ~ 9. 30', heroImage:null },
  { id:'2', type:'text', sectionName:'BENEFIT', showSectionName:true, showTitle:true, showDescription:true, title:'첫 구매 고객을 위한\n최고의 혜택', description:'신규 고객 한정 최대 30% 할인과\n5,000원 쿠폰을 지금 받으세요.', textAlign:'center' },
  { id:'3', type:'coupon', condition:'첫 구매 고객', amount:'5,000', unit:'원', period:'2025.09.30까지', exclusion:'일부 상품 제외', showExclusion:true, couponColor:null },
  { id:'4', type:'benefits', title:'기획전 특가 혜택', benefits:[{icon:'coin',title:'5,000원 쿠폰',subtitle:'전체 고객 한정'},{icon:'free',title:'무료 배송',subtitle:'전 상품'}] },
  { id:'5', type:'products', tabs:[{id:'tab1',name:'패션'},{id:'tab2',name:'뷰티'}], categories:{ tab1:{ title:'패션 신상품', products:[{brand:'BRAND A',name:'프리미엄 코튼 티셔츠',price:29900,discount:30,img:''},{brand:'BRAND B',name:'슬림핏 데님 팬츠',price:49900,discount:20,img:''},{brand:'BRAND C',name:'캐시미어 니트',price:39900,discount:25,img:''},{brand:'BRAND D',name:'오버핏 셔츠',price:34900,discount:15,img:''}]}, tab2:{ title:'뷰티 추천', products:[{brand:'COSME A',name:'히알루론 에센스',price:19900,discount:20,img:''},{brand:'COSME B',name:'수분 크림',price:29900,discount:25,img:''},{brand:'COSME C',name:'시카 마스크팩',price:15900,discount:30,img:''},{brand:'COSME D',name:'비타민 토너',price:22900,discount:15,img:''}]}} },
  { id:'6', type:'button', text:'전체 상품 보기', borderRadius:8 },
  { id:'7', type:'notice', sections:[{id:'s1',title:'확인해 주세요',items:['해당 프로모션은 2026년 GOOD FRIENDSHIP에 한하여 적용 가능합니다.','M몰은 모든 현대카드로 결제 가능합니다.(일부 법인·체크 카드 및 하이브리드·선불·Gift카드 등 제외)','해당 프로모션은 M몰 및 제휴사 사정에 따라 변경 또는 중단될 수 있습니다.','해당 프로모션의 대상 상품은 한정 수량으로 조기 품절되거나 변경될 수 있습니다.']},{id:'s2',title:'[M몰 할인 쿠폰]',items:['쿠폰 다운로드 및 사용은 프로모션 기간 내에만 가능합니다.','다운로드한 할인 쿠폰은 프로모션 기간 내 대상 상품에 한하여 1회 사용 가능합니다.','쿠폰을 다운로드하신 후, 주문서에서 해당 쿠폰을 적용하여 결제해 주세요.']}] },
];

function moduleReducer(state, action) {
  switch(action.type) {
    case 'SET': return action.payload;
    case 'ADD': return [...state, action.payload];
    case 'UPDATE': return state.map(m => m.id===action.id ? {...m,...action.updates} : m);
    case 'DELETE': return state.filter(m => m.id!==action.id);
    case 'DUPLICATE': {
      const src = state.find(m=>m.id===action.id);
      if(!src) return state;
      const idx = state.indexOf(src);
      const clone = {...src, id:'m'+Date.now()};
      const ns = [...state]; ns.splice(idx+1,0,clone);
      return ns;
    }
    default: return state;
  }
}

/* ──── Styles ──── */
const font = "'Pretendard Variable',-apple-system,BlinkMacSystemFont,sans-serif";
const S = {
  wrap: { display:'flex', flexDirection:'column', height:'100vh', fontFamily:font, background:'#f5f5f5' },
  topbar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:'#ffffff', borderBottom:'1px solid #e5e5e5', flexShrink:0, zIndex:10 },
  mainRow: { display:'flex', flex:1, overflow:'hidden' },
  left: { width:300, background:'#ffffff', borderRight:'1px solid #e5e5e5', overflowY:'auto', display:'flex', flexDirection:'column', flexShrink:0 },
  leftHead: { padding:'20px 20px 14px', borderBottom:'1px solid #e5e5e5' },
  leftTitle: { fontSize:15, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.3px' },
  leftSub: { fontSize:11, color:'rgba(0,0,0,0.4)', marginTop:3 },
  leftBody: { padding:'16px 20px', flex:1 },
  editor: { width:300, background:'#ffffff', borderLeft:'1px solid #e5e5e5', overflowY:'auto', display:'flex', flexDirection:'column', flexShrink:0 },
  editorHead: { padding:'20px 20px 14px', borderBottom:'1px solid #e5e5e5' },
  editorBody: { padding:'16px 20px', flex:1 },
  center: { flex:1, display:'flex', justifyContent:'center', alignItems:'flex-start', padding:24, overflowY:'auto', background:'#f5f5f5' },
  section: { marginBottom:24, paddingBottom:18, borderBottom:'1px solid #f0f0f0' },
  panelTitle: { fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:12 },
  label: { display:'block', fontSize:12, fontWeight:600, marginBottom:6, color:'rgba(0,0,0,0.55)', fontFamily:font },
  input: { width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #e5e5e5', background:'#ffffff', color:'#1a1a1a', fontSize:13, outline:'none', fontFamily:font, boxSizing:'border-box' },
  textarea: { width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #e5e5e5', background:'#ffffff', color:'#1a1a1a', fontSize:13, minHeight:60, resize:'vertical', outline:'none', fontFamily:font, boxSizing:'border-box', lineHeight:'20px' },
  colorChip: (active) => ({ width:24, height:24, borderRadius:6, border: active ? '2px solid #1a1a1a' : '2px solid #e5e5e5', cursor:'pointer', flexShrink:0 }),
  genBtn: { width:'100%', padding:14, background:'#1a1a1a', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:font },
  modItem: (active) => ({ display:'flex', alignItems:'center', gap:6, padding:'8px 10px', marginBottom:3, backgroundColor: active ? '#f5f5f5' : 'transparent', borderRadius:10, cursor:'pointer', border: active ? '1px solid #e5e5e5' : '1px solid transparent' }),
  modName: { flex:1, fontSize:12, fontWeight:500, color:'#1a1a1a' },
  iconBtn: { padding:'4px 5px', background:'transparent', border:'none', cursor:'pointer', fontSize:13, color:'rgba(0,0,0,0.28)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' },
  addBtn: { width:'100%', padding:10, background:'#f5f5f5', color:'rgba(0,0,0,0.4)', border:'1px dashed #d5d5d5', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:font },
  addMenu: (open) => ({ position:'absolute', top:'100%', left:0, right:0, background:'#fff', borderRadius:10, marginTop:4, zIndex:10, border:'1px solid #e5e5e5', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.08)', display: open ? 'block' : 'none' }),
  addMenuItem: { display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', color:'#1a1a1a', border:'none', borderBottom:'1px solid #f5f5f5', textAlign:'left', cursor:'pointer', fontSize:12, fontFamily:font },
  subCard: { padding:12, background:'#fafafa', border:'1px solid #f0f0f0', borderRadius:10, marginBottom:8 },
  smallBtn: (type) => ({ padding:'5px 10px', borderRadius:6, fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:font, background: type==='accent' ? '#1a1a1a' : '#fff', color: type==='accent' ? '#fff' : '#ff3b30', border: type==='accent' ? 'none' : '1px solid #f0f0f0' }),
  hint: { padding:'10px 12px', background:'#f5f5f5', borderRadius:8, fontSize:11, color:'rgba(0,0,0,0.4)', marginTop:10 },
  toggle: (on) => ({ display:'inline-flex', alignItems:'center', padding:'6px 10px', borderRadius:6, border:'1px solid', borderColor: on ? '#1a1a1a' : '#e5e5e5', background: on ? '#1a1a1a' : '#fff', color: on ? '#fff' : 'rgba(0,0,0,0.45)', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:font }),
  /* 인라인 미니 토글 (라벨 우측) */
  miniToggle: (on) => ({ width:32, height:18, borderRadius:9, background: on ? '#1a1a1a' : '#d5d5d5', position:'relative', cursor:'pointer', border:'none', flexShrink:0, transition:'background 0.15s' }),
  miniToggleKnob: (on) => ({ position:'absolute', top:2, left: on ? 16 : 2, width:14, height:14, borderRadius:7, background:'#fff', transition:'left 0.15s', boxShadow:'0 1px 2px rgba(0,0,0,0.15)' }),
  divider: { height:1, background:'#f0f0f0', margin:'16px 0' },
};

const pm = (sel) => ({ cursor:'pointer', outline: sel ? '2px solid #1a1a1a' : 'none', outlineOffset:-2 });

/* ──── 공통 컴포넌트 ──── */
function MiniToggle({on,onToggle}){
  return <button style={S.miniToggle(on)} onClick={e=>{e.stopPropagation();onToggle();}}>
    <div style={S.miniToggleKnob(on)}/>
  </button>;
}

function Divider(){ return <div style={S.divider}/>; }

/* ──── Spacing Editor (상/하 개별, 10px 단위) ──── */
function SpacingEditor({m,onUpdate}){
  const pT = pt(m), pB = pb(m);
  const btnStyle = {width:28,height:28,borderRadius:6,border:'1px solid #e5e5e5',background:'#fff',fontSize:14,cursor:'pointer',color:'#1a1a1a',fontFamily:font,display:'flex',alignItems:'center',justifyContent:'center'};
  const row = (label, val, key) => (
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
      <span style={{fontSize:11,fontWeight:600,color:'rgba(0,0,0,0.45)',width:24,flexShrink:0}}>{label}</span>
      <button onClick={()=>onUpdate({[key]:Math.max(0,val-10)})} style={btnStyle}>-</button>
      <div style={{flex:1,textAlign:'center',fontSize:13,fontWeight:600,color:'#1a1a1a'}}>{val}px</div>
      <button onClick={()=>onUpdate({[key]:Math.min(120,val+10)})} style={btnStyle}>+</button>
    </div>
  );
  return <div style={{marginBottom:14}}>
    <label style={S.label}>여백</label>
    {row('상', pT, 'paddingTop')}
    {row('하', pB, 'paddingBottom')}
  </div>;
}

/* ──── Preview Components ──── */
function HeroBanner({m,sel,onSel,mainColor,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  const hasImg = !!m.heroImage;
  const skeletonBase = {borderRadius:6,background:'rgba(255,255,255,0.18)',animation:'mmall-pulse 1.4s ease-in-out infinite'};
  return <div style={{...pm(sel),width:'100%',backgroundColor:imgLoading?'#c8c8c8':mainColor,height:m.height,display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',position:'relative',overflow:'hidden',paddingTop:pTop,paddingBottom:pBot,transition:'background-color 0.3s'}} onClick={onSel}>
    <style>{`@keyframes mmall-pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes mmall-fadein{from{opacity:0}to{opacity:1}}`}</style>
    {hasImg && !imgLoading && <img src={m.heroImage} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',animation:'mmall-fadein 0.7s ease'}}/>}
    {!hasImg && !imgLoading && <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.08) 0%, transparent 60%)'}}/>}
    <div style={{marginTop:90,position:'relative',zIndex:1,textAlign:'center',padding:'0 24px',width:'100%'}}>
      {imgLoading ? <>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
          <div style={{...skeletonBase,height:18,width:160}}/>
        </div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          <div style={{...skeletonBase,height:52,width:220,borderRadius:10}}/>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
          <div style={{...skeletonBase,height:14,width:140}}/>
        </div>
      </> : (()=>{
        const tc = contrastTextColor(mainColor);
        const tcSub = tc === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)';
        const subtitleColor = m.subtitleColor || tc;
        const titleColor = m.titleColor || tc;
        const dateColor = m.dateColor || tcSub;
        return <div style={{animation:'mmall-fadein 0.6s ease'}}>
          <div contentEditable suppressContentEditableWarning style={{fontSize:22,fontWeight:'bold',color:subtitleColor,opacity:0.9,fontFamily:font,cursor:'text',marginBottom:0}}>{m.subtitle}</div>
          <div contentEditable suppressContentEditableWarning style={{fontSize:40,fontWeight:800,color:titleColor,letterSpacing:0,margin:'16px 0',lineHeight:1.2,fontFamily:font,cursor:'text'}}>{m.title}</div>
          <div contentEditable suppressContentEditableWarning style={{fontSize:18,fontWeight:600,color:dateColor,fontFamily:font,cursor:'text'}}>{m.date}</div>
        </div>;
      })()}
    </div>
  </div>;
}

/* ── 스켈레톤 바 공통 컴포넌트 ── */
function Skel({w='100%',h=14,r=6,mt=0,mb=0,mx='auto'}){
  return <div style={{width:w,height:h,borderRadius:r,background:'#e8e8e8',animation:'mmall-pulse 1.4s ease-in-out infinite',marginTop:mt,marginBottom:mb,marginLeft:mx==='auto'?'auto':0,marginRight:mx==='auto'?'auto':0}}/>;
}

function TextSection({m,sel,onSel,mainColor,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  return <div style={{...pm(sel),width:'100%',backgroundColor:'#fff',paddingTop:pTop,paddingBottom:pBot,paddingLeft:24,paddingRight:24,textAlign:m.textAlign||'center'}} onClick={onSel}>
    {imgLoading ? <>
      <Skel w={80} h={12} mb={14}/>
      <Skel w={200} h={28} r={8} mb={12}/>
      <Skel w={220} h={16} mb={6}/>
      <Skel w={180} h={16}/>
    </> : <div style={{animation:'mmall-fadein 0.6s ease'}}>
      {m.showSectionName!==false && m.sectionName && <div contentEditable suppressContentEditableWarning style={{fontSize:14,fontWeight:700,color:mainColor,marginBottom:12,letterSpacing:'0.5px',cursor:'text',fontFamily:font}}>{m.sectionName}</div>}
      {m.showTitle!==false && <div contentEditable suppressContentEditableWarning style={{fontSize:26,fontWeight:'bold',color:'#000',marginBottom:12,lineHeight:'36px',whiteSpace:'pre-wrap',cursor:'text',fontFamily:font}}>{m.title}</div>}
      {m.showDescription!==false && <div contentEditable suppressContentEditableWarning style={{fontSize:16,color:'rgba(0,0,0,0.65)',lineHeight:'26px',whiteSpace:'pre-wrap',cursor:'text',fontFamily:font}}>{m.description}</div>}
    </div>}
  </div>;
}

function CouponMod({m,sel,onSel,mainColor,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  const cardColor = imgLoading ? '#d0d0d0' : ((m.couponColor && m.couponColor!=='__main__') ? m.couponColor : mainColor);
  const txtColor=contrastTextColor(imgLoading?'#d0d0d0':cardColor);
  const subTxtColor=txtColor==='#ffffff'?'rgba(255,255,255,0.55)':'rgba(0,0,0,0.5)';
  const dashColor=txtColor==='#ffffff'?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.15)';
  return <div style={{...pm(sel),width:'100%',backgroundColor:'#fff',paddingTop:pTop,paddingBottom:pBot,paddingLeft:24,paddingRight:24,display:'flex',flexDirection:'column',alignItems:'center'}} onClick={onSel}>
    <div style={{width:327,backgroundColor:cardColor,borderRadius:12,padding:'28px 24px 20px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',left:-16,top:'50%',transform:'translateY(-50%)',width:32,height:32,backgroundColor:'#fff',borderRadius:'50%'}}/>
      <div style={{position:'absolute',right:-16,top:'50%',transform:'translateY(-50%)',width:32,height:32,backgroundColor:'#fff',borderRadius:'50%'}}/>
      {imgLoading ? <>
        <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><Skel w={100} h={14} r={6}/></div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}><Skel w={120} h={44} r={8}/></div>
        <div style={{borderTop:`1.5px dashed ${dashColor}`,margin:'0 0 14px'}}/>
        <div style={{display:'flex',justifyContent:'center'}}><Skel w={140} h={12} r={6}/></div>
      </> : <div style={{animation:'mmall-fadein 0.6s ease'}}>
        <div contentEditable suppressContentEditableWarning style={{fontSize:16,fontWeight:'bold',color:txtColor,marginBottom:8,textAlign:'center',cursor:'text',fontFamily:font}}>{m.condition}</div>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:2,marginBottom:16}}>
          <span contentEditable suppressContentEditableWarning style={{fontSize:40,fontWeight:800,color:txtColor,lineHeight:1,cursor:'text',fontFamily:font}}>{m.amount}</span>
          <span contentEditable suppressContentEditableWarning style={{fontSize:28,fontWeight:'bold',color:txtColor,cursor:'text',fontFamily:font}}>{m.unit}</span>
        </div>
        <div style={{borderTop:`1.5px dashed ${dashColor}`,margin:'0 0 14px'}}/>
        <div contentEditable suppressContentEditableWarning style={{fontSize:14,fontWeight:500,color:subTxtColor,textAlign:'center',cursor:'text',fontFamily:font}}>{m.period}</div>
      </div>}
    </div>
    <div style={{width:327,height:56,marginTop:16,borderRadius:8,backgroundColor:imgLoading?'#d0d0d0':'#000',animation:imgLoading?'mmall-pulse 1.4s ease-in-out infinite':'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
      {!imgLoading && <span style={{fontSize:16,fontWeight:'bold',color:'#fff',fontFamily:font}}>쿠폰 받기</span>}
    </div>
    {!imgLoading && m.showExclusion!==false && m.exclusion && <div contentEditable suppressContentEditableWarning style={{fontSize:14,color:'rgba(0,0,0,0.5)',marginTop:8,cursor:'text',fontFamily:font}}>* {m.exclusion}</div>}
  </div>;
}

function BenefitsMod({m,sel,onSel,mainColor,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  return <div style={{...pm(sel),width:'100%',backgroundColor:imgLoading?'#f0f0f0':hexToRgba(mainColor,0.1),paddingTop:pTop,paddingBottom:pBot,paddingLeft:24,paddingRight:24}} onClick={onSel}>
    {imgLoading
      ? <div style={{display:'flex',justifyContent:'center',marginBottom:24}}><Skel w={160} h={24} r={8}/></div>
      : <div style={{fontSize:26,fontWeight:'bold',color:'#000',textAlign:'center',marginBottom:24,fontFamily:font,animation:'mmall-fadein 0.6s ease'}}>{m.title}</div>
    }
    <div style={{background:'#fff',borderRadius:12,padding:'24px 0',display:'flex'}}>
      {(imgLoading ? [0,1] : m.benefits||[]).map((_,i)=><div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',borderRight:i<(imgLoading?1:(m.benefits?.length||1)-1)?'1px solid #e5e5e5':'none'}}>
        {imgLoading ? <>
          <Skel w={32} h={32} r={16} mb={10}/>
          <Skel w={80} h={14} r={6} mb={6}/>
          <Skel w={60} h={12} r={6}/>
        </> : <>
          {BENEFIT_ICONS[m.benefits[i].icon]
            ? <div dangerouslySetInnerHTML={{__html:BENEFIT_ICONS[m.benefits[i].icon](mainColor||'#FFE100',lightenHex(mainColor||'#FFE100'))}} style={{width:48,height:48,marginBottom:10}}/>
            : <div style={{fontSize:32,marginBottom:10}}>{m.benefits[i].icon}</div>
          }
          <div style={{fontSize:16,fontWeight:600,color:'#000',marginBottom:4,fontFamily:font}}>{m.benefits[i].title}</div>
          <div style={{fontSize:14,color:'rgba(0,0,0,0.5)',fontFamily:font}}>{m.benefits[i].subtitle}</div>
        </>}
      </div>)}
    </div>
  </div>;
}

function ProductsMod({m,sel,onSel,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  const [tab,setTab]=useState(m.tabs?.[0]?.id||'tab1');
  const cat=m.categories?.[tab];
  return <div style={{...pm(sel),width:'100%',backgroundColor:'#fff',overflow:'hidden',paddingTop:pTop,paddingBottom:pBot}} onClick={onSel}>
    <div style={{display:'flex',borderBottom:'1px solid #e5e5e5',padding:'0 24px',background:'#fff'}}>
      {m.tabs?.map(t=><button key={t.id} onClick={e=>{e.stopPropagation();setTab(t.id);}} style={{padding:'14px 16px',background:'transparent',border:'none',fontSize:14,fontWeight:tab===t.id?'bold':'normal',color:'#000',cursor:'pointer',borderBottom:tab===t.id?'3px solid #000':'3px solid transparent',fontFamily:font,position:'relative',top:1}}>{t.name}</button>)}
    </div>
    <div style={{padding:'20px 24px 8px',background:'#fff'}}>
      {imgLoading ? <Skel w={120} h={20} r={6}/> : <div style={{fontSize:20,fontWeight:'bold',color:'#000',fontFamily:font}}>{cat?.title}</div>}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,padding:'12px 24px 24px',background:'#fff'}}>
      {(imgLoading ? [0,1,2,3] : cat?.products||[]).map((p,i)=><div key={i}>
        <div style={{width:'100%',aspectRatio:'1/1',backgroundColor:'#e8e8e8',borderRadius:12,marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:28,animation:imgLoading?'mmall-pulse 1.4s ease-in-out infinite':'none'}}>
          {!imgLoading && (p.img?<img src={p.img} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:12}} alt=""/>:'📷')}
        </div>
        {imgLoading ? <>
          <Skel w="60%" h={10} r={4} mb={4}/>
          <Skel w="90%" h={14} r={4} mb={6}/>
          <Skel w="50%" h={12} r={4}/>
        </> : <>
          <div style={{fontSize:12,color:'rgba(0,0,0,0.5)',marginBottom:2,fontFamily:font}}>{p.brand}</div>
          <div style={{fontSize:14,fontWeight:600,color:'#000',marginBottom:4,lineHeight:'20px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',fontFamily:font}}>{p.name}</div>
          <div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:14,color:'#fc4514',fontWeight:700,fontFamily:font}}>{p.discount}%</span><span style={{fontSize:14,fontWeight:700,color:'#000',fontFamily:font}}>{Math.round(p.price*(1-p.discount/100)).toLocaleString()}원</span></div>
          <div style={{fontSize:12,color:'rgba(0,0,0,0.35)',textDecoration:'line-through',marginTop:2,fontFamily:font}}>{p.price.toLocaleString()}원</div>
        </>}
      </div>)}
    </div>
  </div>;
}

function CTABtn({m,sel,onSel,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  return <div style={{...pm(sel),width:'100%',paddingTop:pTop,paddingBottom:pBot,paddingLeft:24,paddingRight:24,display:'flex',justifyContent:'center',background:'#fff'}} onClick={onSel}>
    <div style={{width:327,height:56,backgroundColor:imgLoading?'#d0d0d0':'#000',border:'none',borderRadius:m.borderRadius||8,display:'flex',alignItems:'center',justifyContent:'center',animation:imgLoading?'mmall-pulse 1.4s ease-in-out infinite':'none'}}>
      {!imgLoading && <span style={{fontSize:16,fontWeight:'bold',color:'#fff',fontFamily:font}}>{m.text}</span>}
    </div>
  </div>;
}

function NoticeMod({m,sel,onSel,imgLoading}){
  const pTop = pt(m), pBot = pb(m);
  return <div style={{...pm(sel),width:'100%',backgroundColor:'#fff',paddingTop:pTop+24,paddingBottom:pBot+24,paddingLeft:24,paddingRight:24}} onClick={onSel}>
    {imgLoading ? <>
      <Skel w={120} h={16} r={6} mb={12}/>
      {[100,90,80,95,85].map((w,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
        <div style={{width:4,height:4,borderRadius:'50%',background:'#e0e0e0',flexShrink:0}}/>
        <Skel w={`${w}%`} h={12} r={4}/>
      </div>)}
    </> : m.sections?.map((s,si)=><div key={s.id} style={{marginBottom:si<m.sections.length-1?24:0}}>
      <div style={{fontSize:si===0?16:14,fontWeight:'bold',color:'#000',marginBottom:12,fontFamily:font}}>{s.title}</div>
      {s.items?.map((item,ii)=><div key={ii} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'3px 0'}}>
        <div style={{width:2,height:2,borderRadius:'50%',background:'rgba(0,0,0,0.4)',marginTop:10,flexShrink:0}}/>
        <div style={{fontSize:14,color:'rgba(0,0,0,0.64)',lineHeight:'22px',flex:1,fontFamily:font}}>{item}</div>
      </div>)}
      {si<m.sections.length-1&&<div style={{borderTop:'1px solid rgba(0,0,0,0.08)',marginTop:16}}/>}
    </div>)}
  </div>;
}

/* ──── Module Editor (오른쪽 패널) ──── */
function ModuleEditor({m,up,concept,benefits,mainColor,onRegenerate,imgLoading}){
  if(!m)return null;
  const [promptCopied,setPromptCopied]=useState(false);
  const [refreshing,setRefreshing]=useState(null);
  const tc = contrastTextColor(mainColor || '#2097ff');
  const tcSub = tc === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)';

  const refreshField = async (field, currentValue, onDone) => {
    setRefreshing(field);
    try {
      const resp = await fetch('/api/generate-content', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({concept, benefits, field, currentValue}),
      });
      if(resp.ok){ const d=await resp.json(); if(d.text) onDone(d.text); }
    } catch(_){}
    setRefreshing(null);
  };

  const RefreshBtn = ({field, value, onDone}) => (
    <button onClick={()=>refreshField(field,value,onDone)}
      disabled={refreshing===field}
      style={{background:'none',border:'none',cursor:refreshing===field?'not-allowed':'pointer',fontSize:13,color:'rgba(0,0,0,0.35)',padding:'0 2px',lineHeight:1,display:'flex',alignItems:'center',opacity:refreshing===field?0.4:1}}>
      {refreshing===field?'…':'↺'}
    </button>
  );

  const ColorBtn = ({value, defaultColor, onChange}) => {
    const displayColor = value || defaultColor || '#ffffff';
    return (
      <div style={{position:'relative',width:24,height:24,flexShrink:0,cursor:'pointer'}}>
        <input type="color" value={displayColor} onChange={onChange}
          style={{position:'absolute',opacity:0,inset:0,width:'100%',height:'100%',cursor:'pointer',border:'none',padding:0}}/>
        <div style={{width:24,height:24,borderRadius:8,border:'1.5px solid #e0e0e0',backgroundColor:displayColor,pointerEvents:'none'}}/>
      </div>
    );
  };
  const [editPrompt,setEditPrompt]=useState('');
  const [promptReady,setPromptReady]=useState(false);
  const [refMode,setRefMode]=useState('none'); /* 'none' | 'current' | 'upload' */
  const [uploadedRef,setUploadedRef]=useState(null);
  const [editInstruction,setEditInstruction]=useState('');
  const fileRef = useRef(null);
  const refFileRef = useRef(null);

  const handleImageFile = (file) => {
    if(!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => up({heroImage:e.target.result});
    reader.readAsDataURL(file);
  };

  const heightBtnStyle = {width:28,height:28,borderRadius:6,border:'1px solid #e5e5e5',background:'#fff',fontSize:14,cursor:'pointer',color:'#1a1a1a',fontFamily:font,display:'flex',alignItems:'center',justifyContent:'center'};

  switch(m.type){
    case 'hero': {
      const autoPrompt = genGeminiPrompt(concept, mainColor);
      if(!promptReady){ setEditPrompt(autoPrompt); setPromptReady(true); }
      return <div>
        {/* 텍스트 편집 */}
        <div style={{marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
            <label style={{...S.label,marginBottom:0}}>서브타이틀</label>
            <RefreshBtn field="heroSub" value={m.subtitle} onDone={t=>up({subtitle:t})}/>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <input style={{...S.input,flex:1}} value={m.subtitle||''} onChange={e=>up({subtitle:e.target.value})}/>
            <ColorBtn value={m.subtitleColor} defaultColor={tc} onChange={e=>up({subtitleColor:e.target.value})}/>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
            <label style={{...S.label,marginBottom:0}}>메인 타이틀</label>
            <RefreshBtn field="heroTitle" value={m.title} onDone={t=>up({title:t})}/>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <input style={{...S.input,flex:1}} value={m.title||''} onChange={e=>up({title:e.target.value})}/>
            <ColorBtn value={m.titleColor} defaultColor={tc} onChange={e=>up({titleColor:e.target.value})}/>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>날짜</label>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <input style={{...S.input,flex:1}} value={m.date||''} onChange={e=>up({date:e.target.value})}/>
            <ColorBtn value={m.dateColor} defaultColor={tc === '#ffffff' ? '#cccccc' : '#666666'} onChange={e=>up({dateColor:e.target.value})}/>
          </div>
        </div>

        <Divider/>

        {/* 배경 이미지 */}
        <div style={{marginBottom:14}}>
          <label style={S.label}>배경 이미지</label>
          <div
            onDrop={e=>{e.preventDefault();e.stopPropagation();handleImageFile(e.dataTransfer.files?.[0]);}}
            onDragOver={e=>{e.preventDefault();e.stopPropagation();}}
            onPaste={e=>{const items=e.clipboardData?.items;for(let i=0;i<(items?.length||0);i++){if(items[i].type.startsWith('image/')){handleImageFile(items[i].getAsFile());break;}}}}
            tabIndex={0}
            style={{border: m.heroImage ? '1px solid #e5e5e5' : '2px dashed #d5d5d5',borderRadius:10,padding: m.heroImage ? 0 : '20px 12px',textAlign:'center',cursor:'pointer',background: m.heroImage ? 'transparent' : '#fafafa',position:'relative',overflow:'hidden',minHeight: m.heroImage ? 0 : 80}}
            onClick={()=>fileRef.current?.click()}
          >
            {m.heroImage ? (
              <div style={{position:'relative'}}>
                <img src={m.heroImage} alt="" style={{width:'100%',borderRadius:10,display:'block'}}/>
                <button onClick={e=>{e.stopPropagation();up({heroImage:null});}} style={{position:'absolute',top:6,right:6,width:24,height:24,borderRadius:12,background:'rgba(0,0,0,0.6)',color:'#fff',border:'none',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
              </div>
            ) : (
              <div>
                <div style={{fontSize:24,marginBottom:6}}>📷</div>
                <div style={{fontSize:11,color:'rgba(0,0,0,0.4)',lineHeight:'18px'}}>클릭하여 이미지 선택<br/>또는 드래그 & 드롭 / 붙여넣기(Ctrl+V)</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{handleImageFile(e.target.files?.[0]);e.target.value='';}}/>
          </div>
        </div>
        <div style={{padding:12,background:'#fafafa',border:'1px solid #f0f0f0',borderRadius:10,marginBottom:14}}>
          {/* 참고 이미지 모드 선택 */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:'#1a1a1a',marginBottom:6}}>참고 이미지</div>
            <div style={{display:'flex',gap:4}}>
              {[['none','프롬프트 편집'],['current','현재 이미지 기반']].map(([v,l])=>(
                <button key={v} onClick={()=>{setRefMode(v);if(v!=='upload')setUploadedRef(null);}}
                  style={{flex:1,padding:'6px 4px',borderRadius:7,border:'1px solid',borderColor:refMode===v?'#1a1a1a':'#e5e5e5',background:refMode===v?'#1a1a1a':'#fff',color:refMode===v?'#fff':'rgba(0,0,0,0.5)',fontSize:10,fontWeight:600,cursor:'pointer',fontFamily:font,lineHeight:'14px'}}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* 참고 이미지 없음: 전체 프롬프트 편집 */}
          {refMode==='none' && <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <span style={{fontSize:11,fontWeight:700,color:'#1a1a1a'}}>이미지 생성 프롬프트</span>
              <button onClick={()=>{navigator.clipboard.writeText(editPrompt);setPromptCopied(true);setTimeout(()=>setPromptCopied(false),2000);}} style={{...S.smallBtn('accent'),borderRadius:6}}>{promptCopied?'복사됨!':'복사'}</button>
            </div>
            <textarea value={editPrompt} onChange={e=>setEditPrompt(e.target.value)}
              style={{...S.textarea,fontSize:10,lineHeight:'16px',minHeight:100,color:'rgba(0,0,0,0.6)',background:'#fff',border:'1px solid #f0f0f0',borderRadius:6,padding:8,marginBottom:8}}/>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setEditPrompt(autoPrompt)} style={{...S.smallBtn(),flex:1,padding:'7px 0',borderRadius:8,fontSize:11}}>초기화</button>
              <button onClick={()=>onRegenerate&&onRegenerate(editPrompt,null)} disabled={imgLoading}
                style={{flex:2,padding:'7px 0',borderRadius:8,fontSize:11,fontWeight:700,cursor:imgLoading?'not-allowed':'pointer',fontFamily:font,background:imgLoading?'#ccc':'#1a1a1a',color:'#fff',border:'none',opacity:imgLoading?0.6:1}}>
                {imgLoading?'생성 중...':'🎨 이미지 재생성'}
              </button>
            </div>
          </>}

          {/* 참고 이미지 있음: 수정 지시 입력 */}
          {refMode!=='none' && <>
            <div style={{marginBottom:6}}>
              <span style={{fontSize:11,fontWeight:700,color:'#1a1a1a'}}>수정 지시</span>
              <div style={{fontSize:10,color:'rgba(0,0,0,0.4)',marginTop:2}}>변경할 내용만 입력하세요</div>
            </div>
            <textarea value={editInstruction} onChange={e=>setEditInstruction(e.target.value)}
              placeholder="예) 배경 컬러를 핑크색으로 변경&#10;예) 꽃 대신 나뭇잎 일러스트로 교체"
              style={{...S.textarea,fontSize:12,lineHeight:'18px',minHeight:72,background:'#fff',border:'1px solid #f0f0f0',borderRadius:6,padding:8,marginBottom:8}}/>
            {refMode==='current' && !m.heroImage && <div style={{fontSize:10,color:'#fc4514',marginBottom:6}}>현재 생성된 이미지가 없습니다.</div>}
            <button
              onClick={()=>{
                if(refMode==='current'){
                  /* 현재 이미지 기반: 기존 Imagen 프롬프트에 수정 지시 추가 → Imagen 재생성 */
                  const combined = editPrompt + `\n\nIMPORTANT MODIFICATION — apply this change: ${editInstruction}`;
                  onRegenerate&&onRegenerate(combined, null);
                } else {
                  /* 이미지 업로드: Gemini Vision 분석 후 Imagen 생성 */
                  onRegenerate&&onRegenerate(editPrompt, uploadedRef);
                }
              }}
              disabled={imgLoading||!editInstruction.trim()||(refMode==='current'&&!m.heroImage)||(refMode==='upload'&&!uploadedRef)}
              style={{width:'100%',padding:'8px 0',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font,background:(imgLoading||!editInstruction.trim()||(refMode==='current'&&!m.heroImage)||(refMode==='upload'&&!uploadedRef))?'#ccc':'#1a1a1a',color:'#fff',border:'none',opacity:(imgLoading||!editInstruction.trim()||(refMode==='current'&&!m.heroImage)||(refMode==='upload'&&!uploadedRef))?0.6:1}}>
              {imgLoading?'수정 중...':'🎨 이미지 수정 적용'}
            </button>
          </>}
        </div>

        <Divider/>

        {/* 배너 높이 (10px 단위) */}
        <div style={{marginBottom:14}}>
          <label style={S.label}>배너 높이</label>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={()=>up({height:Math.max(300,(m.height||520)-10)})} style={heightBtnStyle}>-</button>
            <div style={{flex:1,textAlign:'center',fontSize:13,fontWeight:600,color:'#1a1a1a'}}>{m.height||520}px</div>
            <button onClick={()=>up({height:Math.min(800,(m.height||520)+10)})} style={heightBtnStyle}>+</button>
          </div>
        </div>
        <SpacingEditor m={m} onUpdate={up}/>
        <div style={S.hint}>배경색은 메인 컬러가 자동 적용됩니다.</div>
      </div>;
    }

    case 'text': {
      /* 라벨+인라인 토글 row */
      const labelRow = (text, key, refreshField_key) => (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <label style={{...S.label,marginBottom:0}}>{text}</label>
            {refreshField_key && <RefreshBtn field={refreshField_key} value={refreshField_key==='sectionName'?m.sectionName:refreshField_key==='textTitle'?m.title:m.description} onDone={t=>up(refreshField_key==='sectionName'?{sectionName:t}:refreshField_key==='textTitle'?{title:t}:{description:t})}/>}
          </div>
          <MiniToggle on={m[key]!==false} onToggle={()=>up({[key]:!(m[key]!==false)})}/>
        </div>
      );
      return <div>
        {/* 텍스트 편집 */}
        <div style={{marginBottom:14}}><label style={S.label}>텍스트 정렬</label><div style={{display:'flex',gap:4}}>
          {['left','center','right'].map(a=><button key={a} onClick={()=>up({textAlign:a})} style={{flex:1,padding:8,borderRadius:10,border:'1px solid',borderColor:m.textAlign===a?'#1a1a1a':'#e5e5e5',background:m.textAlign===a?'#1a1a1a':'#fff',color:m.textAlign===a?'#fff':'rgba(0,0,0,0.45)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:font}}>{a==='left'?'왼쪽':a==='center'?'중앙':'오른쪽'}</button>)}
        </div></div>
        <div style={{marginBottom:14}}>
          {labelRow('섹션명','showSectionName','sectionName')}
          {m.showSectionName!==false && <input style={S.input} value={m.sectionName||''} onChange={e=>up({sectionName:e.target.value})} placeholder="BENEFIT, EVENT 등"/>}
        </div>
        <div style={{marginBottom:14}}>
          {labelRow('타이틀','showTitle','textTitle')}
          {m.showTitle!==false && <textarea style={S.textarea} value={m.title||''} onChange={e=>up({title:e.target.value})}/>}
        </div>
        <div style={{marginBottom:14}}>
          {labelRow('설명','showDescription','textDesc')}
          {m.showDescription!==false && <textarea style={S.textarea} value={m.description||''} onChange={e=>up({description:e.target.value})}/>}
        </div>
        <Divider/>
        <SpacingEditor m={m} onUpdate={up}/>
      </div>;
    }

    case 'coupon': {
      const curCouponColor = m.couponColor || '__main__';
      return <div>
        {/* 텍스트 편집 */}
        <div style={{marginBottom:14}}><label style={S.label}>조건</label><input style={S.input} value={m.condition||''} onChange={e=>up({condition:e.target.value})}/></div>
        <div style={{display:'flex',gap:8}}>
          <div style={{flex:2,marginBottom:14}}><label style={S.label}>금액</label><input style={S.input} value={m.amount||''} onChange={e=>up({amount:e.target.value})}/></div>
          <div style={{flex:1,marginBottom:14}}><label style={S.label}>단위</label><input style={S.input} value={m.unit||''} onChange={e=>up({unit:e.target.value})}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={S.label}>기간</label><input style={S.input} value={m.period||''} onChange={e=>up({period:e.target.value})}/></div>
        <div style={{marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <label style={{...S.label,marginBottom:0}}>제외사항</label>
            <MiniToggle on={m.showExclusion!==false} onToggle={()=>up({showExclusion:!(m.showExclusion!==false)})}/>
          </div>
          {m.showExclusion!==false && <input style={S.input} value={m.exclusion||''} onChange={e=>up({exclusion:e.target.value})} placeholder="예: 일부 상품 제외"/>}
        </div>
        {/* 쿠폰 색상 */}
        <div style={{marginBottom:14}}>
          <label style={S.label}>쿠폰 카드 색상</label>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {COUPON_COLORS.map(c=>{
              const isMain = c.value==='__main__';
              const chipBg = isMain ? mainColor : c.value;
              const active = curCouponColor===c.value;
              return <div key={c.value} title={c.name} onClick={()=>up({couponColor:c.value})} style={{...S.colorChip(active),backgroundColor:chipBg,position:'relative'}}>
                {isMain && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:contrastTextColor(chipBg),fontWeight:700}}>M</div>}
              </div>;
            })}
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',marginTop:6}}>
            <input type="color" value={(curCouponColor==='__main__'?mainColor:curCouponColor)} onChange={e=>up({couponColor:e.target.value})} style={{width:28,height:28,border:'1px solid #e5e5e5',borderRadius:6,cursor:'pointer',background:'transparent',padding:0}}/>
            <span style={{fontSize:11,color:'rgba(0,0,0,0.4)'}}>직접 선택</span>
          </div>
        </div>
        <Divider/>
        <SpacingEditor m={m} onUpdate={up}/>
        <div style={S.hint}>버튼 = 검정 고정, 글씨 = 쿠폰 색상 대비 자동</div>
      </div>;
    }

    case 'benefits':return <div>
      {/* 텍스트 편집 */}
      <div style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
          <label style={{...S.label,marginBottom:0}}>타이틀</label>
          <RefreshBtn field="benefitTitle" value={m.title} onDone={t=>up({title:t})}/>
        </div>
        <input style={S.input} value={m.title||''} onChange={e=>up({title:e.target.value})}/>
      </div>
      {m.benefits?.map((b,i)=><div key={i} style={S.subCard}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <span style={{fontSize:11,fontWeight:700,color:'#1a1a1a'}}>혜택 {i+1}</span>
          <button style={S.smallBtn('danger')} onClick={()=>{const nb=[...m.benefits];nb.splice(i,1);up({benefits:nb});}}>삭제</button>
        </div>
        <div style={{marginBottom:6}}><label style={S.label}>아이콘</label><input style={{...S.input,fontSize:16}} value={b.icon} onChange={e=>{const nb=[...m.benefits];nb[i]={...nb[i],icon:e.target.value};up({benefits:nb});}}/></div>
        <div style={{marginBottom:6}}><label style={S.label}>제목</label><input style={S.input} value={b.title} onChange={e=>{const nb=[...m.benefits];nb[i]={...nb[i],title:e.target.value};up({benefits:nb});}}/></div>
        <div><label style={S.label}>부제목</label><input style={S.input} value={b.subtitle} onChange={e=>{const nb=[...m.benefits];nb[i]={...nb[i],subtitle:e.target.value};up({benefits:nb});}}/></div>
      </div>)}
      <button style={{...S.smallBtn('accent'),width:'100%',padding:8,borderRadius:10}} onClick={()=>up({benefits:[...(m.benefits||[]),{icon:'✨',title:'새 혜택',subtitle:'설명'}]})}>+ 혜택 추가</button>
      <Divider/>
      <SpacingEditor m={m} onUpdate={up}/>
      <div style={S.hint}>배경 = 메인 컬러 서브(10%)</div>
    </div>;

    case 'products':return <div>
      {/* 텍스트 편집 */}
      <div style={{marginBottom:14}}><label style={S.label}>탭 관리</label>
        {m.tabs?.map((t,i)=><div key={t.id} style={{display:'flex',gap:6,marginBottom:6}}>
          <input style={{...S.input,flex:1}} value={t.name} onChange={e=>{const nt=[...m.tabs];nt[i]={...nt[i],name:e.target.value};up({tabs:nt});}}/>
          <button style={S.smallBtn('danger')} onClick={()=>up({tabs:m.tabs.filter((_,j)=>j!==i)})}>삭제</button>
        </div>)}
      </div>
      <div style={{fontSize:11,color:'rgba(0,0,0,0.35)',marginBottom:8}}>미리보기에서 탭 클릭으로 카테고리 전환</div>
      <Divider/>
      <SpacingEditor m={m} onUpdate={up}/>
    </div>;

    case 'button':return <div>
      {/* 텍스트 편집 */}
      <div style={{marginBottom:14}}><label style={S.label}>버튼 텍스트</label><input style={S.input} value={m.text||''} onChange={e=>up({text:e.target.value})}/></div>
      <div style={{marginBottom:14}}><label style={S.label}>라운드</label><input type="range" min={0} max={28} value={m.borderRadius||8} onChange={e=>up({borderRadius:+e.target.value})} style={{width:'100%',accentColor:'#1a1a1a'}}/><div style={{textAlign:'right',fontSize:11,color:'rgba(0,0,0,0.35)',marginTop:2}}>{m.borderRadius||8}px</div></div>
      <Divider/>
      <SpacingEditor m={m} onUpdate={up}/>
    </div>;

    case 'notice':return <div>
      {/* 텍스트 편집 */}
      {m.sections?.map((s,si)=><div key={s.id} style={S.subCard}>
        <div style={{display:'flex',gap:6,marginBottom:8}}>
          <input style={{...S.input,flex:1,fontWeight:600}} value={s.title} onChange={e=>{const ns=[...m.sections];ns[si]={...ns[si],title:e.target.value};up({sections:ns});}}/>
          <button style={S.smallBtn('danger')} onClick={()=>up({sections:m.sections.filter((_,j)=>j!==si)})}>삭제</button>
        </div>
        {s.items?.map((item,ii)=><div key={ii} style={{display:'flex',gap:4,marginBottom:4}}>
          <input style={{...S.input,flex:1,fontSize:11}} value={item} onChange={e=>{const ns=[...m.sections];ns[si]={...ns[si],items:[...ns[si].items]};ns[si].items[ii]=e.target.value;up({sections:ns});}}/>
          <button style={S.smallBtn('danger')} onClick={()=>{const ns=[...m.sections];ns[si]={...ns[si],items:ns[si].items.filter((_,j)=>j!==ii)};up({sections:ns});}}>✕</button>
        </div>)}
        <button style={{...S.smallBtn('accent'),width:'100%',marginTop:6,padding:7,borderRadius:10}} onClick={()=>{const ns=[...m.sections];ns[si]={...ns[si],items:[...ns[si].items,'새 항목']};up({sections:ns});}}>+ 항목 추가</button>
      </div>)}
      <button style={{...S.smallBtn('accent'),width:'100%',padding:8,borderRadius:10}} onClick={()=>up({sections:[...(m.sections||[]),{id:'s'+Date.now(),title:'새 섹션',items:['항목']}]})}>+ 섹션 추가</button>
      <Divider/>
      <SpacingEditor m={m} onUpdate={up}/>
    </div>;

    default:return null;
  }
}

/* ──── Main (3-column layout) ──── */
export default function App(){
  const [modules,dispatch]=useReducer(moduleReducer,DEFAULT_MODULES);
  const [selectedId,setSelectedId]=useState('1');
  const [concept,setConcept]=useState('');
  const [periodInput,setPeriodInput]=useState('2026.4.7~2026.4.30');
  const [benefitsInput,setBenefitsInput]=useState('5,000원 쿠폰 / 최대 30% 할인');
  const [colorScheme,setColorScheme]=useState('#2097ff');
  const [menuOpen,setMenuOpen]=useState(false);
  const [moduleSearch,setModuleSearch]=useState('');
  const [imgLoading,setImgLoading]=useState(false);
  const [hasGenerated,setHasGenerated]=useState(false);
  const dragRef=useRef(null);
  const overRef=useRef(null);
  const previewRef=useRef(null);
  const selMod=modules.find(m=>m.id===selectedId);

  const saveTemp=()=>{
    try{
      localStorage.setItem('mmall_builder_temp', JSON.stringify({modules,concept,periodInput,benefitsInput,colorScheme,hasGenerated}));
      alert('임시저장 완료');
    }catch(e){ alert('임시저장 실패'); }
  };

  const exportHTML=()=>{
    const el = previewRef.current;
    if(!el){ alert('먼저 기획전을 생성해주세요.'); return; }
    const inner = el.innerHTML;
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>M몰 기획전</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#f5f5f5;display:flex;justify-content:center;}
.wrap{width:375px;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Pretendard Variable',sans-serif;}
@keyframes mmall-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
</style>
</head>
<body>
<div class="wrap">${inner}</div>
</body>
</html>`;
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mmall_기획전.html';
    a.click(); URL.revokeObjectURL(url);
  };

  const addModule=(type)=>{
    const nid='m'+Date.now();
    const dp = DEFAULT_PADDING[type] || {top:0,bottom:0};
    const defs={
      hero:{subtitle:'새 배너',title:'제목',date:'기간',height:400,heroImage:null,paddingTop:dp.top,paddingBottom:dp.bottom},
      text:{sectionName:'SECTION',showSectionName:true,showTitle:true,showDescription:true,title:'새 섹션',description:'내용을 입력하세요.',textAlign:'center',paddingTop:dp.top,paddingBottom:dp.bottom},
      coupon:{condition:'조건',amount:'5,000',unit:'원',period:'기간',exclusion:'제외사항',showExclusion:true,couponColor:null,paddingTop:dp.top,paddingBottom:dp.bottom},
      benefits:{title:'혜택',benefits:[{icon:'🎁',title:'혜택',subtitle:'설명'}],paddingTop:dp.top,paddingBottom:dp.bottom},
      products:{tabs:[{id:'tab1',name:'카테고리'}],categories:{tab1:{title:'상품',products:[{brand:'브랜드',name:'상품명',price:10000,discount:10,img:''}]}},paddingTop:dp.top,paddingBottom:dp.bottom},
      button:{text:'버튼',borderRadius:8,paddingTop:dp.top,paddingBottom:dp.bottom},
      notice:{sections:[{id:'s1',title:'유의사항',items:['내용']}],paddingTop:dp.top,paddingBottom:dp.bottom}
    };
    dispatch({type:'ADD',payload:{id:nid,type,...(defs[type]||{})}});
    setSelectedId(nid);setMenuOpen(false);
  };

  const generate=async()=>{
    setHasGenerated(true);
    setImgLoading(true);
    const txt = concept + ' ' + benefitsInput;
    const period = periodInput.trim() || '2026.4.7~2026.4.30';
    let benefitTitle_temp = null;

    const bParts = benefitsInput.split('/').map(s=>s.trim()).filter(Boolean);
    const parsedBenefits = bParts.map(b => {
      const pctM = b.match(/(최대\s*)?(\d{1,2})\s*%/);
      const wonM = b.match(/([\d,]+)\s*원/);
      if(pctM) return { type:'discount', value:pctM[2], label:b };
      if(wonM) return { type:'coupon', value:wonM[1], label:b };
      if(/무료\s*배송|배송\s*무료/.test(b)) return { type:'free', value:b, label:'무료 배송' };
      return { type:'etc', value:b, label:b };
    });
    const discountB = parsedBenefits.find(b=>b.type==='discount');
    const couponB = parsedBenefits.find(b=>b.type==='coupon');
    const discount = discountB ? discountB.value : null;
    const couponAmt = couponB ? couponB.value : '5,000';

    /* 테마/이벤트는 concept만 보고 판단 (혜택 키워드에 오염 방지) */
    const isFirst  = /첫\s*구매|신규|가입/.test(concept);
    const isSeason = /여름|겨울|봄|가을|시즌|썸머|윈터|스프링/.test(concept);
    const isFlash  = /플래시|타임|긴급|한정|오늘만/.test(concept);
    const isFamily    = /가\s*정\s*의\s*달|어버이\s*날|어린이\s*날|가족/.test(concept);
    const isValentine = /발\s*렌\s*타\s*인|valentine/i.test(concept);
    const isXmas      = /크\s*리\s*스\s*마\s*스|성\s*탄|christmas/i.test(concept);
    const isNewYear   = /추\s*석|명\s*절|설\s*날|새\s*해|신\s*년|한\s*가\s*위/.test(concept);
    /* 세일은 concept + 혜택 합산으로만 폴백 판단 */
    const isSale   = !isFamily && !isValentine && !isXmas && !isNewYear && /세일|할인|특가|파격/.test(txt);
    const seasonWord = concept.match(/(여름|겨울|봄|가을)/)?.[1] || '';

    const targetMatch = txt.match(/(첫\s*구매\s*고객|신규\s*고객|신규\s*가입\s*고객|전체\s*고객|VIP|프리미엄\s*고객)/);
    const target = targetMatch ? targetMatch[1] : isFirst ? '첫 구매 고객' : '전체 고객';
    const categoryMatch = txt.match(/(패션|뷰티|리빙|푸드|가전|디지털|스포츠|라이프스타일)/g);

    let heroTitle, heroSub, heroDate, sectionName, textTitle, textDesc, couponCond, btnText;
    const benefitSummary = bParts.join('과 ');

    /* Claude로 카피 생성 */
    try {
      const resp = await fetch('/api/generate-content', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({concept, period, benefits:benefitsInput, field:'all'}),
      });
      if(resp.ok){
        const f = await resp.json();
        heroSub      = f.heroSub      || 'M·MALL EXCLUSIVE';
        heroTitle    = f.heroTitle    || concept;
        sectionName  = f.sectionName  || 'EVENT';
        textTitle    = f.textTitle    || concept;
        textDesc     = f.textDesc     || '';
        benefitTitle_temp = f.benefitTitle;
        btnText      = f.btnText      || '전체 상품 보기';
        couponCond   = f.couponCond   || target;
      }
    } catch(_){}

    /* fallback */
    if(!heroSub){
      if(isSeason){ const eng={여름:'SUMMER',겨울:'WINTER',봄:'SPRING',가을:'AUTUMN'}[seasonWord]||'SEASON'; heroSub=`${eng} COLLECTION`; heroTitle=`${seasonWord||'시즌'} 특별전`; sectionName='SEASON'; textTitle=`${seasonWord} 시즌을 위한\n특별한 셀렉션`; textDesc=`${target} 대상 ${benefitSummary}.\n엄선된 아이템을 만나보세요.`; couponCond=target; btnText=`${seasonWord} 상품 보기`; }
      else if(isFirst){ heroSub='Welcome M·MALL'; heroTitle='첫 구매 혜택'; sectionName='BENEFIT'; textTitle='처음 오신 당신을 위한\n최고의 혜택'; textDesc=`신규 고객 한정 ${benefitSummary}을\n지금 받아보세요.`; couponCond='첫 구매 고객'; btnText='혜택 상품 보기'; }
      else { heroSub='M·MALL EXCLUSIVE'; heroTitle=concept||'기획전'; sectionName='EVENT'; textTitle='특별한 혜택'; textDesc=`${benefitSummary}.\n지금 만나보세요.`; couponCond=target; btnText='전체 상품 보기'; }
    }
    heroDate = period;

    const iconMap = {discount:'⚡',coupon:'coin',free:'free',etc:'🎁'};
    const subtitleMap = {discount:'기획전 선정 상품',coupon:`${target} 한정`,free:'전 상품',etc:'자세한 내용 확인'};
    const benefitItems = parsedBenefits.map(b=>({icon:iconMap[b.type],title:b.label,subtitle:subtitleMap[b.type]}));
    if(/적립|포인트/.test(txt)) benefitItems.push({icon:'💎',title:'포인트 적립',subtitle:'결제 금액의 최대 5%'});
    if(benefitItems.length===0) benefitItems.push({icon:'🎁',title:'특별 혜택',subtitle:'자세한 내용 확인'});

    const tabs = categoryMatch && categoryMatch.length>=2
      ? categoryMatch.slice(0,3).map((c,i)=>({id:'tab'+(i+1),name:c}))
      : null;

    const noticeItems = [
      `해당 프로모션은 ${period} 내 M몰에서만 적용됩니다.`,
      'M몰은 모든 현대카드로 결제 가능합니다.(일부 법인·체크 카드 및 하이브리드·선불·Gift카드 등 제외)',
      '해당 프로모션은 M몰 및 제휴사 사정에 따라 변경 또는 중단될 수 있습니다.',
      '대상 상품은 한정 수량으로 조기 품절되거나 변경될 수 있습니다.',
    ];
    const couponNotice = [
      '쿠폰 다운로드 및 사용은 프로모션 기간 내에만 가능합니다.',
      '다운로드한 할인 쿠폰은 프로모션 기간 내 대상 상품에 한하여 1회 사용 가능합니다.',
      '쿠폰을 다운로드하신 후, 주문서에서 해당 쿠폰을 적용하여 결제해 주세요.',
    ];

    dispatch({type:'SET',payload:modules.map(m=>{
      if(m.type==='hero') return {...m, title:heroTitle, subtitle:heroSub, date:heroDate};
      if(m.type==='text') return {...m, sectionName, title:textTitle, description:textDesc, showSectionName:true, showTitle:true, showDescription:true};
      if(m.type==='coupon') return {...m, condition:couponCond, amount:couponAmt, unit:'원', period:`${period}까지`, exclusion:'일부 상품 제외', showExclusion:true};
      if(m.type==='benefits') return {...m, title:benefitTitle_temp||`${heroTitle} 혜택`, benefits:benefitItems};
      if(m.type==='products' && tabs) return {...m, tabs};
      if(m.type==='button') return {...m, text:btnText};
      if(m.type==='notice') return {...m, sections:[{id:'s1',title:'확인해 주세요',items:noticeItems},{id:'s2',title:'[M몰 할인 쿠폰]',items:couponNotice}]};
      return m;
    })});

    /* ── 나노바나나2: 이미지 자동 생성 → 히어로 배너 바인딩 ── */
    const heroId = modules.find(m=>m.type==='hero')?.id;
    if(heroId){
      setImgLoading(true);
      try{
        const imgUrl = await callNanoBanana(genGeminiPrompt(concept, colorScheme));
        if(imgUrl){
          dispatch({type:'UPDATE', id:heroId, updates:{heroImage:imgUrl}});
          /* 생성 이미지 배경색 → 메인 컬러 자동 동기화 */
          const detectedColor = await extractBgColor(imgUrl);
          if(detectedColor) setColorScheme(detectedColor);
        }
      } catch(e){
        console.error('나노바나나2 이미지 생성 실패:', e);
        alert('이미지 생성 실패: ' + e.message);
      } finally{
        setImgLoading(false);
      }
    }
  };

  const regenerateImage=async(customPrompt, refImage)=>{
    const heroId=modules.find(m=>m.type==='hero')?.id;
    if(!heroId||imgLoading)return;
    setImgLoading(true);
    try{
      let finalPrompt = customPrompt;
      if(refImage){
        /* 업로드 참고 이미지: Gemini Vision으로 스타일 분석 후 프롬프트에 반영 */
        const desc = await describeRefImage(refImage);
        if(desc) finalPrompt = customPrompt + `\n\nVisual reference style to incorporate: ${desc}`;
      }
      const imgUrl = await callNanoBanana(finalPrompt);
      if(imgUrl){
        dispatch({type:'UPDATE',id:heroId,updates:{heroImage:imgUrl}});
        const detectedColor=await extractBgColor(imgUrl);
        if(detectedColor) setColorScheme(detectedColor);
      }
    }catch(e){
      console.error('이미지 재생성 실패:',e);
      alert('이미지 생성 실패: ' + e.message);
    }finally{
      setImgLoading(false);
    }
  };

  const onDragStart=(i)=>{dragRef.current=i;};
  const onDragEnter=(i)=>{overRef.current=i;};
  const onDragEnd=()=>{if(dragRef.current===null||overRef.current===null)return;const a=[...modules];const[r]=a.splice(dragRef.current,1);a.splice(overRef.current,0,r);dispatch({type:'SET',payload:a});dragRef.current=null;overRef.current=null;};

  const renderPrev=(m)=>{
    const sel=m.id===selectedId;const p={m,sel,onSel:()=>setSelectedId(m.id),mainColor:colorScheme};
    const il={imgLoading};
    switch(m.type){case 'hero':return <HeroBanner {...p} {...il}/>;case 'text':return <TextSection {...p} {...il}/>;case 'coupon':return <CouponMod {...p} {...il}/>;case 'benefits':return <BenefitsMod {...p} {...il}/>;case 'products':return <ProductsMod {...p} {...il}/>;case 'button':return <CTABtn {...p} {...il}/>;case 'notice':return <NoticeMod {...p} {...il}/>;default:return null;}
  };

  const searchLower = moduleSearch.trim().toLowerCase();
  const filteredModules = searchLower
    ? modules.filter(m => {
        const mt = MODULE_TYPES.find(t=>t.type===m.type);
        return mt?.label.toLowerCase().includes(searchLower) || mt?.type.toLowerCase().includes(searchLower);
      })
    : modules;

  /* SVG 아이콘 */
  const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5.5 2h5M2 4h12M12.667 4l-.467 7.467c-.06.96-.09 1.44-.313 1.8a1.667 1.667 0 01-.72.627c-.376.106-.858.106-1.82.106H6.653c-.962 0-1.443 0-1.819-.106a1.667 1.667 0 01-.72-.628c-.224-.359-.254-.838-.314-1.799L3.333 4" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5.333" y="5.333" width="8" height="8" rx="1.333" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2"/><path d="M3.333 10.667h-.666A1.333 1.333 0 011.333 9.333V3.333A1.333 1.333 0 012.667 2h6A1.333 1.333 0 0110 3.333v.667" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2"/></svg>;

  return <div style={S.wrap}>
    {/* ── 탑바: 생성 후에만 표시 ── */}
    {hasGenerated && <div style={S.topbar}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:15,fontWeight:800,color:'#1a1a1a',letterSpacing:'-0.3px'}}>M몰 기획전 Agent</span>
        <span style={{fontSize:10,fontWeight:700,color:'#fff',background:'#1a1a1a',borderRadius:20,padding:'3px 8px',letterSpacing:'0.3px'}}>With AI+</span>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={saveTemp} style={{padding:'8px 16px',borderRadius:8,border:'1px solid #e5e5e5',background:'#fff',color:'#1a1a1a',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:font}}>임시저장</button>
        <button onClick={exportHTML} style={{padding:'8px 16px',borderRadius:8,border:'none',background:'#1a1a1a',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:font}}>HTML 내보내기</button>
      </div>
    </div>}

    {!hasGenerated ? (
      /* ── 랜딩: 중앙 카드 (탑바 없음) ── */
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f5'}}>
        <div style={{width:480,background:'#fff',borderRadius:16,padding:'40px 44px',boxShadow:'0 4px 24px rgba(0,0,0,0.07)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:28}}>
            <span style={{fontSize:24,fontWeight:800,color:'#1a1a1a',letterSpacing:'-0.5px'}}>M몰 기획전 Agent</span>
            <span style={{fontSize:13,fontWeight:700,color:'#fff',background:'#1a1a1a',borderRadius:20,padding:'4px 10px',letterSpacing:'0.3px'}}>With AI+</span>
          </div>
          <div style={{marginBottom:12}}>
            <label style={S.label}>기획전 컨셉</label>
            <textarea style={{...S.textarea,minHeight:80}} value={concept} onChange={e=>setConcept(e.target.value)} placeholder="예) 현대카드 M몰 첫 구매 고객 혜택 기획전. 신규 가입 고객 대상 5,000원 쿠폰 + 최대 30% 할인. 프리미엄하고 세련된 분위기."/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={S.label}>기간</label>
            <input style={S.input} value={periodInput} onChange={e=>setPeriodInput(e.target.value)} placeholder="2026.4.7~2026.4.30"/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={S.label}>혜택 <span style={{fontWeight:400,color:'rgba(0,0,0,0.35)'}}>/로 구분</span></label>
            <input style={S.input} value={benefitsInput} onChange={e=>setBenefitsInput(e.target.value)} placeholder="예: 5,000원 쿠폰 / 최대 30% 할인"/>
          </div>
          <button onClick={generate} disabled={imgLoading} style={{...S.genBtn,opacity:imgLoading?0.6:1,cursor:imgLoading?'not-allowed':'pointer'}}>
            {imgLoading?'🎨 이미지 생성 중...':'생성하기'}
          </button>
        </div>
      </div>
    ) : (
      /* ── 생성 후: 3컬럼 레이아웃 ── */
      <div style={{...S.mainRow,animation:'mmall-fadein 0.5s ease'}}>
        {/* 왼쪽 */}
        <div style={S.left}>
          <div style={S.leftBody}>
            <div style={S.section}>
              <div style={S.panelTitle}>컨셉 입력</div>
              <div style={{marginBottom:10}}>
                <label style={S.label}>기획전 컨셉</label>
                <textarea style={{...S.textarea,minHeight:60}} value={concept} onChange={e=>setConcept(e.target.value)} placeholder="예) 현대카드 M몰 첫 구매 고객 혜택 기획전."/>
              </div>
              <div style={{marginBottom:10}}>
                <label style={S.label}>기간</label>
                <input style={S.input} value={periodInput} onChange={e=>setPeriodInput(e.target.value)} placeholder="2026.4.7~2026.4.30"/>
              </div>
              <div style={{marginBottom:12}}>
                <label style={S.label}>혜택 <span style={{fontWeight:400,color:'rgba(0,0,0,0.35)'}}>/로 구분</span></label>
                <input style={S.input} value={benefitsInput} onChange={e=>setBenefitsInput(e.target.value)} placeholder="예: 5,000원 쿠폰 / 최대 30% 할인"/>
              </div>
              <button onClick={generate} disabled={imgLoading} style={{...S.genBtn,opacity:imgLoading?0.6:1,cursor:imgLoading?'not-allowed':'pointer'}}>
                {imgLoading?'🎨 이미지 생성 중...':'생성하기'}
              </button>
            </div>

            <div style={S.section}>
              <div style={S.panelTitle}>메인 컬러</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
                {MAIN_COLORS.map(c=><div key={c.value} style={{...S.colorChip(colorScheme===c.value),backgroundColor:c.value}} onClick={()=>setColorScheme(c.value)} title={c.name}/>)}
              </div>
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
                <input type="color" value={colorScheme} onChange={e=>setColorScheme(e.target.value)} style={{position:'absolute',opacity:0,width:0,height:0}}/>
                <div style={{width:24,height:24,borderRadius:6,backgroundColor:colorScheme,border:'2px solid #1a1a1a',flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:600,color:'#1a1a1a',fontFamily:'-apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif',letterSpacing:0.5}}>{colorScheme.toUpperCase()}</span>
              </label>
            </div>

            <div style={{marginBottom:16}}>
              <div style={S.panelTitle}>모듈 관리</div>
              <div style={{marginBottom:10}}>
                <input style={{...S.input,fontSize:12,padding:'8px 10px',background:'#f9f9f9'}} value={moduleSearch} onChange={e=>setModuleSearch(e.target.value)} placeholder="모듈 검색..."/>
              </div>
              <div style={{marginBottom:10}}>
                {filteredModules.map((m,i)=>{
                  const origIdx=modules.indexOf(m);
                  return <div key={m.id} draggable onDragStart={()=>onDragStart(origIdx)} onDragEnter={()=>onDragEnter(origIdx)} onDragEnd={onDragEnd} onDragOver={e=>e.preventDefault()} onClick={()=>setSelectedId(m.id)} style={S.modItem(selectedId===m.id)}>
                    <span style={{cursor:'grab',color:'rgba(0,0,0,0.2)',fontSize:12}}>⠿</span>
                    <span style={{fontSize:13}}>{MODULE_TYPES.find(t=>t.type===m.type)?.icon}</span>
                    <span style={S.modName}>{MODULE_TYPES.find(t=>t.type===m.type)?.label}</span>
                    <button onClick={e=>{e.stopPropagation();dispatch({type:'DUPLICATE',id:m.id});}} style={S.iconBtn} title="복제"><CopyIcon/></button>
                    <button onClick={e=>{e.stopPropagation();dispatch({type:'DELETE',id:m.id});if(selectedId===m.id)setSelectedId(modules[0]?.id);}} style={S.iconBtn} title="삭제"><TrashIcon/></button>
                  </div>;
                })}
                {searchLower&&filteredModules.length===0&&<div style={{fontSize:11,color:'rgba(0,0,0,0.35)',textAlign:'center',padding:12}}>검색 결과가 없습니다.</div>}
              </div>
              <div style={{position:'relative'}}>
                <button onClick={()=>setMenuOpen(!menuOpen)} style={S.addBtn}>+ 모듈 추가</button>
                <div style={S.addMenu(menuOpen)}>
                  {MODULE_TYPES.map(t=><button key={t.type} onClick={()=>addModule(t.type)} style={S.addMenuItem}><span>{t.icon}</span> {t.label}</button>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙: 미리보기 */}
        <div style={S.center}>
          <div style={{width:375,flexShrink:0,background:'#fff',overflow:'hidden',boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
            <div ref={previewRef} style={{width:'100%'}}>{modules.map(m=><div key={m.id}>{renderPrev(m)}</div>)}</div>
          </div>
        </div>

        {/* 오른쪽: 모듈 편집 */}
        <div style={S.editor}>
          <div style={S.editorHead}>
            <div style={{fontSize:14,fontWeight:700,color:'#1a1a1a'}}>
              {selMod?<>{MODULE_TYPES.find(t=>t.type===selMod.type)?.icon} {MODULE_TYPES.find(t=>t.type===selMod.type)?.label} 편집</>:'모듈을 선택하세요'}
            </div>
          </div>
          <div style={S.editorBody}>
            {selMod?<ModuleEditor m={selMod} up={updates=>dispatch({type:'UPDATE',id:selMod.id,updates})} concept={concept} benefits={benefitsInput} mainColor={colorScheme} onRegenerate={regenerateImage} imgLoading={imgLoading}/>:<div style={{fontSize:12,color:'rgba(0,0,0,0.35)',textAlign:'center',marginTop:40}}>왼쪽 모듈 목록이나<br/>미리보기에서 모듈을 클릭하세요</div>}
          </div>
        </div>
      </div>
    )}
  </div>;
}
