require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Global ID counter — starts above existing 43 products to avoid conflicts
let idCounter = 100;

function nextId(category) {
  return `${category}-${idCounter++}`;
}

// ─── Image pools per category ────────────────────────────────────────────────
const imgs = {
  sofas: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  ],
  beds: [
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    'https://images.unsplash.com/photo-1617806118233-18e1c12d40ab?w=800&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
  ],
  dining: [
    'https://images.unsplash.com/photo-1617806118233-18e1c12d40ab?w=800&q=80',
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
    'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800&q=80',
    'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  ],
  chairs: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1589992896404-3e0e6d4b9d96?w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
    'https://images.unsplash.com/photo-1596162954151-cdcb4c0f70fb?w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  ],
  decor: [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28e2111bb9e?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1567016532163-e75beba60dc8?w=800&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  ],
  storage: [
    'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1555664260-fe77b5c88c7e?w=800&q=80',
  ],
  tables: [
    'https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&q=80',
    'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80',
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
    'https://images.unsplash.com/photo-1532372576444-ebaa1ba131b7?w=800&q=80',
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  ],
  mattresses: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1541123437800-1c7b1bc5960d?w=800&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
  ],
  recliners: [
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    'https://images.unsplash.com/photo-1506898667547-42e22a46e125?w=800&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  ],
  'tv-units': [
    'https://images.unsplash.com/photo-1593085260707-5377ba37f868?w=800&q=80',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28e2111bb9e?w=800&q=80',
  ],
  bookshelves: [
    'https://images.unsplash.com/photo-1555664260-fe77b5c88c7e?w=800&q=80',
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  ],
  carpets: [
    'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
    'https://images.unsplash.com/photo-1558904541-efa843a96f0f?w=800&q=80',
    'https://images.unsplash.com/photo-1586326880051-789a239b56f2?w=800&q=80',
    'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80',
  ],
};

