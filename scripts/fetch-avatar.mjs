import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rename, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.mjs';

const temporary = fileURLToPath(new URL('../public/assets/avatar.download', import.meta.url));
try {
  await mkdir(fileURLToPath(new URL('../public/assets/', import.meta.url)), { recursive: true });
  await promisify(execFile)('curl', ['--fail', '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https', '--max-time', '30', '--output', temporary, site.avatarFallback]);
  const data = await readFile(temporary);
  const png = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = data[0] === 255 && data[1] === 216 && data[2] === 255;
  if ((!png && !jpeg) || data.length > 2_000_000) throw new Error('Avatar response is not a supported image under 2 MB.');
  const extension = png ? 'png' : 'jpg';
  const destination = fileURLToPath(new URL(`../public/assets/avatar.${extension}`, import.meta.url));
  await rename(temporary, destination);
  await rm(fileURLToPath(new URL(`../public/assets/avatar.${png ? 'jpg' : 'png'}`, import.meta.url)), { force: true });
  console.log(`Verified GitHub avatar saved locally (${data.length} bytes).`);
} catch (error) {
  await rm(temporary, { force: true });
  console.error(`Avatar download failed: ${error.message}`);
  console.error('The page retains the public GitHub URL and a text fallback. Check network access to avatars.githubusercontent.com.');
  process.exitCode = 1;
}
