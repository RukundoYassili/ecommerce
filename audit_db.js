require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function audit() {
  const { data, error } = await s.from('products').select('id, name, category, image_url, is_new, rating').order('category');
  if (error) { console.error(error.message); return; }

  const byCategory = {};
  const noImage = [];
  data.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    if (!p.image_url || p.image_url.includes('x.co')) noImage.push(p.name);
  });

  console.log('\n📦 TOTAL PRODUCTS IN DB:', data.length);
  console.log('\n📂 Breakdown by category:');
  Object.entries(byCategory).sort().forEach(([cat, count]) => {
    console.log(`   ${cat.padEnd(16)} ${count} products`);
  });
  if (noImage.length) {
    console.log('\n⚠️  Products with missing/placeholder images:', noImage.join(', '));
  } else {
    console.log('\n✅ All products have valid images.');
  }
}
audit();
