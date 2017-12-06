import * as React from 'react';
import './PointBoard.css';
import * as PIXI from 'pixi.js';
// import * as update from 'immutability-helper';
// import { normal } from 'jStat';
// import { range } from './lib/helper';
import * as d3 from 'd3-force';

// const logo = require('./logo.svg');

interface Point {
  x: number;
  y: number;
  sprite?: PIXI.Sprite;
  group?: number;
}

interface PointBoardProps {
  state: 'drawing' | 'box-selecting';
  initalPoints: Point[];
}

class PointBoard extends React.Component<PointBoardProps, {}> {
  // private static readonly COLOR_PALETTE: string[] =
  //   ['#db2d20', '#01a0e4', '#01a252', '#a16a94', '#222222', '#b5e4f4'];

  // Assets that should only be initialized once
  private app: PIXI.Application;
  private dotGraphics: PIXI.Graphics;
  private squareTexture: PIXI.Texture;
  private container: PIXI.Container;
  private canvas: HTMLDivElement | null;

  private forceSimulation: d3.Simulation<Point, undefined>;

  // State properties. Note that we abandoned the default state management system to
  // avoid re-rendering of the DOM element.
  private points: Point[];

  public constructor(props: PointBoardProps) {
    super(props);
    this.initalizeState();
    this.initalizeScene();
  }

  public componentDidMount() {
    this.mountAppView();
  }

  public shouldComponentUpdate() {
    // This stops both `setProps` and `setState` from taking effect.
    return false;
  }

  public render() {
    return (
        <div id="canvas" ref={(x: HTMLDivElement) => (this.canvas = x)} />
    );
  }

  private mountAppView() {
    if (this.canvas !== null) {
      this.app.view.width = this.canvas.clientWidth;
      this.app.view.height = this.canvas.clientHeight;
      this.canvas.appendChild(this.app.view);
    } else {
      console.error('The canvas element is not found!');
    }
  }

  private initalizeState() {
    this.points = [];
  }

  private initalizeScene() {
    this.app = new PIXI.Application({ width: 1920, height: 1000, backgroundColor: 0x000000 });

    this.dotGraphics = new PIXI.Graphics();
    this.dotGraphics.beginFill(0xffff0b, 0.5);
    this.dotGraphics.drawCircle(0, 0, 5);
    this.dotGraphics.endFill();

    this.squareTexture = this.app.renderer.generateTexture(this.dotGraphics, PIXI.SCALE_MODES.NEAREST);

    this.container = new PIXI.Container();
    this.container.x = 0;
    this.container.y = 0;
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.hitArea = new PIXI.Rectangle(0, 0, 800, 800);
    this.container.on('pointerdown', e => {
      this.addPoints([{ x: e.data.global.x, y: e.data.global.y }]);
    });

    this.forceSimulation = d3.forceSimulation(this.points)
      .force('charge', d3.forceManyBody().strength(-4))
      .force('center', d3.forceCenter(400, 400))
      .stop();

    this.app.ticker.add((delta) => {
      this.forceSimulation.tick();
      this.updateSprites();
    });

    this.app.stage.addChild(this.container);

    this.addPoints(this.props.initalPoints);
  }

  private updateSprites() {
    for (let p of this.points) {
      if (p.sprite) {
        p.sprite.x = p.x;
        p.sprite.y = p.y;
      }
    }
  }

  private addPoints(points: Point[]) {
    for (let p of points) {
      const square = new PIXI.Sprite(this.squareTexture);
      square.x = p.x;
      square.y = p.y;
      square.anchor.set(0.5);
      p.sprite = square;
      this.container.addChild(square);
    }
    this.points.push(...points);
    this.forceSimulation.nodes(this.points).alpha(1);
  }
}

export default PointBoard;
