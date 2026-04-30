"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { CATEGORIES, STORE } from "@/lib/constants";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const count = useCart((s) => s.count());
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-line/60"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <nav className="container-wide flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="font-semibold tracking-tight text-[15px]">
            <span className="text-ink">Sanjay</span>
            <span className="text-ink-mute font-normal"> Communications</span>
          </Link>

          {/* Desktop categories */}
          <ul className="hidden lg:flex items-center gap-7 text-[13px] text-ink-soft">
            {CATEGORIES.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="hover:text-ink transition-colors"
                >
                  {c.name.replace("Latest ", "")}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="hover:text-ink transition-colors">
                Shop all
              </Link>
            </li>
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-4 text-ink-soft">
            <Link
              href="/products"
              className="hidden sm:inline-flex hover:text-ink transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </Link>

            {session ? (
              <div className="hidden sm:flex items-center gap-3 text-[13px]">
                <Link href="/orders" className="hover:text-ink transition-colors">
                  Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hover:text-ink transition-colors text-accent"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-ink transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex hover:text-ink transition-colors"
                aria-label="Account"
              >
                <User size={17} />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative hover:text-ink transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={17} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-ink text-white text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden text-ink-soft hover:text-ink"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-white p-6 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <span className="font-semibold">{STORE.name}</span>
              <button onClick={() => setOpen(false)} className="text-ink-soft">
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-line/60 text-[15px]"
                  >
                    <span>{c.name}</span>
                    <span className="text-ink-mute">{c.emoji}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <Link href="/products" onClick={() => setOpen(false)} className="btn-dark">
                Shop all
              </Link>
              {session ? (
                <Link href="/orders" onClick={() => setOpen(false)} className="btn-ghost">
                  My orders
                </Link>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost">
                  Sign in
                </Link>
              )}
            </div>
            <div className="mt-10 text-[13px] text-ink-mute leading-relaxed">
              <p>{STORE.address}</p>
              <p className="mt-1">{STORE.phone}</p>
              <p className="mt-1">{STORE.hours}</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
