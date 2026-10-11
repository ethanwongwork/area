// Research-only frozen input export; never imports a moving working-tree token source.
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync, existsSync, symlinkSync} from 'node:fs';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const here=dirname(fileURLToPath(import.meta.url)), repo=resolve(here,'../../../../..');
const area='6a4307756ce06ddd008c0bc9d866f297fda9e8fd';
const research='cf058e2b09670682a5e33a177b930af48bcdb511';
const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',maxBuffer:20e6});
const hash=s=>createHash('sha256').update(s).digest('hex');
const cache=join(here,'.cache'); mkdirSync(cache,{recursive:true});
const flag=process.argv.indexOf('--deps-root');
const deps=resolve(flag>=0?process.argv[flag+1]:repo,'node_modules');
if(!existsSync(deps)) throw Error('Pass --deps-root pointing to an Area checkout with installed dependencies');
if(!existsSync(join(cache,'node_modules'))) symlinkSync(deps,join(cache,'node_modules'),'dir');
// .cache is already ignored by Area. Only this task's folder receives writes.
const files=git('ls-tree','-r','--name-only',area,'packages/tokens/src').trim().split('\n');
const sourceHashes={};
for(const file of files){
  const source=git('show',`${area}:${file}`), dest=join(cache,file);
  mkdirSync(dirname(dest),{recursive:true}); writeFileSync(dest,source); sourceHashes[file]=hash(source);
}
const {resolveTheme,DEFAULT_SELECTION}=await import(pathToFileURL(join(cache,'packages/tokens/src/semantic/resolve.ts')));
const {ASSERTIONS}=await import(pathToFileURL(join(cache,'packages/tokens/src/contrast/assertions.ts')));
const presetPath='docs/research/astra/materials/13-presets/presets.json';
const presetSource=git('show',`${research}:${presetPath}`);
if(hash(readFileSync(resolve(here,'../13-presets/presets.json')))!==hash(presetSource)) throw Error('Task 13 has moved; update the lock deliberately');
const themes=Object.fromEntries(['light','dark'].map(theme=>[theme,resolveTheme({theme,...DEFAULT_SELECTION}).tokens]));
const lockSource=git('show',`${area}:package-lock.json`), lock=JSON.parse(lockSource), dependencyVersions={};
for(const name of ['apca-w3']){
  const version=JSON.parse(readFileSync(join(deps,name,'package.json'),'utf8')).version;
  if(version!==lock.packages[`node_modules/${name}`].version)throw Error(`Dependency mismatch: ${name}`);
  dependencyVersions[name]=version;
}
const input={checked:'2026-10-11',areaCommit:area,researchCommit:research,selection:DEFAULT_SELECTION,
  presets:{path:presetPath,sha256:hash(presetSource)},dependencyVersions,lockSha256:hash(lockSource),sourceHashes,themes,assertions:ASSERTIONS};
const output=JSON.stringify(input,null,2)+'\n';
const dest=join(here,'inputs.json');
if(process.argv.includes('--check')){if(readFileSync(dest,'utf8')!==output)throw Error('Frozen inputs differ');}
else writeFileSync(dest,output);
console.log(`${Object.keys(themes).length} modes; ${ASSERTIONS.length} source assertions; ${output.length} bytes; ${area}`);
