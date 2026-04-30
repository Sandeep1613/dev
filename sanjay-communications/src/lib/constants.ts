export const CATEGORIES = [
  { slug: "mobile-phones", name: "Latest Mobile Phones", emoji: "📱" },
  { slug: "chargers", name: "Chargers", emoji: "🔌" },
  { slug: "power-banks", name: "Power Banks", emoji: "🔋" },
  { slug: "earphones", name: "Earphones", emoji: "🎧" },
  { slug: "mobile-covers", name: "Mobile Covers", emoji: "📲" },
  { slug: "tempered-glass", name: "Tempered Glass", emoji: "🛡️" },
  { slug: "smart-watches", name: "Smart Watches", emoji: "⌚" },
  { slug: "cables", name: "Cables", emoji: "🔗" },
  { slug: "adapters", name: "Adapters", emoji: "⚡" },
  { slug: "accessories", name: "Accessories", emoji: "✨" },
] as const;

export const STORE = {
  name: "Sanjay Communications",
  tagline: "Premium mobiles & accessories.",
  phone: "+91 98765 43210",
  email: "hello@sanjaycommunications.com",
  address: "Main Market, Your City, India",
  hours: "Mon–Sat · 10:00 AM – 9:00 PM",
};

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
