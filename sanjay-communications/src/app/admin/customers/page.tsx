"use client";
import { useEffect, useState } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="h-display text-3xl sm:text-4xl mb-8">Customers</h1>

      <div className="bg-white rounded-3xl border border-line/70 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-mute">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-ink-mute">No customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-bg-subtle text-ink-mute text-[12px] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-t border-line/60">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-ink-soft">{c.email || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{c.phone || "—"}</td>
                    <td className="px-5 py-3 text-ink-mute">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
