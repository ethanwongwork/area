import { hydrateRoot } from 'react-dom/client';
import { Board } from './board';
hydrateRoot(document.getElementById('lab-root')!, <Board/>);
