export interface PaintCheck { id:string; pass:boolean; actual:string; }
export interface PaintReport { mode?:string; passed:number; failed:number; checks:PaintCheck[]; }

/** App-owned probe: measure painted properties, including alpha, instead of token strings. */
export async function runPaintChecks(): Promise<PaintReport> {
  if (!document.activeElement?.matches(":focus-visible")) throw new Error("Use Tab to focus Run painted checks, then press Enter. Keyboard focus must be active before measuring :focus-visible.");
  const stage=document.getElementById('contrast-stage')!;
  const checks:PaintCheck[]=[];
  const original=Object.fromEntries(['theme','neutral','accent','surface'].map(k=>[k,stage.getAttribute(`data-area-${k}`)!]));
  const previous=document.activeElement as HTMLElement|null;
  const themes=await (await fetch('./scope-reference.json')).json() as {theme:string;neutral:string;accent:string}[];
  const el=(id:string)=>document.getElementById(`contrast-${id}`)!;
  const css=(node:Element,pseudo?:string)=>getComputedStyle(node,pseudo);
  const rgba=(value:string):number[]=>{
    const srgb=value.match(/^color\(srgb\s+(.+)\)$/);
    if(srgb){const parts=srgb[1]!.split(/[\s/]+/).filter(Boolean).map(Number);return [parts[0]!,parts[1]!,parts[2]!,parts[3]??1];}
    const match=value.match(/^rgba?\((.+)\)$/);
    if(!match)throw new Error(`Unmeasured color format: ${value}`);
    const parts=match[1]!.split(/[,\s/]+/).filter(Boolean).map(Number);
    return [parts[0]!/255,parts[1]!/255,parts[2]!/255,parts[3]??1];
  };
  const opaque=(v:string)=>rgba(v)[3]===1;
  const ratio=(foreground:string,background:string)=>{
    const fg=rgba(foreground),bg=rgba(background);
    if(bg[3]!==1)throw new Error(`Background must be resolved: ${background}`);
    const painted=fg.slice(0,3).map((c,i)=>c*fg[3]!+bg[i]!*(1-fg[3]!));
    const lum=(v:number[])=>v.slice(0,3).reduce((sum,c,i)=>sum+[.2126,.7152,.0722][i]!*(c<=.04045?c/12.92:((c+.055)/1.055)**2.4),0);
    const a=lum(painted),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  };
  const background=(node:Element):string=>{
    const value=css(node).backgroundColor;
    if(opaque(value))return value;
    if(node.parentElement)return background(node.parentElement);
    throw new Error('No opaque ancestor ground');
  };
  let context='';
  const check=(name:string,pass:boolean,actual:unknown)=>checks.push({id:`${context}/${name}`,pass,actual:String(actual)});
  const contrast=(name:string,fg:string,bg:string,min=3)=>{const r=ratio(fg,bg);check(name,r>=min,`${r.toFixed(4)}:1 (${fg} / ${bg})`);};
  try {
    for(const theme of themes)for(const surface of ['flat','outlined','raised','elevated']) {
      context=`${theme.theme}/${theme.neutral}/${theme.accent}/${surface}`;
      for(const [axis,value] of Object.entries({theme:theme.theme,neutral:theme.neutral,accent:theme.accent,surface}))stage.setAttribute(`data-area-${axis}`,value);
      // Layout forces the current scope to resolve; this specimen uses motion=none.
      const input=el('input'),shell=input.parentElement!;
      const textarea=el('textarea'),select=el('select'),invalid=el('invalid').parentElement!;
      for(const [name,node] of [['input',shell],['textarea',textarea],['select',select],['invalid',invalid]] as const) {
        const style=css(node);
        check(`${name}/edge-present`,parseFloat(style.borderTopWidth)>=1&&style.borderTopStyle==='solid',style.borderTop);
        contrast(`${name}/edge-outside`,style.borderTopColor,background(node.parentElement!));
        contrast(`${name}/edge-inside`,style.borderTopColor,background(node));
      }
      for(const node of [input,textarea])contrast(`${node.id}/placeholder`,css(node,'::placeholder').color,background(node),4.5);
      for(const id of ['unchecked','checked','radio','switch','switch-on']) {
        const node=el(id),style=css(node);
        contrast(`${id}/boundary`,style.borderTopColor,background(node.parentElement!));
        check(`${id}/edge-present`,parseFloat(style.borderTopWidth)>=1,style.borderTopWidth);
        if(id!=='unchecked') {
          const mark=css(node,'::after');
          check(`${id}/mark-geometry`,parseFloat(mark.width)>0&&parseFloat(mark.height)>0,`${mark.width} × ${mark.height}`);
          contrast(`${id}/mark`,mark.backgroundColor,style.backgroundColor);
        }
      }
      const selected=el('segmented').querySelector('[data-selected]')!;
      contrast('segment/selected-edge',css(selected).borderTopColor,background(selected.parentElement!));
      check('segment/edge-present',parseFloat(css(selected).borderTopWidth)>=1,css(selected).borderTopWidth);
      const chip=stage.querySelector('.area-chip[data-selected]')!;
      contrast('chip/selected-edge',css(chip).borderTopColor,background(chip));
      contrast('solid/label',css(el('solid')).color,background(el('solid')),4.5);
      for(const node of stage.querySelectorAll('.area-code-block .area-syntax-keyword, .area-code-block .area-syntax-string'))contrast(`syntax/${node.className}`,css(node).color,background(node),4.5);
      // Focusing a text field establishes visible focus for subsequent programmatic moves.
      input.focus({preventScroll:true});
      for(const node of [input,textarea,select,el('invalid'),el('solid'),el('outline'),selected as HTMLElement,chip as HTMLElement,el('unchecked'),el('switch')]) {
        node.focus({preventScroll:true});
        const painted=node.classList.contains('area-input__control')?node.parentElement!:node;
        const style=css(painted);
        const editable=painted.matches('.area-input,.area-textarea,.area-select');
        const increased=parseFloat(css(stage).getPropertyValue('--area-contrast-more'))>=1;
        const shadowLengths=style.boxShadow.match(/-?\d+(?:\.\d+)?px/g)?.map(value=>parseFloat(value))??[];
        const haloWidth=editable?Math.max(0,shadowLengths[shadowLengths.length-1]??0):0;
        const focusColor=editable&&!increased?style.borderTopColor:style.outlineColor;
        const geometry=editable&&!increased
          ? parseFloat(style.borderTopWidth)>=1&&style.borderTopStyle==='solid'&&haloWidth>=2&&style.boxShadow!=='none'
          : parseFloat(style.outlineWidth)>=2&&style.outlineStyle==='solid';
        const geometryValue=editable&&!increased
          ? `${style.borderTopWidth} ${style.borderTopStyle} edge + ${haloWidth}px halo`
          : `${style.outlineWidth} ${style.outlineStyle}`;
        check(`focus/${node.id||node.className}/geometry`,geometry,geometryValue);
        check(`focus/${node.id||node.className}/opaque`,opaque(focusColor),focusColor);
        contrast(`focus/${node.id||node.className}/contrast`,focusColor,background(painted.parentElement!));
        const rect=painted.getBoundingClientRect(),extra=Math.max(haloWidth,0,parseFloat(style.outlineOffset)+parseFloat(style.outlineWidth));
        let unclipped=true;
        for(let ancestor=painted.parentElement;ancestor;ancestor=ancestor.parentElement) {
          const a=css(ancestor),r=ancestor.getBoundingClientRect();
          if(/hidden|clip|auto|scroll/.test(a.overflowX)&& (rect.left-extra<r.left||rect.right+extra>r.right))unclipped=false;
          if(/hidden|clip|auto|scroll/.test(a.overflowY)&& (rect.top-extra<r.top||rect.bottom+extra>r.bottom))unclipped=false;
        }
        check(`focus/${node.id||node.className}/clipping`,unclipped,'Focus paint fits clipping ancestors in this fixture');
      }
      input.blur();
    }
  } finally {
    for(const [axis,value] of Object.entries(original))stage.setAttribute(`data-area-${axis}`,value);
    previous?.focus({preventScroll:true});
  }
  return {mode:stage.getAttribute('data-area-contrast')??'system',passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length,checks};
}
