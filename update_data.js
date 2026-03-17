const fs = require('fs');

const dataPath = 'c:/Users/fundi/Desktop/furniture-ecommerce/src/lib/data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// 1. Convert Prices (ZAR to RWF factor ~ 75)
content = content.replace(/price:\s*(\d+)/g, (match, p1) => `price: ${parseInt(p1) * 75}`);
content = content.replace(/originalPrice:\s*(\d+)/g, (match, p1) => `originalPrice: ${parseInt(p1) * 75}`);

// 2. Add extra rich images to the `images: [...]` array of each product
const extraSoFaImages = [
  "'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'",
  "'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'",
  "'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'"
];
const extraBedImages = [
  "'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'",
  "'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'"
];
const genImages = [
  "'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80'",
  "'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'",
  "'https://images.unsplash.com/photo-1567016391605-df1a660a5e2f?w=800&q=80'"
];

content = content.replace(/images:\s*\[([^\]]+)\]/g, (match, inner) => {
  // If we already have commas, just append genImages
  const base = inner.trim();
  if (base.endsWith(',')) {
     return `images: [\n      ${base}\n      ${genImages.join(',\n      ')}\n    ]`;
  } else {
     return `images: [\n      ${base},\n      ${genImages.join(',\n      ')}\n    ]`;
  }
});

// 3. Change formatter
content = content.replace(
  /new Intl\.NumberFormat\('en-ZA'.*?currency: 'ZAR'.*?\)/g,
  "new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 })"
);

// 4. Update Header delivery string
const headerPath = 'c:/Users/fundi/Desktop/furniture-ecommerce/src/components/layout/Header.tsx';
let headerContent = fs.readFileSync(headerPath, 'utf8');
headerContent = headerContent.replace('FREE DELIVERY on orders over R10,000', 'FREE DELIVERY on orders over 750,000 RWF');
fs.writeFileSync(headerPath, headerContent);

// 5. Update Checkout delivery thresholds
const checkoutPath = 'c:/Users/fundi/Desktop/furniture-ecommerce/src/app/checkout/page.tsx';
let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
checkoutContent = checkoutContent.replace('totalPrice > 10000 ? 0 : 650', 'totalPrice > 750000 ? 0 : 48750');
fs.writeFileSync(checkoutPath, checkoutContent);

// 6. Update Hero Slides text
content = content.replace('Free Delivery Over $500', 'Free Delivery Over 750,000 RWF');

fs.writeFileSync(dataPath, content);

console.log('Successfully updated prices, formats, and images!');
