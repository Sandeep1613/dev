import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { CATEGORIES } from "@/lib/constants";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return notFound();

  await dbConnect();
  const products = JSON.parse(
    JSON.stringify(await Product.find({ category: cat.slug }).sort({ createdAt: -1 }).lean())
  ) as ProductCardData[];

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-wide py-16 sm:py-24 text-center">
          <p className="h-eyebrow mb-3">Category</p>
          <h1 className="h-display text-4xl sm:text-6xl">{cat.name}</h1>
          <p className="mt-4 text-ink-soft max-w-lg mx-auto">
            Carefully chosen {cat.name.toLowerCase()} from the brands you trust.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-bg-subtle rounded-3xl">
            <p className="text-ink-soft">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
