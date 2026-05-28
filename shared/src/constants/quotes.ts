export const TAMIL_DAILY_QUOTES = [
  { en: 'Small steps every day build a healthy life.', ta: 'ஒவ்வொரு நாளும் சிறு முயற்சி — ஆரோக்கிய வாழ்க்கை.' },
  { en: 'Check your sugar before and after exercise.', ta: 'உடற்பயிற்சிக்கு முன்னும் பின்னும் சர்க்கரை பரிசோதனை செய்யுங்கள்.' },
  { en: 'Water is medicine for your kidneys and heart.', ta: 'நீர் உங்கள் இதயத்திற்கும் சிறுநீரகத்திற்கும் மருந்து.' },
  { en: 'Rest is part of your fitness plan.', ta: 'ஓய்வும் உங்கள் fitness திட்டத்தின் பகுதி.' },
  { en: 'Your family supports your health journey.', ta: 'உங்கள் குடும்பம் உங்கள் ஆரோக்கிய பயணத்தை ஆதரிக்கிறது.' },
];

export function getDailyQuote(lang: 'en' | 'ta'): { text: string; lang: string } {
  const day = Math.floor(Date.now() / 86400000) % TAMIL_DAILY_QUOTES.length;
  const q = TAMIL_DAILY_QUOTES[day]!;
  return { text: lang === 'ta' ? q.ta : q.en, lang };
}
