import * as React from 'react';
import './App.css';
import * as PIXI from 'pixi.js';
// import * as update from 'immutability-helper';
// import { normal } from 'jStat';
// import { range } from './lib/helper';

const logo = require('./logo.svg');

interface Point {
  x: number;
  y: number;
  group?: number;
}

interface AppState {
  points: Point[];
}

interface AppProps {
  state: 'drawing' | 'box-selecting';
  initalPoints: Point[];
  onStateChange: (state: AppState) => any;
}


class App extends React.Component<AppProps, {}> {
  // private static readonly COLOR_PALETTE: string[] =
  //   ['#db2d20', '#01a0e4', '#01a252', '#a16a94', '#222222', '#b5e4f4'];

  private canvas: HTMLDivElement | null;
  private dotG: PIXI.Graphics;
  private squareT: PIXI.Texture;
  private container: PIXI.Container;
  private app: PIXI.Application;

  // We use an alternative state variable to by pass the default React Component
  // life cycle. We don't want, e.g., batched-update.
  private _state: AppState = {
    points: [],
  };

  public constructor(props: AppProps) {
    super(props);

    this.app = new PIXI.Application({ width: 800, height: 800, backgroundColor: 0x000000 });
    this.dotG = new PIXI.Graphics();
    this.dotG.lineStyle(0);
    this.dotG.beginFill(0xffff0b, 0.5);
    this.dotG.drawCircle(0, 0, 5);
    this.dotG.endFill();

    this.squareT = this.app.renderer.generateTexture(this.dotG, 1);

    this.container = new PIXI.Container();
    this.container.x = 0;
    this.container.y = 0;
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.hitArea = new PIXI.Rectangle(0, 0, 800, 800);
    this.container.on('pointertap', (e) => {
      const square = new PIXI.Sprite(this.squareT);
      square.x = e.data.global.x;
      square.y = e.data.global.y;
      square.anchor.set(0.5);
      this.container.addChild(square);
      this._state.points.push({ x: square.x, y: square.y });
      this.props.onStateChange(this._state);
    });

    this.app.stage.addChild(this.container);

    this.drawInitialPoints();
  }

  public componentDidMount() {
    if (this.canvas !== null) {
      this.canvas.appendChild(this.app.view);
    } else {
      console.error('The canvas element is not found!');
    }
  }

  private drawInitialPoints() {
    if (this.props.initalPoints) {
      this._state.points = this.props.initalPoints;
      this.addPoints(this._state.points);
    } else {
      this._state.points = [];
    }
  }

  private addPoints(points: Point[]) {
    for (let p of points) {
      const square = new PIXI.Sprite(this.squareT);
      square.x = p.x;
      square.y = p.y;
      square.anchor.set(0.5);
      this.container.addChild(square);
    }
  }

  public componentWillReceiveProps(nextProps: AppProps) {
    // TODO
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Dati React Component</h2>
        </div>
        <p className="App-intro">
          Enjoy playing!
        </p>
        <div ref={(x) => this.canvas = x} />
      </div>
    );
  }
}

export default App;
