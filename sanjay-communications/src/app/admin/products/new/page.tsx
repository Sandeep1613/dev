import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <h1 className="h-display text-3xl sm:text-4xl mb-8">Add product</h1>
      <ProductForm />
    </>
  );
}
