import SVG from 'svg.js';

const colorPalette = ['#db2d20', '#01a0e4', '#01a252', '#a16a94', '#222222', '#b5e4f4'];
const numColors = colorPalette.length;
const pointArray = [];

let currentColor = 1;
let overlayVisible = true;

const draw = SVG(document.body).addClass('canvas');
const overlay = draw.text('').move(10, 10)
  .font({
    family: 'monospace',
    size: 12,
  })
  .style({
    'user-select': 'none',
  });

function redrawOverlay() {
  overlay.text((add) => {
    add.tspan('left mouse button = create point').newLine();
    add.tspan('O = toggle overlay').newLine();
    add.tspan('D = previous color').newLine();
    add.tspan('F = next color').newLine();
    add.tspan('Z = remove last point').newLine();
    add.tspan('S = show CSV').newLine();
    add.tspan('R = show R data.frame').newLine();
    add.tspan('').newLine();
    add.tspan(`current color = ${currentColor}`).fill(colorPalette[currentColor - 1]).newLine();
    add.tspan(`number of points = ${pointArray.length}`).newLine();
  });
}

function generateRDataFrame() {
  let xs = 'c(';
  let ys = 'c(';
  let groups = 'factor(c(';
  Object.keys(pointArray).forEach((i) => {
    if (i > 0) {
      xs += ',';
      ys += ',';
      groups += ',';
    }
    const pt = pointArray[i];
    xs += pt.cx();
    ys += (-pt.cy());
    groups += pt.attr('color-group');
  });
  xs += ')';
  ys += ')';
  groups += '))';

  const text = `data.frame(x=${xs}, y=${ys}, group=${groups})`;
  return text;
}

function generateCSV() {
  let text = '';
  Object.keys(pointArray).forEach((i) => {
    const pt = pointArray[i];
    text += [pt.cx(), (-pt.cy()), pt.attr('color-group')].join(',');
    text += '\n';
  });
  return text;
}


redrawOverlay();

draw.on('click', (e) => {
  const newPointSVG = draw.circle(10)
    .fill(colorPalette[currentColor - 1])
    .move(e.offsetX, e.offsetY)
    .attr('color-group', currentColor);

  pointArray.push(newPointSVG);

  redrawOverlay();
});


function showText(textGenerator) {
  const csvContent = `data:text/text;charset=utf-8,${textGenerator()}`;
  open(encodeURI(csvContent));
}

document.body.addEventListener('keypress', (e) => {
  switch (e.code) {
    case 'KeyF':
      if (currentColor < numColors) {
        currentColor += 1;
        redrawOverlay();
      }
      break;
    case 'KeyD':
      if (currentColor > 1) {
        currentColor -= 1;
        redrawOverlay();
      }
      break;
    case 'KeyZ':
      if (pointArray.length > 0) {
        pointArray.pop().remove();
      }
      redrawOverlay();
      break;
    case 'KeyO':
      if (overlayVisible) {
        overlay.hide();
        overlayVisible = false;
      } else {
        overlay.show();
        overlayVisible = true;
      }
      break;
    case 'KeyS':
      showText(generateCSV);
      break;
    case 'KeyR':
      showText(generateRDataFrame);
      break;
    default:
      break;
  }
});
