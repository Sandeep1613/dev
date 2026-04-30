"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Image as ImageIcon, LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/banners", label: "Banners", Icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as any)?.role !== "admin") {
      router.replace("/login?next=/admin");
    }
  }, [session, status, router]);

  if (status === "loading" || (session?.user as any)?.role !== "admin") {
    return (
      <div className="min-h-[70vh] grid place-items-center text-ink-mute">Verifying…</div>
    );
  }

  return (
    <div className="bg-bg-subtle min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block border-r border-line/70 bg-white p-6 sticky top-12 h-[calc(100vh-3rem)]">
          <p className="text-[12px] text-ink-mute mb-6">Admin</p>
          <nav className="space-y-1">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/admin" && path.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                    active ? "bg-ink text-white" : "text-ink-soft hover:bg-bg-subtle"
                  }`}
                >
                  <n.Icon size={16} strokeWidth={1.6} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-8 flex items-center gap-3 px-3 py-2.5 text-[13px] text-ink-mute hover:text-ink"
          >
            <LogOut size={15} /> Sign out
          </button>
        </aside>

        <div>
          {/* Mobile nav */}
          <div className="lg:hidden bg-white border-b border-line/70 px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/admin" && path.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[12.5px] ${
                    active ? "bg-ink text-white" : "text-ink-soft border border-line"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>

          <div className="p-6 sm:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
