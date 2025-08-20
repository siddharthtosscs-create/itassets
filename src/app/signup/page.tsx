"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Signup failed");
      setMsg("✅ " + data.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Create an account</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}


