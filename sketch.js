/** @typedef {import("./p5/types").Color} Colore */

/**
 * @typedef {Object} Lettera
 * @property {number} x - Coordinata X
 * @property {number} y - Coordinata Y
 * @property {number} w - Larghezza (width)
 * @property {number} h - Altezza (height)
 * @property {number} p1 - Parametro 1
 * @property {number} p2 - Parametro 2
 * @property {Colore} colore_pos - Colore forma
 * @property {Colore} colore_neg - Colore sfondo
 */

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  clear(); // Non cancellare!

  const colore_pos = color(0, 0, 0);
  const colore_neg = color(
    255 - red(colore_pos),
    255 - green(colore_pos),
    255 - blue(colore_pos)
  );

  // const p1 = map(mouseY, 0, height, 0, 1, true);
  // const p2 = map(mouseX, 0, width, 0, 1, true);
  // const p3 = map(sin(frameCount * 0.05), -1, 1, 0, 1);
  // const p4 = noise(frameCount * 0.01);

  const time = frameCount * 0.05;
  const p1 = map(sin(time), -1, 1, 0, 1);
  const p2 = map(cos(time), -1, 1, 0, 1);

  const col_sx_w = map(sin(time), -1, 1, width / 4, (width / 4) * 3);
  const col_dx_w = width - col_sx_w;

  P1({
    x: 0,
    y: 0,
    w: col_sx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  O1({
    x: col_sx_w,
    y: 0,
    w: col_dx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  D1({
    x: 0,
    y: 100,
    w: col_sx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  P2({
    x: col_sx_w,
    y: 100,
    w: col_dx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  O2({
    x: 0,
    y: 200,
    w: col_sx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  T2({
    x: col_sx_w,
    y: 200,
    w: col_dx_w,
    h: 100,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });
}
//

/**
 * @param {Lettera} lettera
 */
function P1(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;

  let asta_w = map(p2, 0, 1, cell_w, cell_w * 7);
  let pancia_h = map(p1, 0, 1, cell_h, cell_h * 8);
  let pancia_w = w - cell_w - asta_w;
  let pancia_x = asta_w + cell_h;

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);
  //pancia
  fill(colore_pos);
  rect(
    asta_w + cell_w,
    y,
    pancia_w,
    pancia_h,
    0,
    pancia_w / 2,
    pancia_w / 2,
    0
  );
}
//

/**
 * @param {Lettera} lettera
 */
function O1(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;

  let y_min = y + h - cell_h;
  let y_max = y + cell_h;

  let y_cima = map(p1, 0, 1, y_min - cell_h, y_max, true);
  let h_corpo = y_min - y_cima;
  let w_mov = map(p2, 0, 1, cell_h, w - cell_w * 2, true);

  const aspectRatio = (cell_h * 2) / w;
  let h_mov = w_mov * aspectRatio;

  // disegno
  noStroke();

  //corpo
  fill(colore_pos);
  rect(x, y_cima, w, h_corpo);

  // ellisse inferiore
  fill(colore_pos);
  ellipse(x + w / 2, y + h - cell_h, w, cell_h * 2);

  // ellisse superiore
  fill(colore_neg);
  ellipse(x + w / 2, y_cima, w, cell_h * 2);

  // ellisse interno
  fill(colore_pos);
  ellipse(x + w / 2, y_cima, w_mov, h_mov);
}
//

/**
 * @param {Lettera} lettera
 */
function D1(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;
  let asta_w = map(p2, 0, 1, cell_w, cell_w * 3);

  //disegno
  push();
  rectMode(CENTER);
  translate(x, y);

  let asta_1_h = map(p1, 0, 1, cell_h * 5, cell_h * 9);
  rect(asta_w / 2, h / 2, asta_w, asta_1_h);

  let asta_2_h = map(p1, 0, 1, cell_h * 3, cell_h * 7);
  let asta_2_x = asta_w + asta_w / 2;
  rect(asta_2_x, h / 2, asta_w, asta_2_h);

  let asta_3_h = map(p1, 0, 1, cell_h, cell_h * 5);
  let asta_3_x = asta_2_x + asta_w;

  rect(asta_3_x, h / 2, asta_w, asta_3_h);

  pop();
}
//

/**
 * @param {Lettera} lettera
 */
function P2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;

  let asta_w = map(p2, 0, 1, cell_w, cell_w * 5);
  let pancia_h = map(p1, 0, 1, cell_h * 8, cell_h * 4);
  let pancia_w = w - cell_w - asta_w;
  let pancia_x = asta_w + cell_h;

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);

  // pancia
  fill(colore_pos);
  rect(x + asta_w, y, pancia_w, pancia_h);

  //curva pancia

  // foro pancia
  fill(colore_neg);
  rect(x + asta_w, y + cell_h, pancia_w - cell_w, pancia_h - cell_h * 2);

  //foro curva pancia
}
//

/**
 * @param {Lettera} lettera
 */
function O2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;

  const diametro_max = min(w, h) * 0.9;
  const diametro = diametro_max * p1;

  const borderRadius = map(p2, 0, 1, 0, w / 2); // da 0 (quadrato) a 90 (cerchio)

  // sfondo
  fill(colore_pos);
  rect(x, y, w, h, borderRadius);

  // cerchio interno
  fill(colore_neg);
  ellipse(x + w / 2 + cell_w, y + h / 2 - cell_h, diametro, diametro);
}
//

/**
 * @param {Lettera} lettera
 */
function T2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;

  let cell_w = w / 9;
  let cell_h = h / 9;

  //rect(x, y, w, h);

  //disegno
  push();
  translate(x, y);

  let join_sx_x = map(p2, 0, 1, cell_w, cell_w * 7);
  let join_dx_x = join_sx_x + cell_w;
  let join_y = cell_h;
  let trave_h = map(p1, 0, 1, cell_h, cell_h * 7);
  let base_dx_x = map(p1, 0, 1, cell_w * 5, w);
  let base_sx_x = map(p1, 0, 1, cell_w * 4, 0);

  fill(colore_pos);

  beginShape();
  vertex(0, 0);
  vertex(w, 0);
  vertex(w, trave_h);
  vertex(join_dx_x, join_y);
  vertex(base_dx_x, h);
  vertex(base_sx_x, h);
  vertex(join_sx_x, join_y);
  vertex(0, trave_h);
  endShape(CLOSE);

  pop();
}
