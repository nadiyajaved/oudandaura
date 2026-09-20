/**
 * Oud & Aura - Global Configuration
 * 
 * Update your business WhatsApp number, email, social links, and brand info here.
 * These are editable placeholders and can be replaced at any time.
 */

const SITE_CONFIG = {
  // Brand Identity
  brandName: "OUD & AURA",
  brandSubtitle: "PERFUMES",
  tagline: "The Essence of Elegance",

  // WhatsApp Business Ordering Configuration
  // Set your WhatsApp number with country code (no + sign, no spaces or dashes)
  // e.g., "919876543210" for +91 98765 43210
  whatsappNumber: "919819929863", // [EDITABLE PLACEHOLDER]
  whatsappDisplayNumber: "+91 9819929863", // [EDITABLE PLACEHOLDER]

  // Official Business Email
  contactEmail: "oudandaaura@gmail.com", // [EDITABLE PLACEHOLDER]

  // Instagram Channel
  instagramHandle: "@oudandaura", // [EDITABLE PLACEHOLDER]
  instagramUrl: "https://www.instagram.com/oudandaura?stkn=eW1mb2s5Z29rZm5q", // [EDITABLE PLACEHOLDER]

  // Store Currency & Thresholds
  currencySymbol: "₹",
  freeShippingThreshold: 499,

  // Helper method to create WhatsApp link with pre-filled message
  getWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message || "Hello Oud & Aura, I would like to inquire about your fragrances.");
    return `https://wa.me/${this.whatsappNumber}?text=${encoded}`;
  },

  // Helper method for single product order link
  getProductWhatsAppUrl(productName, size, price) {
    const sizePart = size ? `, ${size}` : "";
    const pricePart = price ? ` (Price: ${this.currencySymbol}${price})` : "";
    const msg = `Hi Oud & Aura, I would like to order ${productName}${sizePart}${pricePart}.`;
    return this.getWhatsAppUrl(msg);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
