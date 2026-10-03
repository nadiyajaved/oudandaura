/**
 * Oud & Aura - Product Catalog Data
 * 
 * NOTE: All product details, notes, sizes, prices and images are editable placeholders
 * from the Stitch design. Replace these with your actual product information when ready.
 * 
 * STRUCTURE FOR EACH PRODUCT:
 * - id: unique string URL identifier (e.g. 'royal-oud')
 * - name: product name
 * - category: 'perfumes' | 'attars' | 'gifts'
 * - price: current price (number)
 * - originalPrice: original / comparative price (number, optional)
 * - size: default size string (e.g. '50 ml')
 * - concentration: type label (e.g. 'Extrait', 'Parfum', 'Pure Oil')
 * - badge: optional badge string (e.g. 'Best Seller', 'Reserve', 'Limited Curation')
 * - isBestSeller: boolean
 * - inStock: boolean
 * - shortDescription: concise one-line accord overview
 * - fullDescription: full narrative description
 * - images: array of image URLs (replace with real photos e.g. 'assets/images/royal-oud.jpg')
 * - notes: { top: string, heart: string, base: string }
 * - sizes: array of size variant objects [{ size, price, originalPrice, label, isDefault }]
 */

const PRODUCTS = [
  {
    id: "arabian_touch",
    name: "Arabian Touch",
    category: "perfumes",
    price: 649,
    originalPrice: 899,
    size: "50 ml",
    concentration: "Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Arabian Tonka",
    shortDescription: "Intense sweetness, enormous projection and rich Middle Eastern profile.",
    fullDescription: " Powerful, ultra-sweet amber woody fragrance that blends rich oud and warm tonka bean with sugary cane and spicy saffron",
    images: ["arabiantouch1.jpg",
      "arabiantouch2.jpg",
      "arabiantouch3.jpg"],
    notes: {
      top: "Saffron, Bergamot",
      heart: "Agarwood (Oud), Bulgarian Rose",
      base: "Tonka Bean, Sugar Cane, Amber, White Musk, Oakmoss"
    },
    sizes: [
      { size: "50 ml", price: 649, originalPrice: 899, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 1199, originalPrice: 1499, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 349, originalPrice: 549, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 249, originalPrice: 349, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "tam_d'or",
    name: "Tam D'OR",
    category: "perfumes",
    price: 549,
    originalPrice: 799,
    size: "50 ml",
    concentration: "Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Woody Musk",
    shortDescription: "A smooth, woody fragrance with creamy sandalwood, warm cedarwood, and a subtle earthy touch.",
    fullDescription: "This woody fragrance is known for its smooth, creamy sandalwood character. It blends sandalwood, cedarwood, and cypress for a warm, elegant, calming, and subtly earthy scent.",
    images: ["TamD'OR1.jpg",
      "TamD'OR2.jpg",
      "TamD'OR3.jpg"],
    notes: {
      top: "Cypress, Myrtle, Italian Cypress",
      heart: "Sandalwood, Cedarwood",
      base: "White Musk, Amber, Spices"
    },
    sizes: [
      { size: "50 ml", price: 549, originalPrice: 799, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 999, originalPrice: 1399, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 449, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "hawaz_rush",
    name: "Hawaz Rush",
    category: "perfumes",
    price: 549,
    originalPrice: 799,
    size: "50 ml",
    concentration: "Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Fresh Aquatic",
    shortDescription: "A fresh, aquatic and masculine fragrance with a vibrant, energetic character.",
    fullDescription: "Hawas for Him is a refreshing and confident fragrance that combines a clean aquatic feel with a smooth, modern character. It is lively, bold, and effortlessly appealing, making it ideal for everyday wear as well as special occasions.",
    images: ["hawasrush1.jpg", "hawasrush2.jpg", "hawasrush3.jpg"],
    notes: {
      top: "Lemon, Apple, Cinnamon, Bergamot",
      heart: "Watery Notes, Lavender, Violet, Cardamom",
      base: "Musk, Amber, Sandalwood, Cedarwood, Moss"
    },
    sizes: [
      { size: "50 ml", price: 549, originalPrice: 799, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 999, originalPrice: 1399, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 449, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "kashmiri_oud",
    name: "Kashmiri Oud",
    category: "attars",
    price: 250,
    originalPrice: 400,
    size: "6 ml",
    concentration: "Perfume Oil",
    badge: "Premium collection",
    isBestSeller: false,
    inStock: true,
    tag: "Deep & Musky",
    shortDescription: "A rich, deep and traditional oud attar with a warm, earthy and luxurious character.",
    fullDescription: "Kashmiri Oud Attar is a timeless fragrance that captures the depth and richness of traditional oud. Its warm, woody character creates a sophisticated and elegant presence, making it ideal for those who appreciate classic, long-lasting attars with a deep and distinctive aroma.",
    images: ["kashmirioud1.jpg", "kashmirioud2.jpg"],
    notes: {
      top: "Saffron, Spices",
      heart: "Oud, Rose, Woody Notes",
      base: "Musk, Amber, Sandalwood"
    },
    sizes: [
      { size: "6 ml", price: 250, originalPrice: 399, label: "6 ml Bottle", isDefault: true },
      { size: "8 ml", price: 299, originalPrice: 499, label: "8 ml Bottle", isDefault: false }
    ]
  },
  {
    id: "qahwa_royal",
    name: "Qahwa Royal",
    category: "perfumes",
    price: 649,
    originalPrice: 899,
    size: "50 ml",
    concentration: "Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Amber Gourmand",
    shortDescription: "A warm, rich and addictive fragrance with a cozy, sweet and sophisticated character.",
    fullDescription: "Luxurious and inviting fragrance with a warm, indulgent character. It feels rich, smooth and comforting, creating an elegant aura that is perfect for evenings, special occasions and cooler weather. Its deep gourmand style makes it bold, memorable and effortlessly captivating.",
    images: ["qahwaroyal1.jpg", "qahwaroyal2.jpg", "qahwaroyal3.jpg"],
    notes: {
      top: "Ginger, Cinnamon, Cardamom",
      heart: "Praline, Candied Fruits, White Flowers",
      base: "Coffee, Vanilla, Tonka Bean, Musk, Amber, Benzoin"
    },
    sizes: [
      { size: "50 ml", price: 649, originalPrice: 899, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 1199, originalPrice: 1499, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 349, originalPrice: 549, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 249, originalPrice: 349, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "unisex_giftset",
    name: "Unisex Gift Set",
    category: "gifts",
    price: 699,
    originalPrice: 796,
    size: "4 × 20 ml",
    concentration: "Gift Set",
    badge: "Limited Collection",
    isBestSeller: true,
    inStock: true,
    tag: "Luxury • Woody • Oriental • Fresh",
    shortDescription: "A versatile collection of four captivating fragrances, blending rich, warm, woody and fresh characters for every mood and occasion.",
    fullDescription: "Discover the Arabian Signature Combo — a curated collection of four distinctive fragrances inspired by some of the most loved fragrance styles. From the rich and indulgent Arabian Touch to the smooth woods of Tam D'Or, the traditional character of Ruh Arab, and the fresh, energetic appeal of Hawaz Rush, this combo offers a fragrance for every personality and occasion.",
    images: ["combo1.jpg", "combo2.jpg"],
    notes: {
      "Arabian Touch": "Warm • Sweet • Spicy • Gourmand",
      "Tam D'Or": "Woody • Creamy • Earthy • Musky",
      "Ruh Arab": "Oriental • Woody • Warm • Musky",
      "Hawaz Rush": "Fresh • Aquatic • Fruity • Woody"
    },
    sizes: [
      { size: "4 × 20 ml", price: 699, originalPrice: 796, label: "Complete Set", isDefault: true }
    ]
  }
];

// Helper functions for easy querying
function getAllProducts() {
  return PRODUCTS;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function getBestSellers() {
  return PRODUCTS.filter(p => p.isBestSeller);
}

function getProductsByCategory(category) {
  if (!category || category === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTS,
    getAllProducts,
    getProductById,
    getBestSellers,
    getProductsByCategory
  };
}
