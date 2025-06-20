// const testo = "WTF";
// const font_size = 120;
// const percorso_font = "./fonts/Adobe-Jenson-Pro-Bold-Caption.ttf";
// const lunghezza_linea = 5;
// const densita = 0.2;

// //

// /** @type {Font} */
// let font;

// function preload() {
//   font = loadFont(percorso_font);
// }

// //

// function setup() {
//   createCanvas(400, 400, "svg");
//   addDownloadButton();

//   rectMode(CENTER);
//   angleMode(DEGREES);

//   noLoop(); // Opzionale
// }

// function draw() {
//   clear(); // Non cancellare!

//   textAlign(CENTER);

//   const points = font.textToPoints(testo, 0, height / 2, font_size, {
//     sampleFactor: densita,
//   });

//   // disegna_punto
//   for (let point of points) {
//     push();
//     translate(point.x, point.y);
//     rotate(point.alpha + 90);
//     line(lunghezza_linea, 0, -lunghezza_linea, 0);
//     pop();
//   }
// }
