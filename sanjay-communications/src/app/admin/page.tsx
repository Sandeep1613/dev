"use client";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { ShoppingBag, Package, Users, IndianRupee } from "lucide-react";

export default function AdminHome() {
  const [data, setData] = useState<any>({ stats: {}, last7: [] });

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setData);
  }, []);

  const { stats, last7 } = data;
  const max = Math.max(1, ...(last7?.map((d: any) => d.revenue) || [0]));

  return (
    <>
      <h1 className="h-display text-3xl sm:text-4xl mb-8">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card Icon={IndianRupee} label="Total sales" value={formatINR(stats.totalSales || 0)} />
        <Card Icon={ShoppingBag} label="Total orders" value={stats.totalOrders || 0} />
        <Card Icon={Package} label="Products" value={stats.totalProducts || 0} />
        <Card Icon={Users} label="Customers" value={stats.totalUsers || 0} />
      </div>

      <div className="mt-8 bg-white rounded-3xl p-7 border border-line/70">
        <h2 className="text-[16px] font-semibold mb-6">Last 7 days</h2>
        {last7?.length ? (
          <div className="flex items-end gap-3 h-48">
            {last7.map((d: any) => (
              <div key={d._id} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-accent/80 rounded-t-md transition-all"
                  style={{ height: `${(d.revenue / max) * 100}%`, minHeight: "4px" }}
                  title={`${d._id}: ${formatINR(d.revenue)}`}
                />
                <span className="text-[10px] text-ink-mute">
                  {d._id.slice(5)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-ink-mute">No orders yet.</p>
        )}
      </div>
    </>
  );
}

function Card({ Icon, label, value }: { Icon: any; label: string; value: any }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-line/70">
      <Icon size={18} className="text-accent mb-4" strokeWidth={1.6} />
      <p className="text-[12px] text-ink-mute">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
