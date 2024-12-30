const { createCanvas } = require('canvas');
const latex = require('./canvas-latex'); // Adjust the path according to your project structure

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');``

latex(ctx, {
  text: '\\frac{a}{b}',
  x: 100,
  y: 100,
  display: true
});

console.log('<img src="' + canvas.toDataURL() + '" />');