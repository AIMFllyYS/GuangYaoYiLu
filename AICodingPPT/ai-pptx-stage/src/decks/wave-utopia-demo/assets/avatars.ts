export const avatarA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <radialGradient id="g" cx="40%" cy="32%">
      <stop offset="0" stop-color="#5bd8ff"/>
      <stop offset="0.55" stop-color="#0b1117"/>
      <stop offset="1" stop-color="#050607"/>
    </radialGradient>
  </defs>
  <rect width="160" height="160" fill="url(#g)"/>
  <path d="M35 98 C62 43 97 41 124 96" fill="none" stroke="#f7fbff" stroke-width="9" stroke-linecap="round"/>
  <path d="M58 98 L82 66 L102 98" fill="none" stroke="#a351ff" stroke-width="8" stroke-linecap="round"/>
  <text x="80" y="124" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18" font-weight="700">WAVE</text>
</svg>`);

export const avatarB =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="p" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#3ecbff"/>
      <stop offset="1" stop-color="#22110c"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" fill="#07090a"/>
  <circle cx="83" cy="71" r="36" fill="url(#p)" opacity="0.8"/>
  <path d="M54 134 C61 105 103 103 113 134" fill="#0f171c"/>
  <path d="M63 59 C78 36 112 42 120 70" fill="none" stroke="#f4c17d" stroke-width="5" opacity="0.55"/>
</svg>`);
