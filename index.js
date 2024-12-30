const katex = require('katex');
const { createCanvas } = require('canvas');
const fs = require('fs');

// Function to render LaTeX and save as image
function latexToImage(latexString, outputPath) {
    // Create a canvas and get the context
    const width = 800;  // Set the canvas width
    const height = 200; // Set the canvas height
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Render LaTeX to HTML
    const html = katex.renderToString(latexString, {
        throwOnError: false,
        output: 'html'
    });

    // Create a temporary DOM to parse the HTML
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
    const svgElement = dom.window.document.querySelector('svg');

    if (svgElement) {
        // Serialize the SVG element to a string
        const svg = svgElement.outerHTML;

        // Use canvas to draw the SVG
        const { DOMParser, XMLSerializer } = dom.window;
        const parser = new DOMParser();
        const serializer = new XMLSerializer();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const svgSerialized = serializer.serializeToString(svgDoc.documentElement);

        const Image = require('canvas').Image;
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            // Save the canvas as an image
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Image saved as ${outputPath}`);
        };
        img.onerror = (err) => {
            console.error('Error loading SVG image:', err);
        };
        img.src = `data:image/svg+xml;base64,${Buffer.from(svgSerialized).toString('base64')}`;
    } else {
        console.error('Error: No SVG element found in the rendered LaTeX.');
    }
}

// Example usage
const latexString = '\\frac{a}{b} = c';
const outputPath = 'image.png';
latexToImage(latexString, outputPath);