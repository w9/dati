import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { range } from './lib/helper';
import { normal } from 'jStat';


const initialPoints = [];
for (let _ of range(100)) {
  initialPoints.push({ x: normal.sample(400, 100), y: normal.sample(400, 100) });
}

ReactDOM.render(
  <App state="drawing" onStateChange={(e) => console.log(e)} initalPoints={initialPoints} />,
  document.getElementById('root') as HTMLElement,
);

registerServiceWorker();
