/**
 * @param {string} path
 * @returns {SVGImage}
 */
function loadSVGImage(path) {
  const svg = loadSVG(path, (e) => {
    const width = e.elt.width.baseVal.value;
    const height = e.elt.height.baseVal.value;
    svg.width = width;
    svg.height = height;
  });
  return svg;
}

/**
 * @param {SVGImage} svg
 */
function hideSVG(svg) {
  svg.elt.style.display = "none";
}

/**
 * @param {SVGImage} svg
 */
function showSVG(svg) {
  svg.elt.style.display = "block";
}

/**
 * @param {SVGImage} svg
 * @returns {Array<SVGImage>}
 */
function getSVGPaths(svg) {
  return svg.query("path, circle, rect, ellipse, polygon, polyline, text");
}

/**
 * @param {SVGImage} svg
 * @param {string} color
 */
function fillSVG(svg, color) {
  // Set fill on the main element
  svg.attribute("fill", color);

  getSVGPaths(svg).forEach((el) => {
    el.attribute("fill", color);
  });
}

/**
 * @param {SVGImage} svg
 * @param {string} color
 */
function strokeSVG(svg, color) {
  svg.attribute("stroke", color);

  getSVGPaths(svg).forEach((el) => {
    el.attribute("stroke", color);
  });
}

/**
 * @param {SVGImage} svg
 * @param {number} weight
 */
function strokeWeightSVG(svg, weight) {
  svg.attribute("stroke-width", weight);

  getSVGPaths(svg).forEach((el) => {
    el.attribute("stroke-width", weight);
  });
}

/**
 * @param {SVGImage} svg
 */
function noFillSVG(svg) {
  svg.attribute("fill", "none");

  getSVGPaths(svg).forEach((el) => {
    el.attribute("fill", "none");
  });
}

/**
 * @param {SVGImage} svg
 */
function noStrokeSVG(svg) {
  svg.attribute("stroke", "none");

  getSVGPaths(svg).forEach((el) => {
    el.attribute("stroke", "none");
  });
}

/**
 * @param {SVGImage} svg
 */
function resetSVG(svg) {
  svg.attribute("fill", "black");
  svg.attribute("stroke", "none");
  svg.attribute("stroke-width", 1);
  svg.elt.style.display = "block";

  getSVGPaths(svg).forEach((el) => {
    resetSVG(el);
  });
}

/**
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {Graphics} [graphics] Optional graphics context to draw on
 */
function textSVG(text, x, y, graphics) {
  const ctx = graphics || window;

  /** @type {Font | string | object} */
  let font = ctx.textFont();
  if (typeof font === "string") {
    throw new Error("A custom font must be loaded to use textSVG");
  }

  const size = ctx.textSize();
  const lineHeight = ctx.textLeading();

  text.split("\n").forEach((line, index) => {
    const paths = font.font.getPaths(line, x, y + index * lineHeight, size);
    paths.forEach(({ commands }) => {
      drawPathCommands(commands, graphics);
    });
  });
}

/**
 * @param {Array} commands
 * @param {Graphics} [graphics] Optional graphics context to draw on
 */
function drawPathCommands(commands, graphics) {
  // Find all M commands to identify start of contours
  const contourStarts = commands.reduce((acc, cmd, index) => {
    if (cmd.type === "M") {
      acc.push(index);
    }
    return acc;
  }, []);

  // If no commands, return
  if (contourStarts.length === 0) return;

  // Get the appropriate context
  const ctx = graphics || window;

  // Start the main shape
  ctx.beginShape();

  // Process each contour
  for (let i = 0; i < contourStarts.length; i++) {
    const startIndex = contourStarts[i];
    const endIndex =
      i === contourStarts.length - 1 ? commands.length : contourStarts[i + 1];

    // If this is a sub-contour (not the first one), use beginContour
    if (i > 0) {
      ctx.beginContour();
    }

    // Process all commands in this contour
    for (let j = startIndex; j < endIndex; j++) {
      const cmd = commands[j];

      switch (cmd.type) {
        case "M":
          ctx.vertex(cmd.x, cmd.y);
          break;
        case "L":
          ctx.vertex(cmd.x, cmd.y);
          break;
        case "C":
          ctx.bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          break;
        case "Q":
          ctx.quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
          break;
        case "Z":
          // Only endContour if this is a sub-contour
          if (i > 0) {
            ctx.endContour();
          }
          break;
      }
    }
  }

  // Close the main shape
  ctx.endShape(CLOSE);
}

//

function addDownloadButton() {
  createButton("Download SVG").mousePressed(() => {
    save("sketch.svg");
  });
}
