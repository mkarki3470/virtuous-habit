import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const svg = `<svg width="512" height="512" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="c">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
  </defs>
  <circle cx="50" cy="50" r="50" fill="#FFFFFF" />
  <g clip-path="url(#c)">
    <rect x="0" y="0" width="100" height="35" fill="#FCD34D" />
    <rect x="0" y="35" width="100" height="12" fill="#FB923C" />
    <rect x="0" y="47" width="100" height="13" fill="#F97316" />
    <circle cx="50" cy="60" r="18" fill="#FBBF24" />
    <g stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round">
      <line x1="50" y1="32" x2="50" y2="25" />
      <line x1="32" y1="52" x2="26" y2="50" />
      <line x1="68" y1="52" x2="74" y2="50" />
      <line x1="38" y1="40" x2="33" y2="36" />
      <line x1="62" y1="40" x2="67" y2="36" />
    </g>
    <polygon points="0,72 18,52 30,62 42,45 55,60 70,48 85,58 100,52 100,100 0,100" fill="#5B4FCF" />
    <polygon points="0,82 15,68 28,78 45,65 58,75 72,68 88,76 100,72 100,100 0,100" fill="#4338CA" />
    <rect x="0" y="88" width="100" height="12" fill="#1E1B4B" />
  </g>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf).resize(192, 192).png().toFile(join(outDir, 'icon-192.png'));
console.log('✓ icon-192.png');

await sharp(buf).resize(512, 512).png().toFile(join(outDir, 'icon-512.png'));
console.log('✓ icon-512.png');

await sharp(buf).resize(180, 180).png().toFile(join(outDir, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png');

console.log('\nAll icons generated in public/icons/');
