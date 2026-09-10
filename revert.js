const fs = require('fs');
const filesToRevert = [
  'src/components/customer/OrderStatus.tsx',
  'src/components/customer/MenuItem.tsx',
  'src/components/customer/CustomerForm.tsx',
  'src/components/customer/CategoryTabs.tsx',
  'src/app/payment/page.tsx',
  'src/app/order/[id]/page.tsx'
];

filesToRevert.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<img src="\/assets\/republic_logo\.png" alt="Logo" className="([^"]+) object-contain" \/>/g, '<Sparkles className="$1" />');
  
  if (content.includes('Sparkles') && content.match(/import\s+\{[^\}]+\}\s+from\s+['"]lucide-react['"]/)) {
     if (!content.match(/import\s+\{[^\}]*Sparkles[^\}]*\}\s+from\s+['"]lucide-react['"]/)) {
        content = content.replace(/(import\s+\{[^\}]+)(\}\s+from\s+['"]lucide-react['"])/, '$1, Sparkles$2');
     }
  }

  fs.writeFileSync(file, content);
  console.log('Reverted ' + file);
});
