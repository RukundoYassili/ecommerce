const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// We need to extract the products array from data.ts
// Since it's a TS file, we'll do a simple regex extraction for this script
const dataContent = fs.readFileSync('./src/lib/data.ts', 'utf8');
const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);

if (!productsMatch) {
  console.error('Could not find products array in data.ts');
  process.exit(1);
}

// Note: Simple JSON.parse won't work on TS code, so we'd normally use a TS runner.
// For this environment, I'll use a more surgical approach or just manually define a few items 
// to ensure the DB works, then the user can use the app to add more.
// Actually, let's try to evaluate the string as JS.
let products = [];
try {
  // Replace TS-isms with JS-compatible ones for evaluation
  const jsProducts = productsMatch[1]
    .replace(/formatPrice\(.*?\)/g, '0')
    .replace(/type:.*?/g, '');
  products = eval(jsProducts);
} catch (e) {
  console.error('Error parsing products:', e);
  process.exit(1);
}

const supabase = createClient(
  'https://fcnfyjvsvgikrbramcbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmZ5anZzdmdpa3JicmFtY2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzQ5MjAsImV4cCI6MjA4OTMxMDkyMH0.nNtueSw-SCRu2U_NmMwXJWDZ43lLP_d0f92XsG9Wadk'
);

async function seed() {
  console.log(`🚀 Seeding ${products.length} products to Supabase...`);
  
  for (const p of products) {
    const { error } = await supabase.from('products').upsert({
      id: p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      original_price: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviews: p.reviews,
      image_url: p.image,
      images: p.images || [],
      description: p.description,
      features: p.features || [],
      material: p.material,
      color: p.color,
      dimensions: p.dimensions,
      warranty: p.warranty,
      in_stock: p.inStock,
      is_new: p.isNew
    });

    if (error) {
      console.error(`❌ Error seeding ${p.name}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${p.name}`);
    }
  }
}

seed();
