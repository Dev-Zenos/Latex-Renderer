const { createCanvas } = require('canvas');
const latex = require('@curriculumassociates/canvas-latex');
const fs = require('fs');

/**
 * Renders a LaTeX string as an image.
 * @param {string} latexString - The LaTeX string to render.
 * @param {string} outputPath - The path to save the output image.
 */
function renderLatexToImage(latexString, outputPath) {
  // Create a canvas with desired dimensions
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Render the LaTeX string onto the canvas
  latex(ctx, {
    text: latexString,
    x: 50,
    y: 50,
    display: true
  });

  // Save the canvas as an image
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`The PNG file was created at ${outputPath}`));
}

// Example usage:
const latexString = '\\frac{a}{b}';
const outputPath = 'output.png';
renderLatexToImage(latexString, outputPath);