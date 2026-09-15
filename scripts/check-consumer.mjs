/** Pack without publishing; inspect/install no registry dependencies or workspace symlinks. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, cp, readFile, rm, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temp = await mkdtemp(join(tmpdir(), 'area-consumer-'));
let failed = false;
try {
  await cp(join(repo,'tests/consumer'), temp, {recursive:true});
  for (const name of ['tokens','styles','react']) {
    const packed = JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',temp,'--cache',join(temp,'.npm-cache')],{cwd:join(repo,'packages',name),encoding:'utf8'}))[0];
    const target = join(temp,'node_modules/@area',name);
    await mkdir(target,{recursive:true});
    execFileSync('tar',['-xzf',join(temp,packed.filename),'--strip-components=1','-C',target]);
    const pkg = JSON.parse(await readFile(join(target,'package.json'),'utf8'));
    for (const [key,path] of Object.entries(pkg.exports)) {
      if (typeof path !== 'string' || key.includes('*')) continue;
      try { await access(join(target,path)); console.log(`PASS ${pkg.name} ${key} → ${path}`); }
      catch { failed=true; console.log(`FAIL ${pkg.name} ${key} → missing ${path}`); }
    }
  }
  // This first-stage fixture deliberately probes dependency-free entry resolution only.
  // React peers and compiler consumption are E04; report unsupported source imports openly.
  const run=spawnSync(process.execPath,['imports.mjs'],{cwd:temp,encoding:'utf8'});
  process.stdout.write(run.stdout ?? ''); process.stderr.write(run.stderr ?? '');
  failed ||= run.status !== 0;
} finally { await rm(temp,{recursive:true,force:true}); }
process.exitCode=failed?1:0;
