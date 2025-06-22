// @ts-nocheck
// Definizioni per p5.js

/**
 * @typedef {Object} Colore
 * @property {number} levels - Array dei valori RGBA
 */

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

/** @type {Colore} */
let colore_pos;
/** @type {Colore} */
let colore_neg;
/** @type {number} */
let stato_trasformazione = 0; // 0 = disattive, 1 = orizzontale, 2 = verticale

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
  if (mouseY < height / 3) {
    save("podpot.png");
  } else if (mouseY < (height / 3) * 2) {
    toggleStato();
  } else {
    generaColori();
  }
}

function toggleStato() {
  stato_trasformazione = (stato_trasformazione + 1) % 3;
  const stati = ["DISATTIVE", "ORIZZONTALE", "VERTICALE"];
  console.log("Trasformazioni:", stati[stato_trasformazione]);
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
  const margine = min(width, height) * 0.03; // 3% della dimensione minore del canvas
  const margine_lettere = min(width, height) * 0.02; // 2% della dimensione minore del canvas

  // Calcola le dimensioni disponibili sottraendo i margini
  const area_disponibile_w = width - margine * 2;
  const area_disponibile_h = height - margine * 2;

  let col_sx_w, col_dx_w, row_h, row_heights;

  if (stato_trasformazione === 0) {
    // STATO 0: Colonne disattive (uniformi)
    const area_netta = area_disponibile_w - margine_lettere;
    col_sx_w = area_netta / 2;
    col_dx_w = area_netta / 2;
    row_h = (area_disponibile_h - margine_lettere * 2) / 3;
  } else if (stato_trasformazione === 1) {
    // STATO 1: Trasformazione orizzontale (colonne animate)
    const col_sx_ratio = map(sin(time), -1, 1, 0.25, 0.75); // da 25% a 75%
    const area_netta = area_disponibile_w - margine_lettere;
    col_sx_w = area_netta * col_sx_ratio;
    col_dx_w = area_netta * (1 - col_sx_ratio);
    row_h = (area_disponibile_h - margine_lettere * 2) / 3;
  } else {
    // stato_trasformazione === 2
    // STATO 2: Trasformazione verticale (righe animate)
    const area_netta = area_disponibile_w - margine_lettere;
    col_sx_w = area_netta / 2;
    col_dx_w = area_netta / 2;

    // Animazione verticale: altezza delle righe varia
    const row_ratio_1 = map(sin(time), -1, 1, 0.2, 0.6); // prima riga: 20%-60%
    const row_ratio_2 = map(cos(time * 1.3), -1, 1, 0.15, 0.45); // seconda riga: 15%-45%
    const row_ratio_3 = 1 - row_ratio_1 - row_ratio_2; // terza riga: il resto

    const area_netta_h = area_disponibile_h - margine_lettere * 2;
    const row_h_1 = area_netta_h * row_ratio_1;
    const row_h_2 = area_netta_h * row_ratio_2;
    const row_h_3 = area_netta_h * row_ratio_3;

    row_heights = [row_h_1, row_h_2, row_h_3];
  }

  // Calcolo posizioni per stato normale (0 e 1) o verticale (2)
  if (stato_trasformazione < 2) {
    // Stati 0 e 1: layout normale
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
  } else {
    // Stato 2: layout con righe animate
    let current_y = margine;

    P1({
      x: margine,
      y: current_y,
      w: col_sx_w,
      h: row_heights[0],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });

    O1({
      x: margine + col_sx_w + margine_lettere,
      y: current_y,
      w: col_dx_w,
      h: row_heights[0],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });

    current_y += row_heights[0] + margine_lettere;

    D1({
      x: margine,
      y: current_y,
      w: col_dx_w,
      h: row_heights[1],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });

    P2({
      x: margine + col_dx_w + margine_lettere,
      y: current_y,
      w: col_sx_w,
      h: row_heights[1],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });

    current_y += row_heights[1] + margine_lettere;

    O2({
      x: margine,
      y: current_y,
      w: col_sx_w,
      h: row_heights[2],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });

    T2({
      x: margine + col_sx_w + margine_lettere,
      y: current_y,
      w: col_dx_w,
      h: row_heights[2],
      p1: p1,
      p2: p2,
      colore_pos: colore_pos,
      colore_neg: colore_neg,
    });
  }
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

  // LIMITAZIONI AGGIUNTE
  let asta_w = constrain(map(p2, 0, 1, cell_w, cell_w * 7), cell_w, w * 0.8);
  let pancia_h = constrain(map(p1, 0, 1, cell_h, cell_h * 8), cell_h, h);
  let pancia_x = x + asta_w + cell_h;
  let pancia_w = constrain(w - (asta_w + cell_h), 0, w);

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);

  // pancia - solo se c'è spazio
  if (pancia_w > 0) {
    fill(colore_pos);
    rect(pancia_x, y, pancia_w, pancia_h, 0, pancia_w / 2, pancia_w / 2, 0);
  }
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

  let y_cima = constrain(
    map(p1, 0, 1, y_min - cell_h, y_max, true),
    y_max,
    y_min
  );
  let h_corpo = y_min - y_cima;
  let w_mov = constrain(map(p2, 0, 1, cell_h, w - cell_w * 2, true), cell_h, w);

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

  // LIMITAZIONI AGGIUNTE
  let asta_1_w = constrain(
    map(p1, 0, 1, cell_w * 3, cell_w * 6),
    cell_w,
    w * 0.7
  );
  let asta_3_h = constrain(map(p2, 0, 1, cell_h * 3, cell_h * 6), cell_h, h);
  let asta_2_w = constrain(
    map(p1, 0, 1, cell_w * 6, cell_w * 3),
    cell_w,
    w - asta_1_w
  );
  let asta_2_h = constrain(map(p2, 0, 1, cell_h * 6, cell_h * 7.5), cell_h, h);

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

  // LIMITAZIONI AGGIUNTE
  let asta_w = constrain(map(p2, 0, 1, cell_w, cell_w * 5), cell_w, w * 0.6);
  let pancia_h = constrain(
    map(p1, 0, 1, cell_h * 8, cell_h * 4),
    cell_h * 2,
    h
  );
  let sovrapposizione = 5;

  let pancia_w = constrain(w - asta_w + sovrapposizione, 0, w);
  let pancia_x = x + asta_w - sovrapposizione;

  // asta nera
  fill(colore_pos);
  rect(x, y, asta_w, h);

  // pancia - solo se c'è spazio
  if (pancia_w > cell_w) {
    fill(colore_pos);
    rect(pancia_x, y, pancia_w, pancia_h);

    // foro pancia
    let foro_w = constrain(pancia_w - cell_h, 0, pancia_w);
    let foro_h = constrain(pancia_h - cell_h * 2, 0, pancia_h);
    if (foro_w > 0 && foro_h > 0) {
      fill(colore_neg);
      rect(x + asta_w, y + cell_h, foro_w, foro_h);
    }
  }
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

  const diametro_max = min(w, h) * 0.4; // RIDOTTO da 0.5 a 0.4
  const diametro = constrain(
    diametro_max * p1 + cell_h,
    cell_h,
    min(w, h) * 0.8
  );
  const borderRadius = constrain(map(p2, 0, 1, 0, w / 4), 0, min(w, h) / 4);

  // Sfondo
  fill(colore_pos);
  rect(x, y, w, h, borderRadius);

  // Forma interna
  const shapeSize = diametro;
  const shapeX = constrain(
    x + w / 2 + cell_w - shapeSize / 2,
    x,
    x + w - shapeSize
  );
  const shapeY = constrain(
    y + h / 2 - cell_h - shapeSize / 2,
    y,
    y + h - shapeSize
  );

  const maxRadius = shapeSize / 2;
  const minRadius = 0;
  const shapeRadius = constrain(
    map(p1, 0, 1, maxRadius, minRadius),
    minRadius,
    maxRadius
  );

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

  // LIMITAZIONI AGGIUNTE
  let join_sx_x = constrain(
    map(p2, 0, 1, cell_w, cell_w * 7),
    cell_w,
    w - cell_w * 2
  );
  let join_dx_x = constrain(join_sx_x + cell_w, join_sx_x, w - cell_w);
  let join_y = cell_h;
  let trave_h = constrain(map(p1, 0, 1, cell_h, cell_h * 7), cell_h, h * 0.8);
  let base_dx_x = constrain(map(p1, 0, 1, cell_w * 5, w), cell_w * 3, w);
  let base_sx_x = constrain(map(p1, 0, 1, cell_w * 4, 0), 0, w - cell_w * 3);

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
