import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { formatINR } from "@/lib/constants";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  await dbConnect();
  const product = JSON.parse(
    JSON.stringify(await Product.findOne({ slug: params.slug }).lean())
  );
  if (!product) return notFound();

  const related = JSON.parse(
    JSON.stringify(
      await Product.find({ category: product.category, _id: { $ne: product._id } })
        .limit(4)
        .lean()
    )
  ) as ProductCardData[];

  const final = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const off = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const specs = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <>
      <section className="container-wide pt-10 pb-16 lg:pt-16 lg:pb-24">
        <nav className="text-[12px] text-ink-mute mb-6">
          <Link href="/" className="hover:text-ink">Home</Link> ·{" "}
          <Link href="/products" className="hover:text-ink">Shop</Link> ·{" "}
          <Link href={`/category/${product.category}`} className="hover:text-ink capitalize">
            {product.category.replace(/-/g, " ")}
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-subtle">
              {product.images?.[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8"
                />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {product.images.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-bg-subtle">
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="h-eyebrow mb-3">{product.brand || "Sanjay Communications"}</p>
            <h1 className="h-display text-3xl sm:text-5xl tracking-tight">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {product.rating?.toFixed(1) || "4.5"}
              </span>
              <span>·</span>
              <span>{product.reviewCount || 0} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-semibold">{formatINR(final)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-ink-mute line-through">{formatINR(product.price)}</span>
                  <span className="text-[13px] font-medium text-green-700">{off}% off</span>
                </>
              )}
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft whitespace-pre-line">
              {product.description}
            </p>

            <div className="mt-8">
              <ProductActions
                product={{
                  _id: String(product._id),
                  name: product.name,
                  image: product.images?.[0] || "",
                  price: final,
                  stock: product.stock,
                }}
              />
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 text-[12px]">
              <Badge Icon={Truck} text="Fast delivery" />
              <Badge Icon={ShieldCheck} text="Genuine product" />
              <Badge Icon={RefreshCcw} text="7-day returns" />
            </div>

            {specs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[15px] font-semibold mb-4">Specifications</h2>
                <dl className="border-t border-line/70">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3 border-b border-line/70 text-[14px]">
                      <dt className="text-ink-mute">{k}</dt>
                      <dd className="font-medium text-right">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-wide pb-20">
          <h2 className="h-display text-2xl sm:text-3xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Badge({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-bg-subtle">
      <Icon size={18} className="text-accent" strokeWidth={1.6} />
      <span className="text-ink-soft">{text}</span>
    </div>
  );
}
