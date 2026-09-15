import { useState } from 'react';
import { Badge, Button, Card, CardTitle, CardDescription, Field, Input, Nav, NavGroup, NavItem, NavSeparator, Panel, PanelSection, Segmented, Select, Switch, Table, Chip } from '@area/react';
import { SearchIcon, DotsFourIcon, TokenIcon, SlidersIcon, CheckIcon } from '../icons';

const resources = [
  {name:'Getting started',description:'A shared starting point for the team.',category:'Guides',status:'Published',updated:'Today'},
  {name:'Visual foundations',description:'Color, type, space, and the details between.',category:'Design',status:'Published',updated:'Today'},
  {name:'Working together',description:'Simple habits for a thoughtful workspace.',category:'Guides',status:'Draft',updated:'Yesterday'},
  {name:'Component library',description:'Consistent controls for everyday work.',category:'Design',status:'Published',updated:'Yesterday'},
];
/** A working composition of public Area components, not an alternative component skin. */
export function Workbench() {
  const [theme,setTheme]=useState('light');
  const [accent,setAccent]=useState('indigo');
  const [contrast,setContrast]=useState('standard');
  const [density,setDensity]=useState('compact');
  const [view,setView]=useState('cards');
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All categories');
  const [published,setPublished]=useState(false);
  const filtered=resources.filter(r=>(category==='All categories'||r.category===category)&&(!published||r.status==='Published')&&`${r.name} ${r.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="workbench" data-area-theme={theme} data-area-accent={accent} data-area-density={density} data-area-contrast={contrast} data-area-surface="outlined">
    <header className="workbench-bar"><a href="./index.html">Area</a><span>Workspace</span><a href="./contrast.html">Inspect contrast</a></header>
    <div className="workbench-shell">
      <aside className="workbench-sidebar"><Nav aria-label="Workspace navigation"><NavGroup label="Workspace"><NavItem current href="./workbench.html" icon={<DotsFourIcon/>}>Resources</NavItem><NavItem href="./index.html" icon={<TokenIcon/>}>Design system</NavItem><NavItem href="./lab.html" icon={<SlidersIcon/>}>System lab</NavItem></NavGroup><NavSeparator/><NavGroup label="Foundations"><NavItem href="./color.html">Color</NavItem><NavItem href="./typography.html">Typography</NavItem><NavItem href="./scopes.html">Themes & scopes</NavItem></NavGroup></Nav><p className="workbench-note">A quieter place<br/>to do good work.</p></aside>
      <main className="workbench-main">
        <div className="workbench-heading"><div><p className="workbench-eyebrow">TEAM LIBRARY</p><h1>Everything in its place</h1><p>Useful references, shared with care.</p></div><Badge tone="accent" dot>Design workspace</Badge></div>
        <div className="workbench-toolbar"><Input aria-label="Search resources" placeholder="Search resources" icon={<SearchIcon/>} value={query} onChange={e=>setQuery(e.target.value)}/><Select aria-label="Resource category" value={category} onChange={e=>setCategory(e.target.value)}>{['All categories','Guides','Design'].map(c=><option key={c}>{c}</option>)}</Select><Segmented size="md" label="Resource view" options={[{value:'cards',label:'Cards'},{value:'list',label:'List'}]} value={view} onSelect={setView}/></div>
        <div className="workbench-filter"><Chip selected={published} onClick={()=>setPublished(!published)}>Published only</Chip><span role="status">{filtered.length} resources</span></div>
        {filtered.length===0?<Card><CardTitle>No matching resources</CardTitle><CardDescription>Try another search or clear your filters.</CardDescription><Button variant="outline" onClick={()=>{setQuery('');setCategory('All categories');setPublished(false);}}>Clear filters</Button></Card>:view==='cards'?<div className="workbench-cards">{filtered.map(r=><Card key={r.name}><div className="workbench-card-top"><span className="workbench-mark"><TokenIcon/></span><Badge tone={r.status==='Published'?'accent':'neutral'}>{r.status}</Badge></div><CardTitle>{r.name}</CardTitle><CardDescription>{r.description}</CardDescription><div className="workbench-meta"><span>{r.category}</span><span>{r.updated}</span></div></Card>)}</div>:<Table aria-label="Resources"><thead><tr><th>Resource</th><th>Status</th><th>Updated</th></tr></thead><tbody>{filtered.map(r=><tr key={r.name}><td>{r.name}</td><td><Badge tone={r.status==='Published'?'accent':'neutral'}>{r.status}</Badge></td><td>{r.updated}</td></tr>)}</tbody></Table>}
        <div className="workbench-bottom"><Panel title="Appearance" size="sm"><PanelSection><Field label="Theme" htmlFor="workbench-theme" inline><Select id="workbench-theme" value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></Select></Field><Field label="Accent" htmlFor="workbench-accent" inline><Select id="workbench-accent" value={accent} onChange={e=>setAccent(e.target.value)}>{['blue','cyan','green','indigo','lime','orange','pink','purple','red','teal','yellow'].map(c=><option key={c}>{c}</option>)}</Select></Field><Field label="Density" htmlFor="workbench-density" inline><Select id="workbench-density" value={density} onChange={e=>setDensity(e.target.value)}><option value="compact">Compact</option><option value="default">Default</option></Select></Field><Field label="Contrast" inline><Switch aria-label="Increase contrast" checked={contrast==='more'} onChange={e=>setContrast(e.target.checked?'more':'standard')}/></Field></PanelSection></Panel><section className="workbench-activity"><h2>Made for everyday work</h2><div className="workbench-activity-line"><CheckIcon/><span>Light layers keep the workspace calm.</span></div><div className="workbench-activity-line"><CheckIcon/><span>One accent connects related actions.</span></div><div className="workbench-activity-line"><CheckIcon/><span>Compact controls share a common height.</span></div><p>Adjust the appearance to compare the same components across themes.</p></section></div>
      </main>
    </div>
  </div>;
}
