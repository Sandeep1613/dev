import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { CATEGORIES } from "@/lib/constants";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(searchParams: { [k: string]: string | string[] | undefined }) {
  await dbConnect();
  const query: any = {};
  const cat = searchParams.category as string | undefined;
  const q = searchParams.q as string | undefined;
  const filter = searchParams.filter as string | undefined;
  if (cat) query.category = cat;
  if (q) query.name = { $regex: q, $options: "i" };
  if (filter === "featured") query.isFeatured = true;
  if (filter === "new") query.isNewArrival = true;
  if (filter === "bestseller") query.isBestSeller = true;
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products)) as ProductCardData[];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  let products: ProductCardData[] = [];
  try {
    products = await getProducts(searchParams);
  } catch {}

  const activeCat = searchParams.category as string | undefined;

  return (
    <section className="container-wide py-12 sm:py-16">
      <header className="mb-10">
        <p className="h-eyebrow mb-2">Shop</p>
        <h1 className="h-display text-3xl sm:text-5xl">All products</h1>
        <p className="mt-3 text-ink-soft max-w-xl">
          Browse the complete range — from latest phones to perfectly paired accessories.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 -mx-1 px-1">
        <Link
          href="/products"
          className={`shrink-0 px-4 py-2 rounded-full text-[13px] border transition-colors ${
            !activeCat
              ? "bg-ink text-white border-ink"
              : "border-line text-ink-soft hover:border-ink/50"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={`shrink-0 px-4 py-2 rounded-full text-[13px] border transition-colors ${
              activeCat === c.slug
                ? "bg-ink text-white border-ink"
                : "border-line text-ink-soft hover:border-ink/50"
            }`}
          >
            {c.name.replace("Latest ", "")}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-bg-subtle rounded-3xl">
          <p className="text-ink-soft">No products yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
