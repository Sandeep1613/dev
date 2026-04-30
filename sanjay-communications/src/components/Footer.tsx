import Link from "next/link";
import { CATEGORIES, STORE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-bg-subtle text-ink-soft text-[12px] mt-24">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-semibold text-ink text-[14px]">{STORE.name}</p>
            <p className="mt-3 leading-relaxed">{STORE.tagline}</p>
            <p className="mt-4">{STORE.address}</p>
            <p className="mt-1">{STORE.phone}</p>
            <p className="mt-1">{STORE.email}</p>
          </div>

          <div>
            <p className="font-semibold text-ink text-[13px] mb-3">Shop</p>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="hover:text-ink transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-ink text-[13px] mb-3">More</p>
            <ul className="space-y-2">
              {CATEGORIES.slice(5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="hover:text-ink transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-ink text-[13px] mb-3">Account</p>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-ink transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-ink transition-colors">
                  My orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-ink transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-ink text-[13px] mb-3">Company</p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-ink transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-ink transition-colors">
                  All products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-line/70" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="text-ink-mute">
            India · Free shipping over ₹999 · Secure payments by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
