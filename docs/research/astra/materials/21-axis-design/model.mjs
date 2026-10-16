// Proposal seeds and bounds, NOT approved preset values or production API.
export const roles=['page','container','floating-surface','raised-control','recessed-field-track','thumb-knob','indicator-fill','divider','edge','glyph','text','scrim','row-plate'];
export const presets=['none','glass','tactile','soft'];
export const bounds={
 lightAngle:{unit:'deg',min:0,max:360,default:315},
 lightHeight:{unit:'deg',min:0,max:90,default:45},
 opticalDepth:{unit:'px',min:0,max:24,default:6},
 shadowSoftness:{unit:'px',min:0,max:96,default:12},
 shadowSpread:{unit:'px',min:-32,max:32,default:0},
 shadowStrength:{unit:'ratio',min:0,max:2,default:1},
 glowStrength:{unit:'ratio',min:0,max:1,default:0},
 gradientAngle:{unit:'deg',min:0,max:360,default:180},
 strokeOpacity:{unit:'ratio',min:0,max:1,default:.25},
 fillOpacity:{unit:'ratio',min:0,max:1,default:1},
 grain:{unit:'ratio',min:0,max:1,default:0},
 gloss:{unit:'ratio',min:0,max:1,default:0},
 'glass.lightIntensity':{unit:'ratio',min:0,max:1,default:.35},
 'glass.refraction':{unit:'ratio',min:0,max:1,default:0,deferred:true},
 'glass.depth':{unit:'Area px; Figma docs do not specify units',min:1,max:128,default:24,deferred:true},
 'glass.dispersion':{unit:'ratio',min:0,max:1,default:0,deferred:true},
 'glass.radius':{unit:'Area CSS px (Frost)',min:0,max:64,default:12},
};
export const colors=['neutral','accent','info','success','warning','caution','danger','discovery'];
const base=Object.fromEntries(Object.entries(bounds).map(([key,spec])=>[key,spec.default]));
export const seeds={
 none:{...base,opticalDepth:0,shadowSoftness:0,shadowStrength:0,strokeOpacity:0,gloss:0,'glass.radius':0},
 glass:{...base,fillOpacity:.72,gloss:.45},
 tactile:{...base,fillOpacity:1,gloss:.65,grain:.04,'glass.radius':0},
 soft:{...base,opticalDepth:4,shadowSoftness:18,shadowStrength:.7,'glass.radius':0},
};
export const roleSeeds=Object.fromEntries(presets.map(p=>[p,Object.fromEntries(roles.map(r=>[r,p==='none'?0:['indicator-fill','divider','edge','scrim'].includes(r)?0:r==='row-plate'?({glass:.25,tactile:.4,soft:.55}[p]):r==='page'?.15:1]))]));
export function normalize(key,value){
 const b=bounds[key];if(!b||typeof value!=='number'||!Number.isFinite(value)||value<b.min||value>b.max)throw new RangeError(`${key}: ${value}`);
 if(b.deferred&&key!=='glass.depth'&&value!==0)throw new RangeError(`${key} is reserved until the D8 enhancement ships`);
 return key.endsWith('Angle')?value%360:value;
}
export function resolve(parent,patch={}){
 if(patch.preset!==undefined&&!presets.includes(patch.preset))throw new RangeError('preset');
 // Any explicit preset is a reset boundary, even the same ID. Omission inherits.
 const fresh=patch.preset!==undefined||!parent;
 const preset=patch.preset??parent?.preset??'none';
 const out={preset,controls:{...(fresh?seeds[preset]:parent.controls)},roles:{...(fresh?roleSeeds[preset]:parent.roles)},colorSource:fresh?'neutral':parent.colorSource,glowColorSource:fresh?'accent':parent.glowColorSource,strokeMode:fresh?(preset==='none'?'none':'solid'):parent.strokeMode,gradientStops:fresh?[{offset:0,source:'neutral',alpha:0},{offset:1,source:'accent',alpha:0}]:structuredClone(parent.gradientStops)};
 for(const [key,value] of Object.entries(patch.controls??{}))out.controls[key]=normalize(key,value);
 for(const [role,value] of Object.entries(patch.roles??{})){
  if(!roles.includes(role)||!Number.isFinite(value)||value<0||value>2)throw new RangeError('role strength');out.roles[role]=value;
 }
 for(const key of ['colorSource','glowColorSource'])if(patch[key]!==undefined){if(!colors.includes(patch[key]))throw new RangeError(key);out[key]=patch[key];}
 if(patch.strokeMode!==undefined){if(!['none','solid','gradient','top','double'].includes(patch.strokeMode))throw new RangeError('strokeMode');out.strokeMode=patch.strokeMode;}
 if(patch.gradientStops!==undefined){
  const a=patch.gradientStops;if(!Array.isArray(a)||a.length<2||a.length>8)throw new RangeError('gradient stops');
  let prev=-1;for(const s of a){if(!Number.isFinite(s.offset)||s.offset<prev||s.offset<0||s.offset>1||!colors.includes(s.source)||!Number.isFinite(s.alpha)||s.alpha<0||s.alpha>1)throw new RangeError('gradient stop');prev=s.offset;}
  out.gradientStops=structuredClone(a);
 }
 return out;
}
const kebab=s=>s.replaceAll('.','-').replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
export function axisDefinition(){
 return {id:'material',label:'Material',description:'Optical surface paint; geometry, ink and type remain independent.',defaultPreset:'none',namespaces:['--area-material-gate-','--area-material-input-','--area-material-role-'],presets:presets.map(id=>({id,label:id[0].toUpperCase()+id.slice(1),description:'Research proposal',tokens:{
 ...Object.fromEntries(['glass','tactile','soft'].map(p=>['--area-material-gate-'+p,p===id?'1':'0'])),
 ...Object.fromEntries(Object.entries(seeds[id]).map(([k,v])=>['--area-material-input-'+kebab(k),v+(bounds[k].unit==='deg'?'deg':bounds[k].unit.includes('px')?'px':'')])),
 ...Object.fromEntries(colors.flatMap(c=>[['--area-material-input-color-'+c,c==='neutral'?'1':'0'],['--area-material-input-glow-color-'+c,c==='accent'?'1':'0']])),
 ...Object.fromEntries(['none','solid','gradient','top','double'].map(m=>['--area-material-input-stroke-'+m,m===(id==='none'?'none':'solid')?'1':'0'])),
 ...Object.fromEntries(Array.from({length:8},(_,i)=>[['--area-material-input-stop-'+(i+1)+'-offset',i===0?'0':'1'],['--area-material-input-stop-'+(i+1)+'-alpha','0'],...colors.map(c=>['--area-material-input-stop-'+(i+1)+'-source-'+c,c===(i===0?'neutral':'accent')?'1':'0'])]).flat()),
 ...Object.fromEntries(roles.map(r=>['--area-material-role-'+r,String(roleSeeds[id][r])])),
 }}))};
}

// Public-prop adapter model: resolved state is context; a versioned patch cannot leak to another preset.
export function resolveThemeMaterial(parent,value,controlProp){
 const preset=value?.material;
 const effective=preset??parent?.preset??'none';
 if(controlProp==='preset')return {state:resolve(parent,{preset:effective}),discarded:false};
 const stale=controlProp!==undefined&&controlProp.for!==effective;
 const c=stale?undefined:controlProp;
 const controls={};
 if(c){for(const [k,v]of Object.entries(c)){if(k in bounds)controls[k]=v;}for(const [k,v]of Object.entries(c.glass??{}))controls['glass.'+k]=v;}
 return {state:resolve(parent,{...(preset!==undefined?{preset}:{}),controls,roles:c?.roleStrength,...Object.fromEntries(['colorSource','glowColorSource','strokeMode','gradientStops'].filter(k=>c?.[k]!==undefined).map(k=>[k,c[k]]))}),discarded:stale};
}
