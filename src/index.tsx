import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PointBoard from './PointBoard';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { range } from './lib/helper';
import { normal } from 'jStat';

const initialPoints = [];
for (let _ of range(5000)) {
  initialPoints.push({ x: normal.sample(400, 100), y: normal.sample(400, 100) });
}

ReactDOM.render(
  <PointBoard state="drawing" initalPoints={initialPoints} />,
  document.getElementById('root') as HTMLElement,
);

registerServiceWorker();
