/**
 * Seed script.
 * Run with:  npx tsx src/scripts/seed.ts
 *
 * - Creates the admin user from ADMIN_EMAIL / ADMIN_PASSWORD env vars
 * - Inserts a curated set of sample products across every category
 * - Inserts a default homepage banner
 *
 * Safe to re-run: products are upserted by slug; admin is upserted by email.
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import bcrypt from "bcryptjs";
import { dbConnect } from "../lib/db";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { Banner } from "../models/Banner";
import { slugify } from "../lib/constants";

const PRODUCTS = [
  // ── MOBILE PHONES ──
  {
    name: "iPhone 15 Pro Max 256GB — Natural Titanium",
    brand: "Apple",
    category: "mobile-phones",
    price: 159900, discountPrice: 154900,
    images: ["https://images.unsplash.com/photo-1696446702183-be9605cabf5b?auto=format&fit=crop&w=1000&q=80"],
    description:
      "Forged in titanium and powered by A17 Pro, iPhone 15 Pro Max is the most advanced iPhone yet — with a customisable Action button, the most powerful iPhone camera system ever, and USB-C.",
    specifications: {
      Display: "6.7\" Super Retina XDR OLED",
      Chip: "Apple A17 Pro",
      Storage: "256GB",
      Camera: "48MP + 12MP + 12MP",
      Battery: "4422 mAh",
      OS: "iOS 17",
    },
    stock: 12, rating: 4.9, reviewCount: 348,
    isFeatured: true, isNewArrival: true,
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    category: "mobile-phones",
    price: 134999, discountPrice: 119999,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80"],
    description:
      "AI-powered photography, a 200MP main camera, and the built-in S Pen — all inside the most refined Galaxy Ultra ever.",
    specifications: {
      Display: "6.8\" Dynamic AMOLED 2X",
      Chip: "Snapdragon 8 Gen 3",
      Storage: "512GB",
      Camera: "200MP + 50MP + 12MP + 10MP",
      Battery: "5000 mAh",
    },
    stock: 9, rating: 4.8, reviewCount: 211,
    isFeatured: true, isBestSeller: true,
  },
  {
    name: "OnePlus 12 256GB — Flowy Emerald",
    brand: "OnePlus",
    category: "mobile-phones",
    price: 64999, discountPrice: 59999,
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"],
    description: "Hasselblad cameras, 100W SuperVOOC charging, and a 6.82\" 2K display — flagship power without the flagship price.",
    specifications: {
      Display: "6.82\" 2K AMOLED 120Hz",
      Chip: "Snapdragon 8 Gen 3",
      Storage: "256GB",
      Battery: "5400 mAh · 100W charging",
    },
    stock: 15, rating: 4.7, reviewCount: 142,
    isNewArrival: true,
  },
  {
    name: "Xiaomi 14 Ultra 512GB",
    brand: "Xiaomi",
    category: "mobile-phones",
    price: 99999, discountPrice: 94999,
    images: ["https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1000&q=80"],
    description: "Co-engineered with Leica, a quad 50MP camera system, and Snapdragon 8 Gen 3 firepower.",
    specifications: {
      Display: "6.73\" LTPO AMOLED 120Hz",
      Chip: "Snapdragon 8 Gen 3",
      Storage: "512GB",
    },
    stock: 7, rating: 4.6, reviewCount: 88,
    isFeatured: true,
  },

  // ── CHARGERS ──
  {
    name: "65W GaN Fast Charger — Type-C",
    brand: "Anker",
    category: "chargers",
    price: 3499, discountPrice: 2499,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"],
    description: "Charge your phone, tablet and laptop from a single compact GaN charger. Fits in your pocket.",
    specifications: { Output: "65W PD", Ports: "1× USB-C", Tech: "GaN II" },
    stock: 40, rating: 4.7, reviewCount: 562,
    isBestSeller: true,
  },
  {
    name: "20W USB-C Power Adapter",
    brand: "Apple",
    category: "chargers",
    price: 1900, discountPrice: 1690,
    images: ["https://images.unsplash.com/photo-1600490722773-35753aea6332?auto=format&fit=crop&w=1000&q=80"],
    description: "Fast, efficient charging at home, in the office or on the go.",
    specifications: { Output: "20W PD", Ports: "1× USB-C" },
    stock: 30, rating: 4.6, reviewCount: 289,
  },

  // ── POWER BANKS ──
  {
    name: "20000mAh Power Bank — 22.5W Fast Charge",
    brand: "Mi",
    category: "power-banks",
    price: 2499, discountPrice: 1799,
    images: ["https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?auto=format&fit=crop&w=1000&q=80"],
    description: "All-day power for two devices, charged at flagship speeds.",
    specifications: { Capacity: "20000 mAh", Output: "22.5W", Ports: "USB-A × 2 + USB-C" },
    stock: 25, rating: 4.5, reviewCount: 1043,
    isBestSeller: true, isFeatured: true,
  },
  {
    name: "MagSafe Wireless Power Bank 10000mAh",
    brand: "Anker",
    category: "power-banks",
    price: 4999, discountPrice: 3999,
    images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=1000&q=80"],
    description: "Snaps magnetically to your iPhone for true cable-free charging.",
    specifications: { Capacity: "10000 mAh", Wireless: "15W MagSafe", Wired: "20W USB-C PD" },
    stock: 18, rating: 4.6, reviewCount: 178,
  },

  // ── EARPHONES ──
  {
    name: "AirPods Pro (2nd generation) with USB-C",
    brand: "Apple",
    category: "earphones",
    price: 24900, discountPrice: 21900,
    images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1000&q=80"],
    description: "Up to 2× more Active Noise Cancellation. Adaptive Audio. Personalised Spatial Audio.",
    specifications: { Driver: "Custom Apple driver", ANC: "Yes", Battery: "Up to 30h with case" },
    stock: 22, rating: 4.9, reviewCount: 894,
    isFeatured: true, isBestSeller: true,
  },
  {
    name: "Sony WF-1000XM5 Noise Cancelling Earbuds",
    brand: "Sony",
    category: "earphones",
    price: 26990, discountPrice: 22990,
    images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80"],
    description: "Industry-leading noise cancellation with stunning sound clarity.",
    specifications: { Driver: "Dynamic Driver X", ANC: "Yes (HD QN2e)", Battery: "Up to 24h with case" },
    stock: 14, rating: 4.8, reviewCount: 412,
    isNewArrival: true,
  },
  {
    name: "boAt Rockerz 255 Pro+ Wireless Neckband",
    brand: "boAt",
    category: "earphones",
    price: 1999, discountPrice: 1199,
    images: ["https://images.unsplash.com/photo-1631176093617-63490a3d785a?auto=format&fit=crop&w=1000&q=80"],
    description: "60-hour playback, fast charging, and signature boAt bass.",
    specifications: { Driver: "10mm", Battery: "60h", Charging: "ASAP fast charge" },
    stock: 60, rating: 4.3, reviewCount: 2341,
    isBestSeller: true,
  },

  // ── MOBILE COVERS ──
  {
    name: "Silicone Case for iPhone 15 Pro — Stone Blue",
    brand: "Spigen",
    category: "mobile-covers",
    price: 1499, discountPrice: 999,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80"],
    description: "Soft-touch silicone with a microfibre interior. Slim, protective, refined.",
    specifications: { Compatibility: "iPhone 15 Pro", Material: "Liquid silicone" },
    stock: 80, rating: 4.6, reviewCount: 521,
  },
  {
    name: "Galaxy S24 Ultra Leather Wallet Case",
    brand: "Spigen",
    category: "mobile-covers",
    price: 1899, discountPrice: 1299,
    images: ["https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=1000&q=80"],
    description: "Genuine leather finish with integrated card slots and magnetic flap.",
    specifications: { Compatibility: "Galaxy S24 Ultra", Material: "PU Leather" },
    stock: 35, rating: 4.5, reviewCount: 198,
  },

  // ── TEMPERED GLASS ──
  {
    name: "9H Tempered Glass for iPhone 15 — Pack of 2",
    brand: "Spigen",
    category: "tempered-glass",
    price: 999, discountPrice: 549,
    images: ["https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=1000&q=80"],
    description: "Crystal-clear edge-to-edge protection. Includes installation kit.",
    specifications: { Hardness: "9H", Pack: "2 pieces", Compatibility: "iPhone 15 / 15 Plus" },
    stock: 100, rating: 4.4, reviewCount: 1620,
    isBestSeller: true,
  },
  {
    name: "Privacy Tempered Glass — Universal 6.7\"",
    brand: "Generic",
    category: "tempered-glass",
    price: 799, discountPrice: 449,
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80"],
    description: "Anti-spy filter — only you can see your screen.",
    specifications: { Hardness: "9H", Type: "Privacy filter" },
    stock: 70, rating: 4.2, reviewCount: 312,
  },

  // ── SMART WATCHES ──
  {
    name: "Apple Watch Series 9 GPS — 45mm Midnight",
    brand: "Apple",
    category: "smart-watches",
    price: 45900, discountPrice: 41900,
    images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1000&q=80"],
    description: "A magical new way to use your Apple Watch without touching the screen — Double Tap. Brighter display. Faster S9 chip.",
    specifications: { Display: "Always-On Retina", Chip: "Apple S9", Size: "45mm" },
    stock: 11, rating: 4.8, reviewCount: 421,
    isFeatured: true, isNewArrival: true,
  },
  {
    name: "Samsung Galaxy Watch 6 Classic 47mm",
    brand: "Samsung",
    category: "smart-watches",
    price: 39999, discountPrice: 32999,
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80"],
    description: "The iconic rotating bezel returns. Advanced sleep coaching and BIA body composition tracking.",
    specifications: { Display: "1.5\" Super AMOLED", OS: "Wear OS 4", Size: "47mm" },
    stock: 13, rating: 4.6, reviewCount: 167,
  },
  {
    name: "Noise ColorFit Pro 5 Smart Watch",
    brand: "Noise",
    category: "smart-watches",
    price: 4999, discountPrice: 2999,
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"],
    description: "1.85\" AMOLED display, Bluetooth calling, and 7-day battery life.",
    specifications: { Display: "1.85\" AMOLED", Battery: "7 days", Calling: "Yes" },
    stock: 45, rating: 4.3, reviewCount: 980,
    isBestSeller: true,
  },

  // ── CABLES ──
  {
    name: "USB-C to Lightning Cable (1m) — Braided",
    brand: "Anker",
    category: "cables",
    price: 1499, discountPrice: 899,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"],
    description: "MFi-certified, braided nylon for 12× extra durability.",
    specifications: { Length: "1m", Standard: "USB-C → Lightning, MFi" },
    stock: 90, rating: 4.7, reviewCount: 822,
  },
  {
    name: "USB-C to USB-C 100W Cable (2m)",
    brand: "Anker",
    category: "cables",
    price: 1799, discountPrice: 1099,
    images: ["https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=1000&q=80"],
    description: "Charge laptops at full speed and transfer data quickly.",
    specifications: { Length: "2m", Power: "100W PD" },
    stock: 65, rating: 4.6, reviewCount: 410,
  },

  // ── ADAPTERS ──
  {
    name: "USB-C to 3.5mm Headphone Jack Adapter",
    brand: "Apple",
    category: "adapters",
    price: 990, discountPrice: 790,
    images: ["https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1000&q=80"],
    description: "Connect 3.5mm-equipped audio devices to your USB-C device.",
    specifications: { Standard: "USB-C → 3.5mm" },
    stock: 50, rating: 4.4, reviewCount: 234,
  },
  {
    name: "USB-C Multiport Adapter — 7-in-1",
    brand: "Anker",
    category: "adapters",
    price: 4999, discountPrice: 3299,
    images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1000&q=80"],
    description: "HDMI 4K, SD/microSD card slots, USB-A 3.0 ports and 100W pass-through.",
    specifications: { Ports: "HDMI, USB-A × 2, SD, microSD, USB-C PD" },
    stock: 22, rating: 4.6, reviewCount: 178,
    isNewArrival: true,
  },

  // ── ACCESSORIES ──
  {
    name: "Magnetic Phone Holder — Car Dashboard",
    brand: "Spigen",
    category: "accessories",
    price: 1499, discountPrice: 899,
    images: ["https://images.unsplash.com/photo-1613483186449-e1d8d2c0a32d?auto=format&fit=crop&w=1000&q=80"],
    description: "Strong neodymium magnets, 360° rotation, fits any phone.",
    specifications: { Mount: "Dashboard / vent", Rotation: "360°" },
    stock: 40, rating: 4.5, reviewCount: 412,
  },
  {
    name: "Foldable Aluminium Phone Stand",
    brand: "Generic",
    category: "accessories",
    price: 999, discountPrice: 599,
    images: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80"],
    description: "Sturdy, height-adjustable, perfect for video calls and watching.",
    specifications: { Material: "Aluminium alloy", Foldable: "Yes" },
    stock: 55, rating: 4.4, reviewCount: 331,
  },
];

const BANNER = {
  title: "Pro power. Pocket-sized.",
  subtitle: "iPhone 15 Pro Max · Now in store",
  image:
    "https://images.unsplash.com/photo-1696446702183-be9605cabf5b?auto=format&fit=crop&w=1400&q=80",
  ctaText: "Shop iPhone",
  ctaLink: "/category/mobile-phones",
  isActive: true,
  position: 0,
};

async function main() {
  console.log("🌱 Connecting to MongoDB…");
  await dbConnect();

  // ── Admin user ──
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@sanjaycommunications.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  const adminName = process.env.ADMIN_NAME || "Sanjay Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    { name: adminName, email: adminEmail, passwordHash, role: "admin" },
    { upsert: true, new: true }
  );
  console.log(`✅ Admin user ready: ${admin.email}`);

  // ── Products ──
  let inserted = 0;
  let updated = 0;
  for (const p of PRODUCTS) {
    const slug = slugify(p.name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      await Product.updateOne({ slug }, { ...p, slug });
      updated++;
    } else {
      await Product.create({ ...p, slug });
      inserted++;
    }
  }
  console.log(`✅ Products: +${inserted} new, ~${updated} updated`);

  // ── Banner ──
  const bannerCount = await Banner.countDocuments();
  if (bannerCount === 0) {
    await Banner.create(BANNER);
    console.log("✅ Default banner created");
  } else {
    console.log(`ℹ️  Banners already exist (${bannerCount})`);
  }

  console.log("\n🎉 Seeding complete!\n");
  console.log(`   Admin login → ${adminEmail}`);
  console.log(`   Password    → ${adminPassword}`);
  console.log(`   Admin URL   → http://localhost:3000/admin\n`);

  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
