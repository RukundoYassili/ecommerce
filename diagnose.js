require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

s.from('products').insert([{
  name: 'TEST',
  category: 'sofas',
  subcategory: 'Sofas',
  price: 1,
  original_price: 1,
  discount: 0,
  rating: 4.0,
  reviews: 1,
  image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
  description: 'test',
  features: ['test'],
  material: 'test',
  color: 'test',
  dimensions: 'test',
  warranty: '2 Years',
  in_stock: true,
  is_new: false,
}]).select('id').then(({ data, error }) => {
  console.log('DATA:', JSON.stringify(data));
  if (error) {
    console.log('ERROR CODE:', error.code);
    console.log('ERROR MSG:', error.message);
    console.log('ERROR DETAILS:', error.details);
    console.log('ERROR HINT:', error.hint);
    console.log('FULL:', JSON.stringify(error));
  }
});
