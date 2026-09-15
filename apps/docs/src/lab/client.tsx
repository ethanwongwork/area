import { hydrateRoot } from 'react-dom/client';
import { Workbench } from './workbench';
import { Board } from './board';
import { ScopeBoard } from './scopes';
import { ContrastBoard } from './contrast';
declare const AREA_LAB_PAGE: string;
hydrateRoot(document.getElementById('lab-root')!, AREA_LAB_PAGE==='workbench'?<Workbench/>:AREA_LAB_PAGE==='contrast'?<ContrastBoard/>:AREA_LAB_PAGE==='scopes'?<ScopeBoard/>:<Board/>);
