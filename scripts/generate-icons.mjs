import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceLogo =
  process.env.LOGO_SOURCE ??
  'C:\\Users\\PC\\Pictures\\Logos\\Logos\\Motiv logo.png';

const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const faviconSizes = [16, 32, 48];

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function resizePng(input, output, size) {
  await ensureDir(dirname(output));
  await sharp(input)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(output);
}

async function main() {
  const iconsDir = join(projectRoot, 'src', 'assets', 'icons');
  const iconDir = join(projectRoot, 'src', 'assets', 'icon');
  const imgDir = join(projectRoot, 'src', 'assets', 'img');
  const resourcesDir = join(projectRoot, 'resources');

  await Promise.all([
    ensureDir(iconsDir),
    ensureDir(iconDir),
    ensureDir(imgDir),
    ensureDir(resourcesDir),
  ]);

  await resizePng(sourceLogo, join(resourcesDir, 'icon.png'), 1024);

  await Promise.all(
    pwaSizes.map((size) =>
      resizePng(
        sourceLogo,
        join(iconsDir, `icon-${size}x${size}.png`),
        size
      )
    )
  );

  await resizePng(sourceLogo, join(iconDir, 'logo.png'), 48);
  await resizePng(sourceLogo, join(imgDir, 'logo.png'), 256);

  const faviconBuffers = await Promise.all(
    faviconSizes.map(async (size) => {
      const buffer = await sharp(sourceLogo)
        .resize(size, size, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer();
      return buffer;
    })
  );

  const icoBuffer = await toIco(faviconBuffers);
  await writeFile(join(projectRoot, 'src', 'favicon.ico'), icoBuffer);

  const splashSize = 2732;
  const logoOnSplash = 1024;
  const splashLogo = await sharp(sourceLogo)
    .resize(logoOnSplash, logoOnSplash, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: splashSize,
      height: splashSize,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 },
    },
  })
    .composite([{ input: splashLogo, gravity: 'centre' }])
    .png()
    .toFile(join(resourcesDir, 'splash.png'));

  console.log('Iconos generados correctamente.');
  console.log(`- PWA: ${iconsDir}`);
  console.log(`- Favicon PNG: ${join(iconDir, 'logo.png')}`);
  console.log(`- Favicon ICO: ${join(projectRoot, 'src', 'favicon.ico')}`);
  console.log(`- Logo app: ${join(imgDir, 'logo.png')}`);
  console.log(`- Capacitor: ${resourcesDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
