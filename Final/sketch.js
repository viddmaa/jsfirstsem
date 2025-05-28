let canvas;
let currentTool   = 'pencil';
let currentFigure = 'square';
let currentColor  = '#000000';
let colors = [
  '#ff0000','#ff8000','#ffff00','#80ff00',
  '#00ff00','#00ffbf','#0000ff','#bf00ff',
  '#ff80bf','#00ff80','#000000','#ffffff',
  '#808080','#8b4513','#e040fb','#f8bbd0'
];

function setup() {
  noCanvas();
  let toolbar = select('#toolbar');

  // Tools panel
  let toolsPanel = createDiv('').addClass('panel').parent(toolbar);
  let toolsRow = createDiv('').addClass('panel-row').parent(toolsPanel);
  ['eraser','brush','fill','pencil'].forEach(name=>{
    let btn = createImg(`icons/${name}.png`, name).addClass('tool-icon').parent(toolsRow);
    btn.attribute('data-tool', name);
    btn.mousePressed(()=>selectTool(name));
  });
  createDiv('Tools').addClass('panel-label').parent(toolsPanel);

  // Figure panel
  let figPanel = createDiv('').addClass('panel').parent(toolbar);
  let figRow = createDiv('').addClass('panel-row').parent(figPanel);
  [
    ['square'],['line'],['arrow'],['circle'],
    ['triangle'],['star'],['rhombus']
  ].forEach(([name])=>{
    let btn = createImg(`icons/${name}.png`, name).addClass('figure-btn').parent(figRow);
    btn.attribute('data-figure', name);
    btn.mousePressed(()=>{
      selectTool('shape');
      currentFigure = name;
      updateFigureButtons();
    });
  });
  createDiv('Figure').addClass('panel-label').parent(figPanel);

  // Colour panel
  let colorPanel = createDiv('').addClass('panel').parent(toolbar);
  let colorRow1 = createDiv('').addClass('panel-row colors-grid').parent(colorPanel);
  let colorRow2 = createDiv('').addClass('panel-row colors-grid').parent(colorPanel);
  colors.slice(0,8).forEach(c=>{
    let sw = createDiv('').addClass('swatch').style('background',c).parent(colorRow1);
    sw.mousePressed(()=>{currentColor=c;});
  });
  colors.slice(8).forEach(c=>{
    let sw = createDiv('').addClass('swatch').style('background',c).parent(colorRow2);
    sw.mousePressed(()=>{currentColor=c;});
  });
  createDiv('+').addClass('add-color').parent(colorRow2).mousePressed(addColorPrompt);
  createDiv('Colour').addClass('panel-label').parent(colorPanel);

  // Canvas
  canvas = createCanvas(1200,800).parent('canvas-container');
  background(255);
}

function draw() {
  // Рамка
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(0,0,width-1,height-1);
}

