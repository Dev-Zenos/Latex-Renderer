const puppeteer = require('puppeteer');
const fs = require('fs');
const katex = require('katex');

// Function to render LaTeX and save as image
async function latexToImage(latexString, outputPath) {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content with the rendered LaTeX
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.11/katex.min.css">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .latex-container {
                    display: inline-block;
                    padding: 10px;
                    background-color: white;
                    border: 1px solid black;
                }
            </style>
        </head>
        <body>
            <div class="latex-container" id="latex-container"></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.11/katex.min.js"></script>
            <script>
                // Render the LaTeX string
                const latexString = ${JSON.stringify(latexString)};
                const container = document.getElementById('latex-container');
                katex.render(latexString, container, {
                    throwOnError: false
                });
            </script>
        </body>
        </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Capture the screenshot of the rendered LaTeX
    const latexContainer = await page.$('.latex-container');
    await latexContainer.screenshot({ path: outputPath });

    // Close the browser
    await browser.close();
}

// Example usage
const latexString = '\\int_{0}^{\\pi} \\left(\\frac{\\sin(x)}{\\sqrt{1-e^2\\cos^2(x)}}\\right)^3 \\cdot \\frac{dx}{\\sqrt{4+\\tan^2(x)}} + \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^2} \\cdot \\prod_{k=1}^{n} \\frac{2k-1}{2k}';
const outputPath = 'image.png';
latexToImage(latexString, outputPath).then(() => {
    console.log(`Image saved as ${outputPath}`);
}).catch((error) => {
    console.error('Error rendering LaTeX to image:', error);
});