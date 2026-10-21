import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { build, root, output } from './build.mjs';

const dev = process.argv.includes('--dev');
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || '0.0.0.0';
if (dev) await build();
else await stat(path.join(output, 'index.html')).catch(() => { throw new Error('Run npm run build before npm run preview.'); });

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(output, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(`${output}${path.sep}`)) { response.writeHead(403); response.end('Forbidden'); return; }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});
server.listen(port, host, () => console.log(`Portfolio ${dev ? 'development' : 'production'} server running on port ${port}`));
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
if (dev) {
  let rebuilding = false;
  let pending = false;
  let debounce;
  async function rebuild() {
    if (rebuilding) { pending = true; return; }
    rebuilding = true;
    // A new Node process reloads modules, including edited data and templates.
    try {
      const result = await promisify(execFile)(process.execPath, ['scripts/build.mjs'], { cwd: root });
      process.stdout.write(result.stdout);
    }
    catch (error) { console.error(error); }
    finally { rebuilding = false; if (pending) { pending = false; await rebuild(); } }
  }
  for (const directory of ['src', 'public']) watch(path.join(root, directory), { recursive: true }, () => {
    clearTimeout(debounce);
    debounce = setTimeout(rebuild, 120);
  });
}
