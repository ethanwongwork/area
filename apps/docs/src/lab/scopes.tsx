import { useState } from 'react';
import { Button, Input, Select } from '@area/react';
import { ReactScopes } from './react-scopes';
import { runScopeChecks, type ScopeResult } from './scope-checks';

function Sample({ name }: { name: string }) {
  return <div className="scope-sample">
    <strong>{name}</strong>
    <span>Project settings</span>
    <Input aria-label={`${name} project`} defaultValue="Area" />
    <Select aria-label={`${name} access`} defaultValue="team"><option value="team">Workspace members</option></Select>
    <Button tone="brand" variant="outline">Save changes</Button>
  </div>;
}
export function ScopeBoard() {
  const [result, setResult] = useState<ScopeResult | null>(null);
  const [busy, setBusy] = useState(false);
  return <>
    <header className="lab-header">
      <a href="./lab.html">Area / System lab</a>
      <h1>Theme boundaries</h1>
      <p>Each pair should match. The left card inherits its context; the right declares the complete selection.</p>
      <Button variant="outline" disabled={busy} onClick={async()=>{
        setBusy(true);setResult(null);
        try { setResult(await runScopeChecks()); }
        catch(error) { setResult({passed:0,failed:1,checks:[{id:'harness',pass:false,detail:String(error)}]}); }
        finally { setBusy(false); }
      }}>{busy?'Checking…':'Run scope checks'}</Button>
    </header>
    <main>
      <section className="lab-stage" data-area-theme="dark" data-area-neutral="neutral" data-area-brand="indigo">
        <h2>Inside a dark section</h2>
        <div className="scope-grid">
          <div data-area-neutral="warm"><Sample name="Inherited dark · warm"/></div>
          <div data-area-theme="dark" data-area-neutral="warm"><Sample name="Explicit dark · warm"/></div>
          <div data-area-brand="green"><Sample name="Inherited dark · green"/></div>
          <div data-area-theme="dark" data-area-brand="green"><Sample name="Explicit dark · green"/></div>
        </div>
      </section>
      <section className="lab-stage" data-area-theme="dark" data-area-neutral="warm" data-area-brand="green">
        <h2>A light island inside dark</h2>
        <div className="scope-grid">
          <div data-area-theme="light"><Sample name="Inherited warm + green · light"/></div>
          <div data-area-theme="light" data-area-neutral="warm" data-area-brand="green"><Sample name="Explicit warm + green · light"/></div>
        </div>
      </section>
      <ReactScopes onChange={()=>setResult(null)}/>
      <section className="lab-report">
        <h2>Scope results</h2>
        <p role="status">{result?`${result.passed} passed / ${result.failed} failed`:'Checks have not run.'}</p>
        <p>Computed colors are compared with build-time output from the independent semantic resolver. The fixture tests nesting, native scheme, attribute changes and removal.</p>
        {result&&<><ul>{result.checks.filter(c=>!c.pass).slice(0,30).map(c=><li key={c.id}>{c.id}: {c.detail}</li>)}</ul><details><summary>Machine-readable report</summary><pre id="scope-report-json">{JSON.stringify(result,null,2)}</pre></details></>}
      </section>
    </main>
  </>;
}
