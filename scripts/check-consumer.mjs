/** Pack without publishing; inspect/install no registry dependencies or workspace symlinks. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, cp, readFile, rm, access, writeFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
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
    function exportPaths(value, key) {
      if(typeof value === 'string') return [[key,value]];
      return Object.entries(value).flatMap(([condition,path])=>exportPaths(path,`${key}/${condition}`));
    }
    for (const [key,value] of Object.entries(pkg.exports)) {
      if (key.includes('*')) continue;
      for(const [label,path] of exportPaths(value,key)) {
        try { await access(join(target,path)); console.log(`PASS ${pkg.name} ${label} → ${path}`); }
        catch { failed=true; console.log(`FAIL ${pkg.name} ${label} → missing ${path}`); }
      }
    }
  }
  // Copy actual installed peers/tools into isolation; no Area workspace links or registry access.
  const require=createRequire(import.meta.url);
  for(const name of ['react','react-dom','scheduler','csstype','@types/react','@types/react-dom','typescript','esbuild','@esbuild/'+process.platform+'-'+process.arch]) {
    const packagePath=require.resolve(name+'/package.json');
    await cp(dirname(packagePath),join(temp,'node_modules',name),{recursive:true});
  }
  await writeFile(join(temp,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',jsx:'react-jsx',strict:true,skipLibCheck:false,noEmit:true},include:['types.tsx']}));
  const types=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{cwd:temp,encoding:'utf8'});
  process.stdout.write(types.stdout??'');process.stderr.write(types.stderr??'');failed ||= types.status!==0;
  if(types.status===0)console.log('PASS isolated strict NodeNext declarations + expected compile errors');
  const run=spawnSync(process.execPath,['imports.mjs'],{cwd:temp,encoding:'utf8'});
  process.stdout.write(run.stdout ?? ''); process.stderr.write(run.stderr ?? '');
  failed ||= run.status !== 0;
} finally { await rm(temp,{recursive:true,force:true}); }
process.exitCode=failed?1:0;
