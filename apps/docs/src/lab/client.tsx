import { hydrateRoot } from 'react-dom/client';
import { Board } from './board';
import { ScopeBoard } from './scopes';
declare const AREA_LAB_PAGE: string;
hydrateRoot(document.getElementById('lab-root')!, AREA_LAB_PAGE==='scopes'?<ScopeBoard/>:<Board/>);
