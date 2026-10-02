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
    id: "royal-oud",
    name: "Royal Oud",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Oud & Amber",
    shortDescription: "Rich agarwood layered with warm amber and soft floral notes.",
    fullDescription: "A distinctive fragrance balancing deep woody notes with smooth, warm amber for an elegant everyday presence.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk7ItmDT8P40W7NPHiWlaq5DSlGMJFenimysvJj5LVp7Ga8PC7xexjSXabTTI5TaFuTQ_D7pp5Sy6JESU4bxQvEEbEhovkNKcAyECw52pR2641sSndUs4VpyGNSjO9BhntSANyVSD19hpErzJ2i4NkY0UsMz_U5VCAV5TrcqmOZ_DZG3KzhRGxhvc6_b66e32vHN4ZxTNrlrtXzFMp9W76J4lUJ8FBT_PIaDFQS1MNoGV27nzPhVfKgw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKcf3j2SppHobUUvPJ5gfpd2efHI8vDz8bHpuOgZgmArVYZS8-Om-Ma2VYmq1Y_gU0gMjyX51afwhDXdKrpykBiSnf40V6gtK28jyDbBfm--ywWb0MqIpVQBmmlVcTITzJFWjCMnqj9MpIA6ECsi4SoNNStYTAk0TYyk_R0LrAwxa3LVhyLB8J5_hgy9om9uMW69msY7c0pazKKTaf33ttzcsSe0c7T2cXqRO2Lw34gFGVh6d-zabzw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgaY_qqDuOFIbAJsPEv_c53nmlNDApjc9DVuDm4F34yP7CRw6Y-ih_Rz3vpDAKh0i-oU0qREyJGyldccr9VW6ggC_Niz2UQy04p4gD-v8WtlYFXTl0Mlw1RaGVHNEEPc1cHP8sOpqd1w8Y7w5wQ_uHbWcQWy-TwU5Af3PVZpFqLJOIRbLl8jU4pOAEOfGcvyj8iHdOkWWs5Mbx70YzscVbSt5A-ogB0Ichyw1KMH8N9-YC8c0hd7BTyg"
    ],
    notes: {
      top: "Bergamot, Saffron, Fresh Citrus",
      heart: "Rose Damascena, Spiced Cedar, Incense",
      base: "Agarwood (Oud), Ambergris, Rich Vanilla"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "vanilla-musk",
    name: "Vanilla Musk",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Warm Vanilla",
    shortDescription: "Creamy vanilla wrapped in gentle white musk and golden amber.",
    fullDescription: "A comforting and inviting scent centering sweet bourbon vanilla, soft white musk, and delicate amber notes.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtepclo5PizXSQNxdoEJdiV70_3k0fI3BqOVBGZnVAflGopfnHThyAlYt0k6ppjucFP75AwX6DCsP826z-Z2hop-_z-WZCqLo928Z8wQz1qtESjBzyXdbx85ZlHv72U2RfkLd8LHkDWPk9CUNI7bTFNKj6o6ClNEUJXpE1XZcaGZaenlfvD3DdP686gk0EOdLmhwcru9JgawU8xn_K3_TAy4YV7E7fOJovp9A_AtGMFj2AE0aAWevqMA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0O3tzHNZx0BQnHhNp0UgZ0cLTk8lJ571Yai-fLm_JKArDHQ2kBNA7q757u0ncBP-EhuuHt8V9iU33O3IDagc-S9lHyH00ZzrbmXOyUp3zfOV15DmCpgKEfS0Ivm7lrqdaXrCkcCcGLqMOx38C0WVlP1dRbJRV68DCJETZSqzpoVN7hhexUOJJC8WZJQHggwuFSvE0MAEl3CTOxy7LvAxbA0nx51YAhcVC7Tz7TJWfzkdMbAhKnebktQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASKODUc0KoZIhxbIDfDuEmyDdD-GcY1uZjz-edz5kLa8PMBkI0C7gNKbS01fWW98hZ_-nTZZlE_9afnsdfJYOZqYb5nVO6sBKn5Gwtsy2xZskfwhhnpcDBu4iYHMv5xMkxS7wR_UG8GC0JJBY2e2F6c32uCSNnbajZk0QSgC1RjebLq8qy0xwFWgsxp32_1_Te1iUJFoPdtvMnLn4skCUIt_V3gpa2MprdX7D_zwaH0W06jpERUlqAnw"
    ],
    notes: {
      top: "Sweet Almond, Citrus Blossom",
      heart: "Vanilla Orchid, Cashmere Wood",
      base: "White Musk, Tonka Bean, Soft Amber"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "oud-noir",
    name: "Oud Noir",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Smoky Woods",
    shortDescription: "A deep, rich blend of smoked woods, agarwood, and warm spices.",
    fullDescription: "A warm and intense composition designed for evening wear and special occasions, balancing dark woods with smoky spices.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsK2qBa4Y3FnWtbm12AZRA71JO0BV_D2ORB2f9E1mbDUCRfML6CgRtRVYDX72zRlpRjrleoT8wwA5iFR-u8wlDttGwghGmXXgKuqicAeHrSn8OR3IdWhpLn7Z8mug5TATm3ybfZNr0qMfAzrTSyFhDCaDZp36uwr82sxk6CpzwRe-FpAaQdT4AfZ7PekdcOCzMibe4_KpmUkmD-4c3XnFhpxHNvzlaiHUgQ5-hg9yFsjV7lNzg3EmcQQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtkvWHvTsBvIgqmraL2RThi8xEP3Txyt2_Rtw0bXse904MTTbGRL5kjmaJ_rEbYmqwsbbRX5VVO3UMKwBZjVeRGDFfllyZG5SZXawQwghIzzivGoO5Zbs_mVrLZg0wb8M4cxn9leBduzzlTTdRp6dk8PTG3OkzrgbOjORL2ArlQoDzLvSJ6oFJPJn3NLy2GSWQ2pQlXpzObOyHJIFF3mj537KS1npuPHAhvXGPk0yTM3enXBZV8MYz_A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyMEI5e7kK4-wtpaRTmN2ly08TCWINb0ihvfLbQrjFtoaaX55FHXrofs2KBDpTR3M1nDM_KiaWZ-vkTKuPOx2A_h8NjfqXSJGAkjnjXHPIGpkFra1VxGn9gAHV1RTRcdrVZKO8aSTHBPwKfEoRkM0sV4ah_oPm7-lgWnrSmHykp5LkWe89Zsvee1Jy9OgR6qRkqPCMQtPmezH57rDQGYV93ZwIFRyDLFaUaJxpJyr1s8Fu3Y_TAhTMHg"
    ],
    notes: {
      top: "Black Pepper, Nutmeg, Cardamom",
      heart: "Smoked Birch, Leather Accord, Dark Patchouli",
      base: "Assam Oud, Ambergris, Vetiver"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "premium-attar",
    name: "Premium Attar",
    category: "attars",
    price: 80,
    originalPrice: 180,
    size: "6 ml",
    concentration: "Perfume Oil",
    badge: "Best Seller",
    isBestSeller: true,
    inStock: true,
    tag: "Traditional Oil",
    shortDescription: "Concentrated traditional perfume oil in an elegant glass vial with applicator.",
    fullDescription: "A traditional, alcohol-free concentrated perfume oil with rich and warm notes designed to linger close to the skin.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAac3bHfjgCDww2sBre5QHl4dd_cFiIrqz9fM76IeZYriFHkL0T8KgCzFvLTBBBrHAJ0ZLsysuG5Yptjy54rYq0e_0SslDYydIH5Jis0FKovw8z2JoDYvEsirroB8QW3MS3AHEd_MEGkwcL2LWnARrP9k-3OLUL-FO1QwtUTJ6fXS4Mb0gSFRCQVg-NinSLz3-_Gprsy3inqDxTOAzssFpGTVGDzBGkVnekqO3DqNvYo3lgEd2LQhPiIg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1m5k7XcXQc7DxfeWdBBkNft8JdyuymCFRipCQ7KzTfqNRgfOZfAyqP6UBUDqk2TodjRobF_KEuhuIPLzeVpfu3BR7hU-e6eKdm26Jf6VPiCGQUxxjH-4utHacRhBSsLO0MO-THSI6jf8nrvnouUogW7IgP_MqwUswmj2JwIcapolzHGZtzHZrxy-PwOCjKXV9X8xNh7GHDuXKHdf-Q0XkCFQGh1uwD_waIRLDfbDSV1JpIFuci7XhtA"
    ],
    notes: {
      top: "Saffron, Cardamom, Rose Water",
      heart: "Aged Sandalwood, Frankincense",
      base: "Pure Amber Oil, Natural Resins"
    },
    sizes: [
      { size: "6 ml", price: 80, originalPrice: 180, label: "6 ml Bottle", isDefault: true },
      { size: "8 ml", price: 99, originalPrice: 199, label: "8 ml Bottle", isDefault: false }
    ]
  },
  {
    id: "velvet-santal",
    name: "Velvet Santal",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Fragrance Blend",
    isBestSeller: false,
    inStock: true,
    tag: "Sandalwood & Amber",
    shortDescription: "Sandalwood, cardamom and warm amber in a smooth, lingering composition.",
    fullDescription: "Creamy sandalwood balanced with gentle aromatic spice and warm golden amber for a calm, sophisticated presence.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqpBREULoQg-LezTrw6Jvh7uuBSj5J32mRj8Xp4oZ2gipBacYQ2fSq2EnGPNf2xfgoQE5VrWzl14w__0dfGTEl2CAR1SDav3K5u7t54O9bp6C_YqL4hwioEDK2B9V8oMLrMXbWS4QjMOH4uMWUyZZr4jzRtf6inw_cdEU6jLSCwEFpEYH0ream1d6o2wmHTgGxIs0M73hqKN3Y6jO9CQTLf5f_RTaK9XA_NZut5hoHUoepq7VzUn-zSg"
    ],
    notes: {
      top: "Cardamom, Violet Leaves",
      heart: "Australian Sandalwood, Papyrus",
      base: "Cedarwood, Ambergris, Warm Leather"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "amber-rose",
    name: "Amber Rose",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Floral & Amber",
    isBestSeller: false,
    inStock: true,
    tag: "Rose & Amber",
    shortDescription: "Sweet rose petals blended with warm benzoin and cedar.",
    fullDescription: "A romantic blend pairing blooming rose petals with deep warm amber and gentle cedar notes.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKqeBzRFKnLGdEQmEC72p7nE76EDC3a0MDQcqW7sh0DFWHeTnBJ1essyKMappg4lKE-ju4u1DyaQW6pdTW_3tK99IYx1U4mbQwi6KsbwEiWKaua5HsoQ-l4qGo1M5Ixe9zRPOlaV0dBvSTyInDoEzvMfhThS8MEea5o9SBA_gbS2MPbNsSW70NE_GGHgIGZ11JsDSjPCLguEVdNyn-hEccmTgxUb6mX-FkPAe01qWMqt_F79J7U0t32A"
    ],
    notes: {
      top: "Pink Peppercorn, Dewy Rose",
      heart: "Rose Petals, Benzoin",
      base: "Golden Amber, Cedarwood, Soft Musk"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "smoky-leather",
    name: "Smoky Leather",
    category: "perfumes",
    price: 450,
    originalPrice: 550,
    size: "50 ml",
    concentration: "Eau de Parfum",
    badge: "Signature Blend",
    isBestSeller: false,
    inStock: true,
    tag: "Leather Accord",
    shortDescription: "Rich leather, frankincense, and warm spices for a bold, distinctive scent.",
    fullDescription: "A bold and smooth fragrance blending leather, incense, and warm woody notes for an unmistakable presence.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtCG33L9gK8OQgkfXIY_AdLqAx2mZUOWszSzqKCRWlLOvWM6oNZasObWoQoQo0Vm_h3wX_w1_IlJbxGNAe9Lmf42XHDlrR9Ky3ms5VU3RWUt83MjeUUFo1_T6sys_ffus7ehqp5KMZzhmV8lFBfR2CxNLxR6wuk2_SnLFWLAlbzM6R6_mB507DzXctRXy3VS_11GeBOdhKAYguNkuPB2mIr9EYL2oxYi1I-di9JjcPZmaAYHlNOFk_Kg"
    ],
    notes: {
      top: "Thyme, Raspberry, Saffron",
      heart: "Frankincense, Night Jasmine",
      base: "Leather, Black Suede, Amberwood"
    },
    sizes: [
      { size: "50 ml", price: 450, originalPrice: 550, label: "50 ml Bottle", isDefault: true },
      { size: "100 ml", price: 650, originalPrice: 799, label: "100 ml Bottle", isDefault: false },
      { size: "30 ml", price: 299, originalPrice: 399, label: "30 ml Bottle", isDefault: false },
      { size: "20 ml Vial", price: 199, originalPrice: 299, label: "Pocket Vial", isDefault: false }
    ]
  },
  {
    id: "oud-aura-gift-set",
    name: "Oud & Aura Gift Set",
    category: "gifts",
    price: 589,
    originalPrice: 600,
    size: "3 × 20 ml",
    concentration: "Gift Set",
    badge: "Limited Collection",
    isBestSeller: true,
    inStock: true,
    tag: "Gift Set",
    shortDescription: "A beautiful set of three fragrances, made for discovering new favourites or sharing with someone special.",
    fullDescription: "A beautiful set of three fragrances, made for discovering new favourites or sharing the Oud & Aura experience with someone special.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHj4rMw6Rjg_Ru-uRJ_VmGRQjmDIC2UXrKrwBdgqE2oq-aHIgTjM0RDAROrCQYKwHPJ0rD0dkxn1YMTujP2w50jHHB26M_4ip-Gh7YtL1omQUl7Z35Ng8R0X37KIiVA7yAjHSCFYq9gqjtD5m2XGh1FoR1Ouz9GSyU_iBOEqTzDk2pTcb3cdzkKHPv359qbXTZzmZ0FnkH9DqpIPKmJck24isnuUqQsWZuVP2QfBLsP6IxC1JWp_JcwA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDP-5_aOACthL7lSl-xis2qS0zcMdDWnPQI1yPnFYwi_jP_EU8gYqmpv-YPL8t3e7WsJXFj0VJvf8rVId1cykDWyLnh01xdKs6Lu13h2g0vi9cQbB0KHz92MxzxxG0dH2cRlb0isfzrgekhScDqbyCvappDNJHNT2bx-C9Y81oCZMM2O7JwsEGYqZ7D60HaRK-KMDdLDU0wq5bw3d0u8S7k2gZCTGfPdM_EPoSTH1t2kDl0b0oSG2Silw"
    ],
    notes: {
      top: "Assortment of Fresh Accords",
      heart: "Floral & Warm Spices",
      base: "Amber & Woody Notes"
    },
    sizes: [
      { size: "3 × 20 ml", price: 589, originalPrice: 600, label: "Complete Set", isDefault: true }
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
