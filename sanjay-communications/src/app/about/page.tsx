import Link from "next/link";
import { STORE } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <section className="container-wide py-16 sm:py-28 text-center">
        <p className="h-eyebrow mb-3">Our story</p>
        <h1 className="h-display text-4xl sm:text-6xl">Built on trust.<br />Run with care.</h1>
        <p className="mt-6 text-ink-soft max-w-xl mx-auto text-[16px] leading-relaxed">
          {STORE.name} has been a neighbourhood name for years — known for honest pricing,
          original products, and the kind of service that brings people back.
        </p>
      </section>

      <section className="bg-bg-subtle py-20">
        <div className="container-page grid md:grid-cols-3 gap-8 text-center">
          <Stat n="10K+" label="Happy customers" />
          <Stat n="500+" label="Products in stock" />
          <Stat n="6 days" label="A week, on call" />
        </div>
      </section>

      <section className="container-page py-20 max-w-3xl">
        <h2 className="h-display text-2xl sm:text-4xl mb-6">What we believe</h2>
        <div className="space-y-5 text-[15.5px] text-ink-soft leading-relaxed">
          <p>
            Genuine products. Fair prices. Real follow-up after the sale. Those three
            things have stayed at the heart of {STORE.name} from the start.
          </p>
          <p>
            We work directly with brand distributors, so what reaches you is sealed,
            warrantied, and priced for the long-term — not just the one-time sale.
          </p>
          <p>
            And if anything ever feels off, we're a phone call away. That's the kind of
            shop we'd want to buy from, so it's the kind we run.
          </p>
        </div>
        <div className="mt-10">
          <Link href="/contact" className="btn-dark">Talk to us</Link>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="h-display text-5xl sm:text-6xl">{n}</p>
      <p className="mt-2 text-[13px] text-ink-mute">{label}</p>
    </div>
  );
}
