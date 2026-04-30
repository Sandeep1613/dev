import Link from "next/link";
import Image from "next/image";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { Banner } from "@/models/Banner";
import { CATEGORIES, formatINR, STORE } from "@/lib/constants";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { ChevronRight, Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  await dbConnect();
  const [featured, newArrivals, bestSellers, banners] = await Promise.all([
    Product.find({ isFeatured: true }).limit(8).lean(),
    Product.find({ isNewArrival: true }).limit(8).lean(),
    Product.find({ isBestSeller: true }).limit(8).lean(),
    Banner.find({ isActive: true }).sort({ position: 1 }).lean(),
  ]);
  return {
    featured: JSON.parse(JSON.stringify(featured)) as ProductCardData[],
    newArrivals: JSON.parse(JSON.stringify(newArrivals)) as ProductCardData[],
    bestSellers: JSON.parse(JSON.stringify(bestSellers)) as ProductCardData[],
    banners: JSON.parse(JSON.stringify(banners)) as any[],
  };
}

export default async function Home() {
  let data;
  try {
    data = await getData();
  } catch {
    data = { featured: [], newArrivals: [], bestSellers: [], banners: [] };
  }
  const { featured, newArrivals, bestSellers, banners } = data;
  const heroBanner = banners[0];
  const heroProduct = featured[0];

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        <div className="container-wide pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32 text-center">
          <p className="h-eyebrow mb-4 animate-fade-in">New season · Latest arrivals</p>
          <h1 className="h-display text-[44px] sm:text-[64px] lg:text-[88px] tracking-tightest animate-fade-up">
            Premium tech.
            <br />
            <span className="text-gradient">Effortlessly yours.</span>
          </h1>
          <p className="mt-5 sm:mt-7 text-[17px] sm:text-[19px] text-ink-soft max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.15s" }}>
            From the latest flagship phones to perfectly matched accessories — curated, in stock, and ready to ship.
          </p>
          <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/products" className="btn-primary">
              Shop the collection
            </Link>
            <Link href="/category/mobile-phones" className="btn-ghost">
              Latest phones <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Hero showcase */}
        <div className="container-wide pb-10 lg:pb-16">
          <div className="relative rounded-3xl overflow-hidden bg-bg-subtle">
            <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-200/40 blob" />
            <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-pink-200/40 blob" />
            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-0 items-center p-8 sm:p-14 lg:p-20">
              <div className="text-center lg:text-left">
                <p className="h-eyebrow mb-3">{heroBanner?.subtitle ?? "Featured"}</p>
                <h2 className="h-display text-[36px] sm:text-[52px] lg:text-[64px]">
                  {heroBanner?.title ?? "Pro power. Pocket-sized."}
                </h2>
                <p className="mt-5 text-ink-soft max-w-md mx-auto lg:mx-0">
                  Discover phones that keep up with you — silicon-shop fast, all-day battery, brilliant displays.
                </p>
                <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href={heroBanner?.ctaLink ?? "/category/mobile-phones"} className="btn-primary">
                    {heroBanner?.ctaText ?? "Shop phones"}
                  </Link>
                  {heroProduct && (
                    <Link href={`/product/${heroProduct.slug}`} className="btn-ghost">
                      Featured: {heroProduct.name.split(" ").slice(0, 2).join(" ")}
                    </Link>
                  )}
                </div>
              </div>
              <div className="relative aspect-square max-w-md mx-auto w-full">
                <Image
                  src={
                    heroBanner?.image ||
                    "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Featured device"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CATEGORIES STRIP ───── */}
      <section className="container-wide py-8">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="shrink-0 group flex flex-col items-center justify-center w-[110px] sm:w-[130px] h-[110px] sm:h-[130px] rounded-2xl bg-bg-subtle hover:bg-bg-dim transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl sm:text-4xl mb-2 transition-transform group-hover:scale-110">
                {c.emoji}
              </span>
              <span className="text-[12px] sm:text-[13px] font-medium text-ink-soft text-center px-2 leading-tight">
                {c.name.replace("Latest ", "")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── FEATURED ───── */}
      {featured.length > 0 && (
        <section className="container-wide py-12 sm:py-16">
          <SectionHeader
            eyebrow="Hand-picked"
            title="Featured products"
            subtitle="Bestsellers our customers can't stop talking about."
            href="/products?filter=featured"
          />
          <Grid items={featured} />
        </section>
      )}

      {/* ───── NEW ARRIVALS ───── */}
      {newArrivals.length > 0 && (
        <section className="bg-bg-subtle py-16 sm:py-20 mt-8">
          <div className="container-wide">
            <SectionHeader
              eyebrow="Just landed"
              title="New arrivals"
              subtitle="Fresh additions to the shelf this week."
              href="/products?filter=new"
            />
            <Grid items={newArrivals} />
          </div>
        </section>
      )}

      {/* ───── BIG OFFER PANEL ───── */}
      <section className="container-wide py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-5">
          <OfferTile
            kicker="Up to 40% off"
            title="Sound, refined."
            sub="Earphones engineered for your everyday."
            href="/category/earphones"
            color="from-zinc-900 to-zinc-700"
            text="text-white"
          />
          <OfferTile
            kicker="Power that lasts"
            title="Charge anywhere."
            sub="Power banks & chargers, ready when you are."
            href="/category/power-banks"
            color="from-blue-50 to-white"
            text="text-ink"
          />
        </div>
      </section>

      {/* ───── BEST SELLERS ───── */}
      {bestSellers.length > 0 && (
        <section className="container-wide py-12 sm:py-16">
          <SectionHeader
            eyebrow="Customer favourites"
            title="Best selling accessories"
            subtitle="The essentials people come back for."
            href="/products?filter=bestseller"
          />
          <Grid items={bestSellers} />
        </section>
      )}

      {/* ───── WHY US ───── */}
      <section className="container-wide py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="h-eyebrow mb-3">Why Sanjay Communications</p>
          <h2 className="h-display text-3xl sm:text-5xl">Built around you.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature
            Icon={Truck}
            title="Fast delivery"
            text="In-stock items ship the same day across major cities."
          />
          <Feature
            Icon={ShieldCheck}
            title="100% Genuine"
            text="Sourced direct from brands. Original or your money back."
          />
          <Feature
            Icon={RefreshCcw}
            title="Easy returns"
            text="7-day no-questions returns on everything we ship."
          />
          <Feature
            Icon={Headphones}
            title="We're here"
            text="Real humans on call — six days a week."
          />
        </div>
      </section>

      {/* ───── REVIEWS ───── */}
      <section className="bg-ink text-white py-16 sm:py-24">
        <div className="container-wide">
          <p className="h-eyebrow text-white/60 mb-3 text-center">Loved by 10,000+ customers</p>
          <h2 className="h-display text-3xl sm:text-5xl text-center mb-12">
            What people are saying.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <figure
                key={i}
                className="rounded-3xl bg-white/5 backdrop-blur p-7 sm:p-8 border border-white/10"
              >
                <div className="text-yellow-400 mb-4 text-sm">★★★★★</div>
                <blockquote className="text-[15px] leading-relaxed text-white/85">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-6 text-[13px] text-white/60">
                  — {r.name}, {r.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CONTACT CTA ───── */}
      <section className="container-wide py-16 sm:py-24 text-center">
        <h2 className="h-display text-3xl sm:text-5xl">Visit our store.</h2>
        <p className="mt-4 text-ink-soft max-w-md mx-auto">
          {STORE.address} · {STORE.hours}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact" className="btn-dark">
            Get in touch
          </Link>
          <Link href="/about" className="btn-ghost">
            About us
          </Link>
        </div>
      </section>
    </>
  );
}

