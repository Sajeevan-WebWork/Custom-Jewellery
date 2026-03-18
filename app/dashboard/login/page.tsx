"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Gem } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button, Field, Input, Panel } from "@/components/dashboard/ui";

export default function DashboardLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to sign in.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-12">
      <Panel className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)]">
            <Gem className="h-7 w-7 text-[var(--gold)]" />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl text-[var(--text)]">Admin Login</h1>
          <p className="mt-2 text-sm text-[var(--text-dim)]">Sign in to manage products, orders, and customer operations.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-dim)]">
          Initial setup only?
          <Link href="/dashboard/signup" className="ml-2 text-[var(--gold)]">
            Create admin account
          </Link>
        </p>
      </Panel>
    </div>
  );
}
