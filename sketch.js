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

let colore_pos;
let colore_neg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generaColori(); // inizializza i colori
}

//

// Funziona su laptop
function mousePressed() {
  gestisciInterazione();
}

// Funziona su smartphone/tablet
function touchStarted() {
  gestisciInterazione();
  return false; // previene comportamenti di default del browser
}

function gestisciInterazione() {
  if (mouseY < height / 2) {
    save("podpot.png");
  } else {
    generaColori();
  }
}

function generaColori() {
  colore_pos = color(random(255), random(255), random(255));
  colore_neg = color(
    255 - red(colore_pos),
    255 - green(colore_pos),
    255 - blue(colore_pos)
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//

function draw() {
  clear(); // Non cancellare!
  background(colore_neg);

  const time = frameCount * 0.02;
  const p1 = map(sin(time), -1, 1, 0, 1);
  const p2 = map(cos(time), -1, 1, 0, 1);

  // Definisci i margini proporzionali al canvas
  const margine = min(width, height) * 0.02; // 3% della dimensione minore del canvas
  const margine_lettere = min(width, height) * 0.02; // 2% della dimensione minore del canvas

  // Calcola le dimensioni disponibili sottraendo i margini
  const area_disponibile_w = width - margine * 2;
  const area_disponibile_h = height - margine * 2;

  // Calcola le dimensioni delle colonne e righe con i margini
  const col_sx_w =
    map(
      sin(time),
      -1,
      1,
      area_disponibile_w / 4,
      (area_disponibile_w / 4) * 3
    ) - margine_lettere;
  const col_dx_w = area_disponibile_w - col_sx_w - margine_lettere;
  const row_h = (area_disponibile_h - margine_lettere * 2) / 3; // 3 righe con 2 spazi tra loro

  P1({
    x: margine,
    y: margine,
    w: col_sx_w,
    h: row_h,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  O1({
    x: margine + col_sx_w + margine_lettere,
    y: margine,
    w: col_dx_w,
    h: row_h,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  D1({
    x: margine,
    y: margine + row_h + margine_lettere,
    w: col_dx_w,
    h: row_h,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  P2({
    x: margine + col_dx_w + margine_lettere,
    y: margine + row_h + margine_lettere,
    w: col_sx_w,
    h: row_h,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  O2({
    x: margine,
    y: margine + (row_h + margine_lettere) * 2,
    w: col_sx_w,
    h: row_h,
    p1: p1,
    p2: p2,
    colore_pos: colore_pos,
    colore_neg: colore_neg,
  });

  T2({
    x: margine + col_sx_w + margine_lettere,
    y: margine + (row_h + margine_lettere) * 2,
    w: col_dx_w,
    h: row_h,
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
  fill(colore_neg);
  rect(x, y, w, h);

  let cell_w = w / 9;
  let cell_h = h / 9;

  let asta_w = map(p2, 0, 1, cell_w, cell_w * 7);
  let pancia_h = map(p1, 0, 1, cell_h, cell_h * 8);
  let pancia_x = x + asta_w + cell_h;
  let pancia_w = w - pancia_x;

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);

  //pancia
  fill(colore_pos);
  rect(pancia_x, y, pancia_w, pancia_h, 0, pancia_w / 2, pancia_w / 2, 0);
}
//

/**
 * @param {Lettera} lettera
 */
function O1(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;
  fill(colore_neg);
  rect(x, y, w, h);

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
  fill(colore_neg);
  rect(x, y, w, h);

  let cell_w = w / 9;
  let cell_h = h / 9;

  let asta_1_w = map(p1, 0, 1, cell_w * 3, cell_w * 6);
  let asta_3_h = map(p2, 0, 1, cell_h * 3, cell_h * 6);
  let asta_2_w = map(p1, 0, 1, cell_w * 6, cell_w * 3);
  let asta_2_h = map(p2, 0, 1, cell_h * 6, cell_h * 7.5);

  let asta_2_x = x + asta_1_w;

  //asta 1
  fill(colore_pos);
  rect(x, y, asta_1_w, h);

  push();
  rectMode(CENTER);
  fill(colore_pos);
  //asta 2
  rect(asta_2_x, y + h / 2, asta_2_w, asta_2_h);
  //asta 3
  rect(x + w / 2, y + h / 2, w, asta_3_h);
  pop();
}

//

/**
 * @param {Lettera} lettera
 */
function P2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;
  fill(colore_neg);
  rect(x, y, w, h);

  let cell_w = w / 9;
  let cell_h = h / 9;

  let asta_w = map(p2, 0, 1, cell_w, cell_w * 5);
  let pancia_h = map(p1, 0, 1, cell_h * 8, cell_h * 4);
  let sovrapposizione = 5;

  let pancia_w = w - asta_w + sovrapposizione;
  let pancia_x = x + asta_w - sovrapposizione;

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);

  // pancia
  fill(colore_pos);
  rect(pancia_x, y, pancia_w, pancia_h);

  //curva pancia

  // foro pancia
  fill(colore_neg);
  rect(x + asta_w, y + cell_h, pancia_w - cell_h, pancia_h - cell_h * 2);
}
//

/**
 * @param {Lettera} lettera
 */
function O2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;
  fill(colore_neg);
  rect(x, y, w, h);

  let cell_w = w / 9;
  let cell_h = h / 9;

  const diametro_max = min(w, h) * 0.5;
  const diametro = diametro_max * p1 + cell_h;
  const borderRadius = map(p2, 0, 1, 0, w / 4); // da 0 (quadrato) a 90 (cerchio)

  // Sfondo
  fill(colore_pos);
  rect(x, y, w, h, borderRadius);

  // Forma interna interno
  const shapeSize = diametro;
  const shapeX = x + w / 2 + cell_w - shapeSize / 2;
  const shapeY = y + h / 2 - cell_h - shapeSize / 2;

  const maxRadius = shapeSize / 2;
  const minRadius = 0;
  const shapeRadius = map(p1, 0, 1, maxRadius, minRadius); // da cerchio (p1 = 0) a quadrato (p1 = 1)

  fill(colore_neg);
  rect(shapeX, shapeY, shapeSize, shapeSize, shapeRadius);
}
//

/**
 * @param {Lettera} lettera
 */
function T2(lettera) {
  const { x, y, w, h, p1, p2, colore_pos, colore_neg } = lettera;
  fill(colore_neg);
  rect(x, y, w, h);

  let cell_w = w / 9;
  let cell_h = h / 9;

  //forma
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
