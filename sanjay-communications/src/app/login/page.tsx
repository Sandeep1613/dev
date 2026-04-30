"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <h1 className="h-display text-3xl sm:text-4xl text-center mb-2">
          {mode === "signin" ? "Welcome back." : "Create your account."}
        </h1>
        <p className="text-center text-ink-soft text-[14.5px]">
          {mode === "signin" ? "Sign in to continue." : "It only takes a moment."}
        </p>

        <div className="mt-8 grid grid-cols-2 bg-bg-subtle rounded-full p-1 text-[13px]">
          <button
            onClick={() => setTab("email")}
            className={`py-2 rounded-full transition-all ${
              tab === "email" ? "bg-white shadow text-ink" : "text-ink-mute"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setTab("phone")}
            className={`py-2 rounded-full transition-all ${
              tab === "phone" ? "bg-white shadow text-ink" : "text-ink-mute"
            }`}
          >
            Phone OTP
          </button>
        </div>

        <div className="mt-8">
          {tab === "email" ? (
            <EmailForm mode={mode} setMode={setMode} next={next} router={router} />
          ) : (
            <PhoneForm next={next} router={router} />
          )}
        </div>

        <p className="mt-8 text-[12px] text-ink-mute text-center leading-relaxed">
          By continuing you agree to our terms. We never share your details.
        </p>
      </div>
    </section>
  );
}

function EmailForm({
  mode, setMode, next, router,
}: { mode: "signin" | "signup"; setMode: any; next: string; router: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }
      const r = await signIn("email-password", { email, password, redirect: false });
      if (r?.error) throw new Error("Invalid email or password");
      toast.success("Signed in");
      router.push(next);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {mode === "signup" && (
        <Field label="Full name" type="text" value={name} onChange={setName} />
      )}
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field label="Password" type="password" value={password} onChange={setPassword} />
      <button disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-[13px] text-ink-mute">
        {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-accent"
        >
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
      </p>
    </form>
  );
}

function PhoneForm({ next, router }: { next: string; router: any }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!/^\+?\d{10,15}$/.test(phone)) return toast.error("Enter a valid phone");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      if (data.devCode) toast.success(`OTP (dev): ${data.devCode}`);
      else toast.success("OTP sent");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    try {
      const r = await signIn("phone-otp", { phone, otp, redirect: false });
      if (r?.error) throw new Error("Invalid OTP");
      toast.success("Signed in");
      router.push(next);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Field
        label="Phone number"
        type="tel"
        value={phone}
        onChange={setPhone}
        placeholder="+91 98765 43210"
      />
      {sent && <Field label="OTP" type="text" value={otp} onChange={setOtp} />}
      <button
        disabled={loading}
        onClick={sent ? verify : send}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Please wait…" : sent ? "Verify & sign in" : "Send OTP"}
      </button>
      {sent && (
        <button
          onClick={() => { setSent(false); setOtp(""); }}
          className="block w-full text-center text-[13px] text-ink-mute hover:text-ink"
        >
          Use a different number
        </button>
      )}
    </div>
  );
}

function Field({
  label, type, value, onChange, placeholder,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] text-ink-mute mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:border-accent text-[14.5px]"
      />
    </label>
  );
}
