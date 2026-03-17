const fs = require('fs');

const path = 'c:/Users/fundi/Desktop/furniture-ecommerce/src/lib/data.ts';
let content = fs.readFileSync(path, 'utf8');

const rawData = {
  sofas: [
    { name: 'Havana 3-Seater Sofa', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', price: 3449925 },
    { name: 'Nordic 2-Seater Compact', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e', price: 2137500 },
    { name: 'Luxe L-Shape Sectional', img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25', price: 5999925 },
    { name: 'Modern Velvet Sofa', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a', price: 4125000 },
    { name: 'Classic Leather Couch', img: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f', price: 6500000 },
    { name: 'Minimalist Studio Sofa', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36', price: 1850000 }
  ],
  beds: [
    { name: 'Royal King Platform Bed', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c', price: 2924925 },
    { name: 'Calista Storage Bed', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', price: 3187500 },
    { name: 'Tufted Queen Bed', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', price: 2450000 },
    { name: 'Scandinavian Wood Bed', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457', price: 1950000 },
    { name: 'Luxury Velvet Canopy', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0', price: 4200000 }
  ],
  dining: [
    { name: 'Marble Top Dining Set', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f', price: 4124925 },
    { name: 'Teak Wood Dining Table', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200', price: 2212500 },
    { name: 'Modern Glass Dining Set', img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7', price: 3450000 },
    { name: 'Rustic Farmhouse Table', img: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc', price: 2850000 }
  ],
  chairs: [
    { name: 'Vesta Lounge Chair', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', price: 1424925 },
    { name: 'Eames-Style Office Chair', img: 'https://images.unsplash.com/photo-1589992896404-3e0e6d4b9d96', price: 1650000 },
    { name: 'Velvet Accent Chair', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c', price: 950000 },
    { name: 'Ergonomic Desk Chair', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91', price: 1250000 },
    { name: 'Mid-Century Dining Chair', img: 'https://images.unsplash.com/photo-1503602642458-232111445657', price: 450000 }
  ],
  decor: [
    { name: 'Artisan Floor Lamp', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', price: 674925 },
    { name: 'Rattan Wall Mirror', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013', price: 487425 },
    { name: 'Ceramic Table Vase', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38', price: 125000 },
    { name: 'Modern Abstract Art', img: 'https://images.unsplash.com/photo-1583847268964-b28e2111bb9e', price: 350000 }
  ],
  storage: [
    { name: 'Avante 4-Door Wardrobe', img: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8', price: 3637500 },
    { name: 'Minimalist Dresser', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf', price: 1450000 },
    { name: 'Oak Wooden Cupboard', img: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a', price: 2150000 }
  ],
  tables: [
    { name: 'Travertine Coffee Table', img: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a', price: 1199925 },
    { name: 'Barrel Oak Side Table', img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103', price: 524925 },
    { name: 'Glass & Gold End Table', img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc', price: 650000 },
    { name: 'Nesting Coffee Tables', img: 'https://images.unsplash.com/photo-1532372576444-ebaa1ba131b7', price: 850000 }
  ],
  mattresses: [
    { name: 'Ortho-Comfort Memory Foam', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304', price: 1874925 },
    { name: 'Luxury Hybrid Mattress', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', price: 2450000 },
    { name: 'Cooling Gel Mattress', img: 'https://images.unsplash.com/photo-1541123437800-1c7b1bc5960d', price: 1550000 }
  ],
  recliners: [
    { name: 'Plush Leather Recliner', img: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', price: 2850000 },
    { name: 'Motorised Fabric Recliner', img: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125', price: 3150000 }
  ],
  'tv-units': [
    { name: 'Floating TV Console', img: 'https://images.unsplash.com/photo-1593085260707-5377ba37f868', price: 1250000 },
    { name: 'Solid Wood TV Stand', img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705', price: 1650000 }
  ],
  bookshelves: [
    { name: 'Industrial Ladder Shelf', img: 'https://images.unsplash.com/photo-1555664260-fe77b5c88c7e', price: 850000 },
    { name: 'Geometric White Bookshelf', img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156', price: 1150000 }
  ],
  carpets: [
    { name: 'Persian Handtufted Rug', img: 'https://images.unsplash.com/photo-1600166898405-da9535204843', price: 750000 },
    { name: 'Modern Geometric Carpet', img: 'https://images.unsplash.com/photo-1558904541-efa843a96f0f', price: 450000 },
    { name: 'Fluffy Shag Area Rug', img: 'https://images.unsplash.com/photo-1586326880051-789a239b56f2', price: 350000 }
  ]
};

const allGalleryImages = [
  ...Object.values(rawData).flatMap(cat => cat.map(p => p.img)),
  'https://images.unsplash.com/photo-1497366216548-37526070297c',
  'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa',
];

const newProducts = [];
let idCounter = 1;

for (const [category, items] of Object.entries(rawData)) {
  items.forEach((item, index) => {
    // Generate gallery imagery by pulling random images from our pool, plus the main one
    const randomImgs = Array(4).fill(0).map(() => {
      const randomIdx = Math.floor(Math.random() * allGalleryImages.length);
      return allGalleryImages[randomIdx] + '?w=800&q=80';
    });
    
    // Add the main image at the start of gallery
    randomImgs.unshift(item.img + '?w=800&q=80');
    // Ensure uniqueness
    const gallery = [...new Set(randomImgs)];

    newProducts.push({
      id: `${category}-${idCounter++}`,
      name: item.name,
      category: category,
      subcategory: category.charAt(0).toUpperCase() + category.slice(1),
      price: item.price,
      originalPrice: Math.floor(item.price * 1.25),
      discount: 20,
      rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Random rating between 4.0 and 5.0
      reviews: Math.floor(Math.random() * 500) + 10,
      image: item.img + '?w=600&q=80',
      images: gallery,
      description: `The ${item.name} offers premium quality and stunning design, elevating any space it occupies. Crafted with meticulous attention to detail.`,
      features: ['Premium materials used', 'Durable and long-lasting', 'Modern contemporary aesthetic', 'Easy to maintain'],
      material: 'Mixed Premium Materials',
      color: 'Various',
      dimensions: 'Standard Specifications',
      warranty: '2 Years',
      inStock: true,
      isNew: index % 3 === 0,
      isBestseller: index % 4 === 1
    });
  });
}

const productsStr = newProducts.map(p => {
  return `{
    id: '${p.id}',
    name: '${p.name}',
    category: '${p.category}',
    subcategory: '${p.subcategory}',
    price: ${p.price},
    originalPrice: ${p.originalPrice},
    discount: ${p.discount},
    rating: ${p.rating},
    reviews: ${p.reviews},
    image: '${p.image}',
    images: ${JSON.stringify(p.images)},
    description: ${JSON.stringify(p.description)},
    features: ${JSON.stringify(p.features)},
    material: '${p.material}',
    color: '${p.color}',
    dimensions: '${p.dimensions}',
    warranty: '${p.warranty}',
    inStock: ${p.inStock},
    isNew: ${p.isNew},
    isBestseller: ${p.isBestseller}
  }`;
}).join(',\n  ');

const regex = /export const products: Product\[\] = \[[\s\S]*?\];\s*\n*\s*\/\/\s*───\s*Categories/;
const updatedContent = content.replace(regex, `export const products: Product[] = [\n  ${productsStr}\n];\n\n// ─── Categories`);

fs.writeFileSync(path, updatedContent);
console.log("Catalog massively expanded! Added " + newProducts.length + " products across all categories with rich image galleries.");
