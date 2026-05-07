const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'imagenes');
const files = fs.readdirSync(imagesDir);
let imagesMap = {};

files.forEach(f => {
  const match = f.match(/^(\d+)\.(png|jpg)$/);
  if (match) {
    imagesMap[match[1]] = f;
  }
});

const fileToModify = path.join(__dirname, 'src', 'data', 'preguntas.js');
const content = fs.readFileSync(fileToModify, 'utf8');

let newContent = content.split('{\n').map(block => {
    let idMatch = block.match(/id:\s*(\d+)/);
    if (!idMatch) return block;
    
    let id = idMatch[1];
    
    if (imagesMap[id]) {
        // Update the path if the imagen property exists
        if (block.match(/imagen:\s*["'].*?["']/)) {
            return block.replace(/imagen:\s*["'].*?["']/, `imagen: "/imagenes/${imagesMap[id]}"`);
        } else {
            // Could add it if we want, but assumed to exist based on user
            return block;
        }
    } else {
        // Remove the imagen property entirely
        return block.replace(/[ \t]*imagen:\s*["'].*?["'],?\n/, '');
    }
}).join('{\n');

fs.writeFileSync(fileToModify, newContent);
console.log('preguntas.js updated successfully.');
