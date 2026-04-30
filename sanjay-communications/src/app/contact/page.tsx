import { STORE } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="container-wide py-16 sm:py-24 text-center">
        <p className="h-eyebrow mb-3">Say hello</p>
        <h1 className="h-display text-4xl sm:text-6xl">Get in touch.</h1>
        <p className="mt-5 text-ink-soft max-w-md mx-auto">
          Questions about a product, an order, or a recommendation? We're here to help.
        </p>
      </section>

      <section className="container-page pb-20">
        <div className="grid sm:grid-cols-2 gap-5">
          <Block Icon={Phone} title="Call us" body={STORE.phone} href={`tel:${STORE.phone}`} />
          <Block Icon={Mail} title="Email" body={STORE.email} href={`mailto:${STORE.email}`} />
          <Block Icon={MapPin} title="Visit" body={STORE.address} />
          <Block Icon={Clock} title="Hours" body={STORE.hours} />
        </div>

        <div className="mt-16 rounded-3xl bg-bg-subtle p-8 sm:p-12 text-center">
          <h2 className="h-display text-2xl sm:text-3xl">Walk in.</h2>
          <p className="mt-3 text-ink-soft max-w-md mx-auto">
            See and feel the products in person at our store. Trade-ins and personalised
            recommendations are always available.
          </p>
        </div>
      </section>
    </>
  );
}

function Block({
  Icon, title, body, href,
}: { Icon: any; title: string; body: string; href?: string }) {
  const Wrapper: any = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      className="rounded-3xl border border-line/70 p-7 hover:border-ink/30 transition-colors block"
    >
      <Icon size={20} className="text-accent" strokeWidth={1.6} />
      <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1 text-[14px] text-ink-soft">{body}</p>
    </Wrapper>
  );
}
