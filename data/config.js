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
  freeShippingThreshold: 999,

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
  },
  // Backend API URL (Optional remote server or Cloudflare tunnel)
  // When empty or running on localhost, requests route to local server.py
  // For remote devices, phones, or static hosting (like GitHub Pages), set your backend server URL here.
  apiBaseUrl: "https://executive-troops-angel-bridges.trycloudflare.com",

  // Helper method to resolve API endpoints across localhost, file://, tunnel, and GitHub Pages
  getApiUrl(endpoint) {
    const clean = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      // 1. Direct localhost or 127.0.0.1
      if (host === "localhost" || host === "127.0.0.1") {
        return clean;
      }
      // 2. Direct Cloudflare tunnel hostname
      if (host.includes("trycloudflare.com")) {
        return clean;
      }
      // 3. Double-clicked local file (file://)
      if (window.location.protocol === "file:") {
        return "http://localhost:8080" + clean;
      }
      // 4. Remote host (GitHub Pages, custom domain) -> Route to active backend
      if (this.apiBaseUrl) {
        return this.apiBaseUrl.replace(/\/$/, "") + clean;
      }
    }
    return clean;
  }
};

// Global helper for convenient access
function getApiUrl(endpoint) {
  if (typeof SITE_CONFIG !== 'undefined' && typeof SITE_CONFIG.getApiUrl === 'function') {
    return SITE_CONFIG.getApiUrl(endpoint);
  }
  return endpoint;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