/* ─────────── helpers ─────────── */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="h-eyebrow mb-2">{eyebrow}</p>
        <h2 className="h-display text-2xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-ink-soft text-[15px]">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center text-accent text-sm hover:opacity-80"
        >
          See all <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function Grid({ items }: { items: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((p) => (
        <ProductCard key={p._id} p={p} />
      ))}
    </div>
  );
}

function OfferTile({
  kicker,
  title,
  sub,
  href,
  color,
  text,
}: {
  kicker: string;
  title: string;
  sub: string;
  href: string;
  color: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className={`relative group rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-16 min-h-[340px] flex flex-col justify-between bg-gradient-to-br ${color} ${text} transition-transform hover:-translate-y-1`}
    >
      <div>
        <p className="h-eyebrow mb-3" style={{ color: "currentColor", opacity: 0.7 }}>
          {kicker}
        </p>
        <h3 className="h-display text-3xl sm:text-4xl lg:text-5xl">{title}</h3>
        <p className="mt-3 text-[15px] opacity-80 max-w-xs">{sub}</p>
      </div>
      <span className="inline-flex items-center text-[14px] font-medium opacity-90 group-hover:opacity-100">
        Shop now <ChevronRight size={16} className="ml-1" />
      </span>
    </Link>
  );
}

function Feature({
  Icon,
  title,
  text,
}: {
  Icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-line/60 p-7 hover:border-ink/30 transition-colors">
      <Icon size={22} className="text-accent" strokeWidth={1.6} />
      <h3 className="mt-5 text-[16px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed">{text}</p>
    </div>
  );
}

const REVIEWS = [
  {
    text: "The phone arrived next day in perfect condition. Sanjay bhai personally followed up — service like the old days.",
    name: "Rohan",
    city: "Delhi",
  },
  {
    text: "Bought a smartwatch and a tempered glass. Genuine products, fair price. My new go-to for accessories.",
    name: "Priya",
    city: "Mumbai",
  },
  {
    text: "Their power banks are the real deal. Already on my second purchase from them.",
    name: "Karan",
    city: "Bangalore",
  },
];
