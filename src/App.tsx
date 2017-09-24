import * as React from 'react';
import './App.css';
import * as PIXI from 'pixi.js';
// import { normal } from 'jStat';
// import { range } from './lib/helper';

const logo = require('./logo.svg');

class App extends React.Component {
  canvas: HTMLDivElement | null;

  colorPalette: string[] = ['#db2d20', '#01a0e4', '#01a252', '#a16a94', '#222222', '#b5e4f4'];

  constructor() {
    super();
  }

  componentDidMount() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(0);
    graphics.beginFill(0xffff0b, 0.5);
    graphics.drawCircle(0, 0, 5);
    graphics.endFill();

    const app = new PIXI.Application({ width: 800, height: 800, backgroundColor: 0x000000 });
    if (this.canvas !== null) {
      console.log(this.canvas);
      this.canvas.appendChild(app.view);
    }

    const squareTexture = app.renderer.generateTexture(graphics, 1);

    // for (const _ of range(10000)) {
    //   const square = new PIXI.Sprite(squareTexture);
    //   square.x = normal.sample(400, 100);
    //   square.y = normal.sample(400, 100);
    //   // square.x = (Math.random() - 0.5) * 700 + 400;
    //   // square.y = (Math.random() - 0.5) * 700 + 400;
    //   square.anchor.set(0.5);

    //   // app.ticker.add((delta) => {
    //   //   square.rotation += 0.1 * delta;
    //   // });

    //   app.stage.addChild(square);
    // }

    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 800);
    app.stage.on('pointertap', (e) => {
      console.log(e.data.global);
      const square = new PIXI.Sprite(squareTexture);
      square.x = e.data.global.x;
      square.y = e.data.global.y;
      square.anchor.set(0.5);

      // app.ticker.add((delta) => {
      //   square.rotation += 0.1 * delta;
      // });

      app.stage.addChild(square);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div ref={(x) => this.canvas = x} />
      </div>
    );
  }
}

export default App;