// ─── Product catalog ─────────────────────────────────────────────────────────
const catalog = {
  sofas: [
    { name: 'Sahara Bouclé 3-Seater', price: 3850000, desc: 'Luxurious bouclé fabric with gold metal legs. The statement piece every Kigali living room deserves.' },
    { name: 'Oslo L-Shape Corner Sofa', price: 5200000, desc: 'Modular Scandinavian-inspired sectional with chaise. Seats 6 comfortably.' },
    { name: 'Velvet Cloud 2-Seater', price: 2100000, desc: 'Deep-seated emerald velvet loveseat with hand-stitched tufting.' },
    { name: 'Cognac Leather 3-Seater', price: 6800000, desc: 'Full-grain Italian leather aged to perfection. A timeless investment piece.' },
    { name: 'Tulum Rattan Sofa', price: 2750000, desc: 'Natural rattan frame with feather-down cushions. Brings the tropics indoors.' },
    { name: 'Monaco Daybed Sofa', price: 4100000, desc: 'Contemporary chaise longue with 180° reclining backrest.' },
    { name: 'Ivory Chenille Love Seat', price: 1890000, desc: 'Soft chenille weave in warm ivory. Perfect for compact spaces.' },
    { name: 'Charcoal Modular Sofa Set', price: 7500000, desc: '5-piece modular configuration. Fully customizable layout for open-plan homes.' },
  ],
  beds: [
    { name: 'Serenity Upholstered Bed', price: 3200000, desc: 'Floor-to-ceiling headboard wrapped in stone-grey linen. Hotel-grade luxury.' },
    { name: 'Bamboo Platform Bed', price: 2100000, desc: 'Sustainable bamboo with low-profile Japanese aesthetic. Pairs with any décor.' },
    { name: 'Noir Leather Panel Bed', price: 4500000, desc: 'Black bonded leather with quilted headboard panel. Dramatic and commanding.' },
    { name: 'Walnut & Brass Bed Frame', price: 3900000, desc: 'Solid walnut with brushed brass hardware. Limited edition artisan piece.' },
    { name: 'Chelsea Storage Divan', price: 2600000, desc: 'Ottoman base with 4 individual gas-lift storage sections. Practical luxury.' },
    { name: 'Princess Canopy Bed', price: 5500000, desc: '4-poster canopy frame in brushed white oak. Transform your room into a sanctuary.' },
    { name: 'Oasis Platform Bed King', price: 3750000, desc: 'Extra-wide king platform with integrated USB-C charging ports in headboard.' },
  ],
  dining: [
    { name: 'Calacatta Marble Dining Table', price: 8500000, desc: '6-seater genuine Calacatta marble top on brushed gold base. Statement dining.' },
    { name: 'Teak Oval Dining Table', price: 3800000, desc: 'Solid teak oval top, seats 8. Naturally water-resistant for easy maintenance.' },
    { name: 'Glass Pedestal Dining Set (6)', price: 4200000, desc: 'Tempered glass top on architectural pedestal with 6 upholstered chairs.' },
    { name: 'Acacia Live-Edge Table', price: 5100000, desc: 'One-of-a-kind live-edge acacia slab on black powder-coated steel legs.' },
    { name: 'Round Oak Family Table', price: 2900000, desc: 'Extending round table seats 4–8. Perfect for growing families.' },
    { name: 'Industrial Dining Set (4 Chairs)', price: 3300000, desc: 'Reclaimed wood top with iron pipe legs and matching vintage-leather chairs.' },
    { name: 'Tulip Style Dining Set', price: 4700000, desc: 'Iconic tulip silhouette in white gloss. Mid-century masterpiece.' },
    { name: 'Bamboo & Rattan Dining Set', price: 2200000, desc: 'Eco-friendly bamboo top with 4 rattan peacock chairs. Bohemian chic.' },
  ],
  chairs: [
    { name: 'Cognac Wing Chair', price: 1950000, desc: 'High-back wing chair in rich cognac leather. A reading nook essential.' },
    { name: 'Swivel Boucle Accent Chair', price: 1650000, desc: '360° swivel base in cream bouclé. Instagram-worthy and incredibly comfortable.' },
    { name: 'Black Tulip Dining Chair', price: 650000, desc: 'Iconic sculpted base in matte black. Sold individually or as a set of 4.' },
    { name: 'Peacock Rattan Chair', price: 1200000, desc: 'Full-circle rattan peacock frame with plush velvet cushion.' },
    { name: 'Ghost Acrylic Chair', price: 850000, desc: 'Italian-inspired transparent polycarbonate. Makes any room feel larger.' },
    { name: 'Barrel Club Chair', price: 1750000, desc: 'Barrel-shaped upholstered club chair in forest green velvet.' },
    { name: 'Egg Chair with Ottoman', price: 3200000, desc: 'Iconic egg-shaped shell chair on swivel base. Iconic mid-century silhouette.' },
    { name: 'Louis Ghost Side Chair', price: 720000, desc: 'Classic Louis XV-inspired silhouette in transparent polycarbonate.' },
  ],
  decor: [
    { name: 'Terrazzo Mushroom Lamp', price: 385000, desc: 'Handcrafted terrazzo base with linen shade. Cast a warm amber glow.' },
    { name: 'Arched Floor Lamp', price: 890000, desc: 'Marble base arc floor lamp with adjustable shade. Architect-favourite.' },
    { name: 'Abstract Resin Wall Art', price: 420000, desc: '1.2m×80cm abstract pour-paint canvas in earth tones. Original artwork.' },
    { name: 'Woven Macramé Wall Hanging', price: 195000, desc: 'Hand-knotted natural cotton macramé. 1.5m wide, adds boho warmth.' },
    { name: 'Ribbed Glass Vase Set (3)', price: 210000, desc: 'Trio of ribbed clear glass vases in graduated heights. Minimal and elegant.' },
    { name: 'Linen Cushion Pack (4)', price: 180000, desc: '4 premium linen cushion covers in desert-rose palette. Mix-and-match effortlessly.' },
    { name: 'Brass Geometric Candle Holder', price: 145000, desc: 'Architectural brass frame candle holder. A table centrepiece.' },
    { name: 'Ficus Fiddle Leaf Plant Stand', price: 320000, desc: 'Solid teak mid-century plant stand. Perfect for statement indoor plants.' },
    { name: 'Gold Sunburst Wall Mirror', price: 560000, desc: '80cm diameter sunburst mirror with gilded metal rays. A focal wall piece.' },
    { name: 'Himalayan Salt Lamp', price: 135000, desc: 'Hand-carved pink Himalayan salt lamp on walnut base. Soothing amber light.' },
  ],
  storage: [
    { name: 'White Gloss 6-Door Wardrobe', price: 4200000, desc: '240cm wide 6-door wardrobe with full-length mirror and soft-close hinges.' },
    { name: 'Rattan 4-Drawer Chest', price: 1650000, desc: 'Solid wood frame with rattan-front drawers. Boho meets functionality.' },
    { name: 'Floating Wall Shelving Unit', price: 890000, desc: 'Modular floating shelves in oak veneer. Configure in multiple layouts.' },
    { name: 'Shoe Rack Cabinet (24 Pairs)', price: 1350000, desc: 'Slim hallway shoe cabinet with flip-door compartments for 24 pairs.' },
    { name: 'Mid-Century Sideboard', price: 2800000, desc: 'Teak sideboard with 4 sliding doors and tapered legs. Danish-inspired.' },
    { name: 'Industrial Pipe Shelving', price: 980000, desc: 'Reclaimed wood shelves on black iron pipe brackets. 5-tier wall unit.' },
    { name: 'Velvet-Lined Jewellery Armoire', price: 1200000, desc: 'Standing jewellery armoire with mirror, velvet lining, and lock.' },
  ],
  tables: [
    { name: 'Marble & Brass Coffee Table', price: 1890000, desc: 'White Carrara marble top on brushed brass base. Pure luxury for your lounge.' },
    { name: 'Smoked Glass Side Table', price: 620000, desc: 'Smoked tempered glass top on matte black steel frame. Sleek and modern.' },
    { name: 'Acacia Slice Coffee Table', price: 1450000, desc: 'Natural acacia slice top, each one unique. On hairpin steel legs.' },
    { name: 'Ottoman Coffee Table', price: 980000, desc: 'Large tufted velvet ottoman doubles as coffee table and footrest.' },
    { name: 'Bamboo Sofa Side Table', price: 380000, desc: 'C-shaped bamboo slide-under-sofa table. No more reaching for your drink.' },
    { name: 'Drum Stool Side Table', price: 450000, desc: 'Rattan drum-shaped side table/stool. Multi-functional Scandi-boho piece.' },
    { name: 'Lift-Top Coffee Table', price: 1650000, desc: 'Pop-up surface reveals hidden storage. Perfect for WFH flexibility.' },
  ],
  mattresses: [
    { name: 'Cloud Nine Pocket Spring King', price: 3200000, desc: '3000 individual pocket springs with pillow-top. Zero motion transfer.' },
    { name: 'Bamboo Memory Foam Queen', price: 2100000, desc: 'Bamboo-infused cooling memory foam. Stays 3° cooler than standard foam.' },
    { name: 'Latex Orthopaedic Double', price: 2800000, desc: '100% natural latex with zoned lumbar support. Hypoallergenic and breathable.' },
    { name: 'Hotel Collection Hybrid King', price: 3900000, desc: 'Premium hotel-grade hybrid used in 5-star accommodations across East Africa.' },
    { name: 'Kids Waterproof Mattress', price: 850000, desc: 'Antimicrobial waterproof cover with supportive foam. Safe for all ages.' },
  ],
  recliners: [
    { name: 'Zero Gravity Recliner', price: 3800000, desc: '4D massage recliner with 8 massage modes, heat therapy, and zero-gravity position.' },
    { name: 'Wingback Manual Recliner', price: 2200000, desc: 'Classic wingback recliner with push-back mechanism. Cognac faux leather.' },
    { name: 'Power Lift Recliner', price: 4100000, desc: 'Motorised lift assists standing up. Ideal for elderly users or post-surgery recovery.' },
    { name: 'Cinema 3-Seater Recliner', price: 7500000, desc: 'Home cinema 3-seat recliner sofa with cup holders and LED base lighting.' },
  ],
  'tv-units': [
    { name: 'Oak Floating TV Unit (200cm)', price: 1850000, desc: '200cm wall-mounted unit with LED backlight groove. Fits TVs up to 90\".' },
    { name: 'Black Gloss TV Cabinet', price: 1450000, desc: 'High-gloss black cabinet with push-open doors and cable management.' },
    { name: 'Industrial Pipe TV Stand', price: 980000, desc: 'Reclaimed wood shelves on iron pipe frame. Fits TVs up to 65\".' },
    { name: 'Corner TV & Media Unit', price: 1650000, desc: 'Space-saving corner unit with open shelving for media equipment.' },
    { name: 'Scandi Teak TV Bench', price: 2100000, desc: 'Long low-profile teak TV bench with rattan drawer fronts. 180cm wide.' },
  ],
  bookshelves: [
    { name: 'Modular Cube Bookshelf', price: 1350000, desc: '9-cube modular storage system. Mix open and closed configurations freely.' },
    { name: 'Treehouse Wooden Shelving', price: 1750000, desc: 'Abstract tree silhouette bookshelf in natural pine. A conversation piece.' },
    { name: 'Slim Tall Bookcase (5-tier)', price: 880000, desc: '190cm tall narrow bookcase. Perfect for compact rooms and hallways.' },
    { name: 'Rattan Display Cabinet', price: 2100000, desc: 'Glazed rattan cabinet — half shelving, half closed storage. Boho storage.' },
    { name: 'Wall-Mounted Book Ledges', price: 490000, desc: 'Set of 5 solid oak floating book ledges. Show off your favourite covers.' },
  ],
  carpets: [
    { name: 'Berber Tribal Wool Rug 3×4m', price: 1200000, desc: 'Hand-knotted Berber-inspired wool rug with authentic tribal motifs. Thick pile.' },
    { name: 'Jute Natural Area Rug 2×3m', price: 450000, desc: 'Eco-friendly natural jute weave. Adds organic texture to any floor.' },
    { name: 'Velvet Solid Rug 2×3m', price: 680000, desc: 'Plush cut-velvet pile in rich teal. Feels like walking on clouds.' },
    { name: 'Cowhide Patchwork Rug', price: 950000, desc: 'Genuine cowhide patchwork in natural tones. Each piece is truly unique.' },
    { name: 'Aztec Runner Rug 80×300cm', price: 380000, desc: 'Bold Aztec-print flat-weave runner. Durable and vibrant for hallways.' },
    { name: 'Moroccan Beni Ourain Rug 2×3m', price: 1450000, desc: 'Authentic hand-knotted Moroccan style with geometric diamond pattern.' },
    { name: 'Outdoor Weatherproof Rug 2×3m', price: 520000, desc: 'UV-stabilised polypropylene. Perfect for verandas and outdoor spaces.' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getImages(category) {
  const pool = imgs[category] || imgs.sofas;
  return pool.slice(0, 4);
}

function randomRating() {
  return parseFloat((Math.random() * 1 + 4).toFixed(1));
}

function randomReviews() {
  return Math.floor(Math.random() * 490) + 30;
}

// ─── Build product rows ───────────────────────────────────────────────────────
function buildProducts() {
  const rows = [];
  for (const [category, items] of Object.entries(catalog)) {
    items.forEach((item, idx) => {
      const gallery = getImages(category);
      const originalPrice = Math.round(item.price * 1.25 / 1000) * 1000;
      rows.push({
        id: nextId(category),
        name: item.name,
        category,
        subcategory: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
        price: item.price,
        original_price: originalPrice,
        discount: 20,
        rating: randomRating(),
        reviews: randomReviews(),
        image_url: gallery[0],
        images: gallery,
        description: item.desc,
        features: ['Premium materials & construction', 'Locally delivered & assembled', '2-year B-FRESH warranty', 'Sustainably sourced wherever possible'],
        material: 'Premium Mixed Materials',
        color: 'As shown',
        dimensions: 'Standard — see product page',
        warranty: '2 Years',
        in_stock: true,
        is_new: idx % 3 === 0,
      });
    });
  }
  return rows;
}

// ─── Insert ───────────────────────────────────────────────────────────────────
async function seed() {
  // First: probe the table columns by fetching one existing row
  const { data: sampleRows, error: fetchErr } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (sampleRows && sampleRows.length > 0) {
    console.log('\n📋 Existing column names:', Object.keys(sampleRows[0]).join(', '));
  }

  // Test with a minimal row to discover required columns
  const testRow = {
    id: '__test-999__',
    name: '__TEST_DELETE_ME__',
    category: 'sofas',
    subcategory: 'Sofas',
    price: 100000,
    original_price: 125000,
    discount: 20,
    rating: 4.5,
    reviews: 10,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Test product',
    features: ['Premium quality'],
    material: 'Mixed',
    color: 'Various',
    dimensions: 'Standard',
    warranty: '2 Years',
    in_stock: true,
    is_new: false,

  };

  const { data: testData, error: testErr } = await supabase.from('products').insert([testRow]).select('id');
  if (testErr) {
    console.error('\n❌ Test row failed. Full error:\n', JSON.stringify(testErr, null, 2));
    return;
  }
  
  console.log('\n✅ Test row passed! Deleting it and proceeding...');
  // clean up test
  await supabase.from('products').delete().eq('id', testData[0].id);

  const products = buildProducts();
  console.log(`\n🚀 Seeding ${products.length} products...\n`);

  const BATCH = 20;
  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    const { data, error } = await supabase.from('products').insert(batch).select('id');
    if (error) {
      console.error(`\u274c Batch failed:`, error.message);
      for (const row of batch) {
        const { error: e } = await supabase.from('products').insert([row]);
        if (e) console.error(`  \u21b3 [${row.name}] ${e.message}`);
        else inserted++;
      }
    } else {
      inserted += data.length;
      console.log(`\u2705 Inserted ${data.length}  (total: ${inserted})`);
    }
  }
  console.log(`\n\uD83C\uDF89 Done! ${inserted} products added.\n`);
}

seed().catch(console.error);
