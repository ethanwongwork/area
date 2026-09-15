import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_AXES } from '@area/tokens/config';
import { Button, Theme, useTheme } from '@area/react';

function PortalSample() {
  const [target,setTarget]=useState<HTMLElement|null>(null);
  const selection=useTheme();
  useEffect(()=>{
    const node=document.createElement('div');
    node.id='scope-portal-target';document.body.append(node);setTarget(node);
    return ()=>node.remove();
  },[]);
  return target ? createPortal(
    <Theme id="react-portal" hidden aria-label="Portal scope probe" data-selection={JSON.stringify(selection)}>
      <Button>Portal action</Button>
    </Theme>,target) : null;
}
export function ReactScopes({onChange}:{onChange:()=>void}) {
  const [dark,setDark]=useState(true);
  const [override,setOverride]=useState(true);
  const expected={...DEFAULT_AXES,theme:dark?'dark':'light',neutral:'warm',accent:override?'red':'green',density:'compact',radius:'pill'};
  return <section className="lab-report">
    <h2>React scope and portal</h2>
    <p>The hidden portal probe mounts directly under the document body, outside this scope's DOM ancestry. Its colors and all eight selections should follow React context.</p>
    <p id="react-requested" data-expected={JSON.stringify(expected)}>Expected: {expected.theme} / warm / {expected.accent} · compact · pill.</p>
    <div className="lab-row">
      <Button variant="outline" onClick={()=>{setDark(v=>!v);onChange();}}>Toggle React theme</Button>
      <Button variant="outline" onClick={()=>{setOverride(v=>!v);onChange();}}>Toggle child override</Button>
    </div>
    <Theme id="react-parent" value={{theme:dark?'dark':'light',neutral:'warm',accent:'green',density:'compact',radius:'pill'}}>
      <Theme id="react-child" value={override?{accent:'red'}:{}}><PortalSample/></Theme>
    </Theme>
  </section>;
}
