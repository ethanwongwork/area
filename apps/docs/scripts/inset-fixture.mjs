import { writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Chip, Badge, Input, Select, Segmented, Nav, NavItem, Menu, MenuItem, Token, Kbd, Tabs, Tooltip, Panel, Textarea, Alert, Toast, Checkbox, Radio, Switch } from '../../../packages/react/dist/modules/index.js';

// Actual public React components, shared by the before and after specimen.
const icon = id => h('svg', { viewBox: '0 0 16 16', 'aria-hidden': true }, h('use', { href: `icons.svg#fl-${id}` }));
const globe = icon('globe');
const chevron = icon('chevron-down');
export function buildInsetFixture(out, repo) {
  const sections = [];
  for (const density of ['default', 'compact']) for (const type of ['geist', 'geist-compact', 'geist-large', 'system']) for (const dir of ['ltr', 'rtl']) for (const contrast of ['standard','more']) {
    const rows = ['xs','sm','md','lg','xl'].map(size => h('div', {className:'specimen-row', key:size},
      h('small',null,size),
      h(Button,{size,variant:'soft'},'Text'),
      h(Button,{size,variant:'soft',icon:globe,trailingIcon:chevron},'Text'),
      h(Button,{size,variant:'soft',trailingIcon:chevron},'Text'),
      h(Button,{size,variant:'soft',iconOnly:true,icon:globe,'aria-label':'Globe'}),
      h(Chip,{size,swatch:'var(--area-accent-solid)'},'Text'),
      h(Segmented,{size,value:'a',options:[{value:'a',label:'Text',icon:globe},{value:'b',label:'Text'}]}),
      h(Input,{size,icon:globe,'aria-label':`${size} search`,defaultValue:'Text'}),
      h(Select,{size,'aria-label':`${size} choice`},h('option',null,'Text')),
      h(Checkbox,{size,label:'Text',description:'Second line'}),h(Radio,{size,label:'Text',description:'Second line'}),h(Switch,{size,label:'Text',description:'Second line'})
    ));
    sections.push(h('section', {'data-area-density':density,'data-area-type':type,'data-area-contrast':contrast,'data-area-theme':contrast==='more'?'dark':'light','data-area-surface':contrast==='more'?'outlined':'flat','data-area-radius':contrast==='more'?'pill':'8',dir,key:density+type+dir+contrast},
      h('h2',null,`${density} · ${type} · ${dir} · ${contrast}`),...rows,
      h('div',{className:'specimen-row'},
        h(Badge,{dot:true},'Live'),h(Badge,{variant:'outline'},'Text'),
        h(Token,{swatch:'var(--area-accent-solid)'},'--area-accent'),h(Kbd,{keys:['cmd','k']}),
        h(Button,{variant:'soft'},'Égjpqy Ångström'),h(Tooltip,null,'Text'),
        h(Tabs,{tabs:[{id:density+type+dir+contrast,label:'Text'}],value:density+type+dir+contrast})),
      h('div',{className:'specimen-row'},
        h(Nav,null,h(NavItem,{href:'#',icon:globe,trailing:chevron,current:true},'Text')),
        h(Menu,null,h(MenuItem,{shortcut:h(Kbd,{size:'small',keys:['cmd','k']})},h('span',{className:'area-menu__icon'},globe),h('span',{className:'area-menu__text'},'Text'))),
        h(Nav,null,h(NavItem,{href:'#',icon:globe,trailing:h(Badge,null,'4'),current:true},'Text'))),
      h(Panel,{title:'Text',action:h(Button,{size:'sm',iconOnly:true,icon:chevron,'aria-label':'Close specimen'})},'Content'),
      h('div',{className:'specimen-row'},h(Textarea,{'aria-label':'Multiline text',defaultValue:'Text with accents: Égjpqy\nSecond line'}),h(Alert,{icon:globe,title:'Text'},'Text on the next line.'),h(Toast,{icon:globe},'Text'))));
  }
  const body=renderToStaticMarkup(h('main',null,h('h1',null,'Inset alignment'),h('p',null,'The same square icon boxes and font reference on every side. Outlines show layout boxes, not path bounds.'),h('button',{id:'run-insets',type:'button'},'Run geometry checks'),h('pre',{id:'inset-result','aria-live':'polite'}),h('p',null,h('a',{href:'inset-before.html'},'Before'),' · ',h('a',{href:'inset.html'},'After'),' · ',h('a',{href:'gallery.html'},'Gallery')), ...sections));
  const css=`body{padding:var(--area-space-24)}main{display:grid;gap:var(--area-space-24)}section{font-family:var(--area-font-sans);color:var(--area-fg-default);padding:var(--area-space-16);background:var(--area-bg-page);border:1px solid var(--area-border-decorative)}h1{font-size:var(--area-title-lg-size)}h2{font-size:var(--area-text-lg-size);margin-block-end:var(--area-space-16)}.specimen-row{display:flex;align-items:center;flex-wrap:wrap;gap:var(--area-space-16);margin-block:var(--area-space-12)}.specimen-row>.area-input,.specimen-row>.area-select{width:180px}.specimen-row>.area-nav{width:160px}.specimen-row>.area-menu{min-width:160px} :is(.area-button__icon,.area-input__icon,.area-segmented__icon,.area-chip__swatch){outline:1px solid var(--area-fg-danger)} :is(.area-button__label,.area-chip__label,.area-segmented__label){background:var(--area-warning-surface)}`;
  for(const before of [false,true]) writeFileSync(join(out,before?'inset-before.html':'inset.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inset alignment${before?' — before':''}</title><link rel="stylesheet" href="${before?'inset-before.css':'area.css'}"><style>${css}</style>${body}<script src="inset-check.js"></script></html>`);
  copyFileSync(join(repo,'apps/docs/scripts/inset-check.js'),join(out,'inset-check.js'));
  copyFileSync(join(repo,'docs/batches/V04/before.css'),join(out,'inset-before.css'));
}
