const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Sparkles')) {
    content = content.replace(/<Sparkles className="([^"]+)" \/>/g, '<img src="/assets/republic_logo.png" alt="Logo" className="$1 object-contain" />');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
