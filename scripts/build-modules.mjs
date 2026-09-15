/** Preserve module boundaries and directives; never bundle React or workspace sources. */
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { transform } from 'esbuild';
const root = resolve(process.argv[2]);
const src = join(root,'src');
const out = join(root,'dist/modules');
await rm(out,{recursive:true,force:true});
async function walk(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const file=join(dir,entry.name);
    if(entry.isDirectory()) { await walk(file); continue; }
    if(!/\.tsx?$/.test(file) || /\.(test|spec)\.tsx?$/.test(file)) continue;
    const target=join(out,relative(src,file).replace(/\.tsx?$/,'.js'));
    const code=await readFile(file,'utf8');
    const result=await transform(code,{loader:file.endsWith('.tsx')?'tsx':'ts',format:'esm',target:'es2022',jsx:'automatic'});
    await mkdir(dirname(target),{recursive:true});
    // esbuild's non-bundling transform deliberately preserves import specifiers.
    await writeFile(target,result.code.replace(/(from\s+["']|import\s*["'])(\.[^"']+)\.tsx?(["'])/g,'$1$2.js$3'));
  }
}
await walk(src);
execFileSync(process.execPath,[fileURLToPath(new URL('../node_modules/typescript/bin/tsc',import.meta.url)),'--project',join(root,'tsconfig.build.json')],{stdio:'inherit'});
async function fixDeclarations(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const file=join(dir,entry.name);
    if(entry.isDirectory()) { await fixDeclarations(file); continue; }
    if(!file.endsWith('.d.ts')) continue;
    const code=await readFile(file,'utf8');
    await writeFile(file,code.replace(/(["'])(\.[^"']+)\.tsx?(["'])/g,'$1$2.js$3'));
  }
}
await fixDeclarations(out);
console.log(`  compiled modules + declarations: ${relative(process.cwd(),out)}`);
