// @ts-expect-error — the existing docs highlighter is authored in JavaScript.
import { highlight } from '../../scripts/layout.mjs';
import { runPreferenceChecks } from './preference-checks';
import { runPaintChecks, type PaintReport } from './contrast-checks';
import { useState } from 'react';
import { Button, Input, Textarea, Select, Checkbox, Radio, Switch, Segmented, Chip, Slider, CodeBlock, Card, Field } from '@area/react';

export function ContrastBoard() {
  const [preferences,setPreferences]=useState<ReturnType<typeof runPreferenceChecks>|null>(null);
  const [report,setReport]=useState<PaintReport|null>(null);
  const [theme,setTheme]=useState('light');
  const [surface,setSurface]=useState('outlined');
  const [accent,setAccent]=useState('indigo');
  const [contrast,setContrast]=useState('standard');
  const [selection,setSelection]=useState('design');
  return <>
    <header className="lab-header"><a href="./lab.html">Area / System lab</a><h1>Edges, states and readable text</h1><p>Real components on the page and an inset surface. Use Tab to inspect keyboard focus.</p>
      <div className="contrast-controls">
        <Select aria-label="Theme" value={theme} onChange={e=>{setTheme(e.target.value);setReport(null);}}><option>light</option><option>dark</option></Select>
        <Select aria-label="Surface" value={surface} onChange={e=>{setSurface(e.target.value);setReport(null);}}>{['flat','outlined','raised','elevated'].map(v=><option key={v}>{v}</option>)}</Select>
        <Select aria-label="Accent" value={accent} onChange={e=>{setAccent(e.target.value);setReport(null);}}>{['blue','cyan','green','indigo','lime','orange','pink','purple','red','teal','yellow'].map(v=><option key={v}>{v}</option>)}</Select>
      </div>
    </header>
    <main id="contrast-stage" className="lab-stage" data-area-theme={theme} data-area-neutral="neutral" data-area-accent={accent} data-area-surface={surface} data-area-motion="none" data-area-contrast={contrast}>
      <div className="lab-row"><Button id="contrast-solid" tone="accent">Save changes</Button><Button id="contrast-outline" variant="outline">Invite people</Button><Chip selected>Design</Chip><Chip>Engineering</Chip><Button disabled>Unavailable</Button></div>
      <div className="lab-grid">
        <Card><div className="lab-stack"><h2>Project settings</h2><Field label="Project name" htmlFor="contrast-input"><Input id="contrast-input" placeholder="Enter a project name"/></Field><Field label="Access" htmlFor="contrast-select"><Select id="contrast-select"><option>Workspace members</option><option>Only invited people</option></Select></Field><Field label="Email" htmlFor="contrast-invalid" error="Enter a valid email address."><Input id="contrast-invalid" invalid defaultValue="area@"/></Field><Segmented id="contrast-segmented" fullWidth label="Team" options={[{value:'design',label:'Design'},{value:'engineering',label:'Engineering'}]} value={selection} onSelect={setSelection}/><div className="lab-row"><Checkbox id="contrast-unchecked" label="Updates"/><Checkbox id="contrast-checked" label="Mentions" defaultChecked/><Radio id="contrast-radio" label="Daily" defaultChecked name="frequency"/><Switch id="contrast-switch" label="Sync"/><Switch id="contrast-switch-on" label="Live" defaultChecked/></div></div></Card>
        <div className="lab-stack contrast-inset"><h2>On an inset surface</h2><Textarea id="contrast-textarea" aria-label="Notes" placeholder="Add context for your team"/><Slider id="contrast-slider" aria-label="Allocation" defaultValue={40}/><CodeBlock html={highlight('const project = "Area";\nconst enabled = true;\nexport { project, enabled };')}/><p>Quiet surfaces, light framing, and readable labels. Keyboard focus stays distinct.</p><Button variant="outline" onClick={()=>document.getElementById('contrast-input')?.focus()}>Focus project name</Button></div>
      </div>
    </main>
    <section className="lab-report"><h2>Painted contrast checks</h2><div className="lab-row"><Field label="Contrast preference" htmlFor="contrast-preference"><Select id="contrast-preference" value={contrast} onChange={e=>{setContrast(e.target.value);setReport(null);}}><option value="standard">Standard · soft edges</option><option value="more">More · stronger indicators</option></Select></Field><a href="./workbench.html">View compact workspace</a></div><p>Both modes are measured against the same 3:1 non-text threshold. Standard intentionally has low-contrast boundaries and selection indicators; these remain reported as failures. More restores stronger indicators. Text and keyboard focus are unchanged.</p><p>Focus the Run button with Tab, then press Enter. The matrix measures keyboard focus in the browser’s active input mode.</p><Button variant="outline" onClick={async()=>{setReport(null);try{setReport(await runPaintChecks());}catch(error){setReport({passed:0,failed:1,checks:[{id:'harness',pass:false,actual:String(error)}]});}}}>Run painted checks</Button><p role="status">{report?`${report.passed} passed / ${report.failed} failed`:'Checks have not run.'}</p>{report&&<><ul>{report.checks.filter(c=>!c.pass).slice(0,20).map(c=><li key={c.id}>{c.id}: {c.actual}</li>)}</ul><details><summary>Machine-readable report</summary><pre id="paint-report-json">{JSON.stringify(report,null,2)}</pre></details></>}</section>
    <section className="lab-report"><h2>Preference scope checks</h2><p>Checks quiet and strong alias endpoints through every axis boundary, including explicit nested resets. This is a CSS resolution check, separate from the accessibility audit.</p><Button variant="outline" onClick={()=>setPreferences(runPreferenceChecks())}>Run preference checks</Button><p id="preference-status">{preferences?`${preferences.passed} passed / ${preferences.failed} failed`:'Checks have not run.'}</p>{preferences&&<details><summary>Preference report</summary><pre id="preference-report-json">{JSON.stringify(preferences,null,2)}</pre></details>}</section>
  </>;
}
