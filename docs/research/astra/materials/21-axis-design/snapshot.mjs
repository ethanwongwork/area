// Read pinned Area modules through Git without writing a package checkout or build.
import {execFileSync} from 'node:child_process';
import {createRequire, registerHooks, stripTypeScriptTypes} from 'node:module';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import fs from 'node:fs';
export const HERE=path.dirname(fileURLToPath(import.meta.url));
let root=HERE;while(!fs.existsSync(path.join(root,'.git')))root=path.dirname(root);
export const ROOT=root;
export const SHA='4ea50618cf19e8737b607c9f983f64dd310d921d';
export const REVIEW='0169fb7b6d85a910a24a684f9b5b3b537a735956';
export const read=(p)=>execFileSync('git',['show',`${SHA}:${p}`],{cwd:ROOT,encoding:'utf8'});
const deps=createRequire(path.join(process.env.AREA_DEPENDENCIES ?? ROOT,'package.json'));
registerHooks({
 resolve(specifier,context,next){
  if(specifier.startsWith('area-git:'))return {url:specifier,shortCircuit:true};
  if(context.parentURL?.startsWith('area-git:')&&specifier.startsWith('.'))return {url:'area-git:'+path.posix.normalize(path.posix.join(path.posix.dirname(context.parentURL.slice(9)),specifier)),shortCircuit:true};
  if(context.parentURL?.startsWith('area-git:')&&!specifier.startsWith('node:'))return {url:pathToFileURL(deps.resolve(specifier)).href,shortCircuit:true};
  return next(specifier,context);
 },
 load(url,context,next){
  if(!url.startsWith('area-git:'))return next(url,context);
  const p=url.slice(9),source=read(p);
  return {format:p.endsWith('.json')?'json':'module',source:p.endsWith('.ts')?stripTypeScriptTypes(source,{mode:'strip'}):source,shortCircuit:true};
 }
});
export const registry=await import('area-git:packages/tokens/src/axes/registry.ts');
