/** Read-only static preview. Use dev.mjs for rebuilding and live reload. */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPreview, readSnapshot } from './preview.mjs';
const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const { server } = createPreview(await readSnapshot(dist));
server.listen(Number(process.env.PORT ?? 4321), '127.0.0.1', () => console.log('Area docs → http://localhost:' + (process.env.PORT ?? 4321)));
