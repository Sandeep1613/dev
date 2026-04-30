import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductForm } from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await dbConnect();
  const raw = await Product.findById(params.id).lean();
  if (!raw) return notFound();

  // Convert Mongoose Map to plain object for the client form
  const p: any = JSON.parse(JSON.stringify(raw));

  return (
    <>
      <h1 className="h-display text-3xl sm:text-4xl mb-8">Edit product</h1>
      <ProductForm productId={params.id} initial={p} />
    </>
  );
}