function mouseDragged() {
  if (mouseY < 0) return;
  if (currentTool==='pencil') {
    stroke(currentColor); strokeWeight(2);
    line(pmouseX, pmouseY, mouseX, mouseY);
  } 
  else if (currentTool==='brush') {
    stroke(currentColor); strokeWeight(12);
    line(pmouseX, pmouseY, mouseX, mouseY);
  } 
  else if (currentTool==='eraser') {
    stroke(255); strokeWeight(30);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

let sx, sy;
function mousePressed() {
  if (!mouseIsPressedOnCanvas()) return;

  if (currentTool==='shape' && mouseY > 0) {
    sx = mouseX; sy = mouseY;
  }
  if (currentTool==='fill' && mouseY > 0) {
    floodFill(mouseX, mouseY, color(currentColor));
  }
}

function mouseReleased() {
  if (currentTool==='shape') {
    stroke(currentColor); noFill();
    let ex = mouseX, ey = mouseY;
    switch(currentFigure) {
      case 'square':
        let side = Math.max(Math.abs(ex-sx), Math.abs(ey-sy));
        rect(sx, sy, Math.sign(ex-sx)*side, Math.sign(ey-sy)*side);
        break;
      case 'rectangle':
        rect(sx, sy, ex-sx, ey-sy);
        break;
      case 'circle':
        let r = dist(sx,sy,ex,ey);
        ellipse(sx, sy, r*2, r*2);
        break;
      case 'line':
        line(sx, sy, ex, ey);
        break;
      case 'arrow':
        drawArrow(sx,sy,ex,ey);
        break;
      case 'triangle':
        triangle(sx,sy, ex,ey, sx-(ex-sx), ey);
        break;
      case 'star':
        drawStar(sx, sy, dist(sx,sy,ex,ey));
        break;
      case 'rhombus':
        drawRhombus(sx, sy, mouseX, mouseY);
        break;
    }
  }
}

function selectTool(name) {
  currentTool = name;
  selectAll('.tool-icon').forEach(ic=>{
    ic.removeClass('active');
    if (ic.elt.dataset.tool === name) ic.addClass('active');
  });
  selectAll('.figure-btn').forEach(b=>{b.removeClass('active');});
}
function updateFigureButtons(){
  selectAll('.figure-btn').forEach(b=>{
    if (b.elt.dataset.figure === currentFigure) b.addClass('active');
  });
}
function addColorPrompt(){
  let hex = prompt('Введи HEX типа #ff00ff', '');
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    colors.push(hex);
    let row = selectAll('.colors-grid')[1];
    let sw = createDiv('').addClass('swatch').style('background', hex).parent(row);
    sw.mousePressed(()=>{currentColor = hex; stroke(hex); fill(hex);});
  } else {
    alert('Неправильный HEX!');
  }
}
function drawArrow(x1,y1,x2,y2) {
  line(x1,y1,x2,y2);
  let a = atan2(y2-y1, x2-x1);
  push();
    translate(x2,y2);
    rotate(a);
    noStroke(); fill(currentColor);
    triangle(0,0, -12,-5, -12,5);
  pop();
}
function drawStar(cx,cy,r) {
  push();
    translate(cx,cy);
    beginShape();
    for (let i=0; i<5; i++){
      vertex(cos((18+i*72)*PI/180)*r, sin((18+i*72)*PI/180)*r);
      vertex(cos((54+i*72)*PI/180)*(r/2), sin((54+i*72)*PI/180)*(r/2));
    }
    endShape(CLOSE);
  pop();
}

function floodFill(x, y, fillCol) {
  loadPixels();
  let d = pixelDensity();
  let px = Math.floor(x * d);
  let py = Math.floor(y * d);
  let w = width * d;
  let h = height * d;
  let idx = 4 * (py * w + px);
  let oldCol = [
    pixels[idx],
    pixels[idx+1],
    pixels[idx+2],
    pixels[idx+3]
  ];
  let newCol = [red(fillCol), green(fillCol), blue(fillCol), 255];
  if (colorsMatch(oldCol, newCol)) return;

  let stack = [[px, py]];
  while (stack.length) {
    let [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
    let cidx = 4 * (cy * w + cx);
    let curr = [
      pixels[cidx],
      pixels[cidx+1],
      pixels[cidx+2],
      pixels[cidx+3]
    ];
    if (!colorsMatch(curr, oldCol)) continue;
    pixels[cidx] = newCol[0];
    pixels[cidx+1] = newCol[1];
    pixels[cidx+2] = newCol[2];
    pixels[cidx+3] = newCol[3];
    stack.push([cx+1, cy],[cx-1, cy],[cx, cy+1],[cx, cy-1]);
  }
  updatePixels();
}

function mouseIsPressedOnCanvas() {
  // проверка что mouseX и mouseY внутри размеров холста
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

function colorsMatch(a, b, tolerance = 10) {
  return Math.abs(a[0] - b[0]) <= tolerance &&
         Math.abs(a[1] - b[1]) <= tolerance &&
         Math.abs(a[2] - b[2]) <= tolerance &&
         Math.abs(a[3] - b[3]) <= tolerance;
}

// Рисование ромба
function drawRhombus(x1, y1, x2, y2) {
  // Центр — середина между x1,y1 и x2,y2
  let cx = (x1 + x2) / 2;
  let cy = (y1 + y2) / 2;
  let dx = Math.abs(x2 - x1) / 2;
  let dy = Math.abs(y2 - y1) / 2;
  beginShape();
  vertex(cx, cy - dy); // верх
  vertex(cx + dx, cy); // право
  vertex(cx, cy + dy); // низ
  vertex(cx - dx, cy); // лево
  endShape(CLOSE);
}