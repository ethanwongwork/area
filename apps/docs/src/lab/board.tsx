/** Owned comparison fixture. Every specimen is the shipped React component. */
import { useState } from 'react';
import { Alert, Badge, Button, Checkbox, Chip, CodeBlock, Field, Input, Menu, MenuItem, Panel, PanelSection, Popover, Segmented, Select, Slider, Spinner, Tabs } from '@area/react';
import { runChecks, type Check } from './checks';

const profiles = [
  { name: 'Light · neutral · default', theme: 'light', neutral: 'neutral', density: 'default', radius: '8', surface: 'outlined' },
  { name: 'Dark · neutral · default', theme: 'dark', neutral: 'neutral', density: 'default', radius: '8', surface: 'outlined' },
  { name: 'Light · cool · compact · sharp', theme: 'light', neutral: 'cool', density: 'compact', radius: '0', surface: 'flat' },
  { name: 'Dark · warm · compact · pill', theme: 'dark', neutral: 'warm', density: 'compact', radius: 'pill', surface: 'elevated' },
  { name: 'Light · warm · default · elevated', theme: 'light', neutral: 'warm', density: 'default', radius: '8', surface: 'elevated' },
  { name: 'Dark · cool · default · flat', theme: 'dark', neutral: 'cool', density: 'default', radius: '8', surface: 'flat' },
];
const options = [{value:'overview',label:'Overview'}, {value:'activity',label:'Activity'}];
const tabs = [{id:'account',label:'Account'}, {id:'settings',label:'Settings'}];
export function Board() {
  const [profile, setProfile] = useState(0);
  const [selection, setSelection] = useState('overview');
  const [checks, setChecks] = useState<Check[]>([]);
  const p = profiles[profile] ?? profiles[0]!;
  return <>
    <header className="lab-header">
      <a href="./index.html">Area / System lab</a>
      <h1>One system. The same specimens.</h1>
      <p>Compare control edges, surfaces and states across six representative profiles. This is a working baseline; known regressions remain visible below.</p>
      <div className="lab-row">
        <Field label="Comparison profile" htmlFor="lab-profile"><Select id="lab-profile" value={profile} onChange={e=>{setProfile(Number(e.target.value));setChecks([]);}}>{profiles.map((p,i)=><option key={p.name} value={i}>{p.name}</option>)}</Select></Field>
        <Button variant="outline" onClick={()=>{try{setChecks(runChecks());}catch(error){setChecks([{id:'harness/error',label:'The harness could not complete',pass:false,detail:String(error)}]);}}}>Run browser checks</Button>
        <a href="#regressions">Regression results</a><a href="./scopes.html">Theme boundaries</a><a href="./contrast.html">Edges and contrast</a>
      </div>
    </header>
    <main>
      <section id="comparison" className="lab-stage" aria-label={p.name} data-area-theme={p.theme} data-area-neutral={p.neutral} data-area-accent="indigo" data-area-density={p.density} data-area-radius={p.radius} data-area-surface={p.surface} data-area-motion="subtle">
        <div className="lab-row lab-between"><h2>{p.name}</h2><Badge tone="success" dot>Baseline E01</Badge></div>
        <div className="lab-row">
          <Button id="lab-button">Create project</Button><Button variant="outline">Invite people</Button><Button variant="ghost">View activity</Button><Button disabled>Unavailable</Button><Chip selected>Design</Chip><Chip>Engineering</Chip>
        </div>
        <div className="lab-grid">
          <Panel title="Project settings" size="sm" footer={<div className="lab-row"><Button size="sm">Save changes</Button><Button size="sm" variant="ghost">Cancel</Button></div>}>
            <PanelSection heading="Details"><div className="lab-stack">
              <Field label="Project name" description="Visible to everyone in your workspace." htmlFor="lab-name"><Input id="lab-name" defaultValue="Area design system" /></Field>
              <Field label="Access" htmlFor="lab-access"><Select id="lab-access" defaultValue="team"><option value="team">Workspace members</option><option value="private">Only invited people</option></Select></Field>
              <Field label="Contact email" error="Enter a valid email address." required htmlFor="lab-error"><Input id="lab-error" invalid defaultValue="area@" /></Field>
            </div></PanelSection>
            <PanelSection heading="Preferences"><div className="lab-stack"><Segmented id="lab-segmented" fullWidth label="Project view" value={selection} onSelect={setSelection} options={options}/><Checkbox id="lab-checkbox" label="Send activity updates" defaultChecked/><Field label="Allocation" htmlFor="lab-slider"><Slider id="lab-slider" min={0} max={100} defaultValue={40}/></Field></div></PanelSection>
          </Panel>
          <div className="lab-stack">
            <Popover><div className="lab-stack"><strong>Share this project</strong><span>People with access can review the latest changes.</span><Button variant="outline" size="sm">Copy link</Button></div></Popover>
            <Menu aria-label="Project actions"><MenuItem>Open project</MenuItem><MenuItem>Duplicate</MenuItem><MenuItem tone="danger">Archive project</MenuItem></Menu>
            <Alert title="Changes saved" tone="success">Your workspace is up to date.</Alert>
            <CodeBlock code={'Project: Area\nAccess: Workspace members\nStatus: Ready for review'} />
          </div>
        </div>
      </section>
      <section className="lab-report" id="regressions">
        <h2>Regression results</h2><p>Checks run against actual rendered components and computed styles. A failure is an open defect, never an expected-pass waiver. This focused harness complements the full token suite.</p>
        <p role="status">{checks.length ? `${checks.filter(c=>c.pass).length} passed / ${checks.filter(c=>!c.pass).length} failed / ${checks.length} checks` : 'Checks have not run. Select Run browser checks.'}</p>
        <ul className="lab-results">{checks.map(c=><li key={c.id}><strong>{c.pass?'PASS':'FAIL'} · {c.id}</strong> {c.label}<pre>{c.detail}</pre></li>)}</ul>
        {checks.length>0&&<details><summary>Machine-readable report</summary><pre id="lab-report-json">{JSON.stringify({profile:p.name,checks},null,2)}</pre></details>}
        <details id="lab-fixtures"><summary>Scope and behavior fixtures</summary>
          <p>Keyboard probes: focus Account and press Right. Focus Overview and press Right. Move Allocation with Right and rerun checks. These are real hydrated wrappers; the fixture does not add missing component behavior.</p>
          <div data-area-theme="dark">
            <div id="nested-accent" data-area-accent="green">Inherited dark + green</div><div id="explicit-accent" data-area-theme="dark" data-area-accent="green">Explicit dark + green</div>
            <div id="nested-neutral" data-area-neutral="warm">Inherited dark + warm</div><div id="explicit-neutral" data-area-theme="dark" data-area-neutral="warm">Explicit dark + warm</div>
            <div id="light-reset" data-area-theme="light">Light island</div>
          </div>
          <div id="explicit-light" data-area-theme="light">Explicit light</div>
          <div data-area-motion="none"><Spinner id="motion-probe" label="Motion none probe"/></div>
          <Tabs id="tabs-first" tabs={tabs} value="account">Account details</Tabs><Tabs id="tabs-second" tabs={tabs} value="account">Second account details</Tabs>
        </details>
      </section>
    </main>
  </>;
}
