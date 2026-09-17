export type Check = { id: string; label: string; pass: boolean; detail: string };
/** Intentionally asserts the desired contract. Existing failures are not skipped. */
export function runChecks(): Check[] {
  const result: Check[] = [];
  const el = (id: string) => { const node = document.getElementById(id); if (!node) throw new Error(`Missing fixture ${id}`); return node; };
  const token = (id: string, name: string) => {
    if (name === 'color-scheme') return getComputedStyle(el(id)).colorScheme;
    if (!getComputedStyle(el(id)).getPropertyValue(name).trim()) throw new Error(`Missing token ${name}`);
    const probe=document.createElement('span');probe.style.color=`var(${name})`;el(id).append(probe);
    const value=getComputedStyle(probe).color;probe.remove();return value;
  };
  const check = (id: string, label: string, actual: unknown, expected: unknown) => result.push({id,label,pass:actual===expected,detail:`Actual: ${JSON.stringify(actual)}; expected: ${JSON.stringify(expected)}`});
  for (const name of ['--area-accent-surface','--area-fg-accent','--area-accent-solid-hover']) check('F01/accent/'+name,'Accent-only child inherits dark polarity',token('nested-accent',name),token('explicit-accent',name));
  for (const name of ['--area-bg-page','--area-fg-default']) check('F01/neutral/'+name,'Neutral-only child inherits dark polarity',token('nested-neutral',name),token('explicit-neutral',name));
  for (const name of ['--area-bg-page','--area-fg-default','color-scheme']) check('F01/light/'+name,'Light boundary resets inherited dark values',token('light-reset',name),token('explicit-light',name));
  const input = el('lab-name') as HTMLInputElement;
  check('label/name','Input is associated with its visible label',input.labels?.[0]?.textContent,'Project name');
  check('F07/description','Input references its rendered description',input.getAttribute('aria-describedby')?.split(/\s+/).some(id=>document.getElementById(id)?.textContent==='Visible to everyone in your workspace.')??false,true);
  const invalid = el('lab-error') as HTMLInputElement;
  check('F07/required','Required field exposes native required state',invalid.required,true);
  check('invalid/state','Invalid input exposes invalid state',invalid.getAttribute('aria-invalid'),'true');
  const ids = Array.from(document.querySelectorAll('#tabs-first [id], #tabs-second [id]'),n=>n.id);
  check('F04/tab-ids','Multiple Tabs instances have unique relationships',new Set(ids).size,ids.length);
  check('F04/segmented-tabstops','Segmented has one tab stop',Array.from(el('lab-segmented').querySelectorAll('button')).filter(n=>n.tabIndex===0).length,1);
  const spinner = getComputedStyle(el('motion-probe'));
  check('F05/motion-none','Explicit motion none stops the spinner',spinner.animationName==='none'||spinner.animationDuration.split(',').every(n=>parseFloat(n)===0),true);
  const ui = el('comparison').dataset.areaUi;
  const height = ui==='compact'?28:32;
  for(const id of ['lab-button','lab-name','lab-access','lab-segmented']) check('size/'+id,'Medium outer height matches UI scale',Math.round((id==='lab-name'?el(id).parentElement!:el(id)).getBoundingClientRect().height),height);
  const slider = el('lab-slider') as HTMLInputElement;
  const expected = (Number(slider.value)-Number(slider.min))/(Number(slider.max)-Number(slider.min))*100;
  check('F07/slider-fill','Slider fill follows the current value',parseFloat(getComputedStyle(slider).getPropertyValue('--_pct')),expected);
  const fixtures = el('lab-fixtures') as HTMLDetailsElement;
  const wasOpen = fixtures.open;
  const previousFocus = document.activeElement as HTMLElement | null;
  fixtures.open = true;
  const tabButtons = el('tabs-first').querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabButtons[0]!.focus({preventScroll:true});
  check('focus/tab','Selected tab accepts focus',document.activeElement===tabButtons[0],true);
  tabButtons[0]!.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  check('F04/tab-arrow','Right arrow moves focus to the next tab',document.activeElement===tabButtons[1],true);
  previousFocus?.focus({preventScroll:true}); fixtures.open = wasOpen;
  return result;
}
