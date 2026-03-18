"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { AlertTriangle, Gem } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button, Field, Input, Panel } from "@/components/dashboard/ui";

export default function DashboardSignupPage() {
  const { signup } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (inviteCode !== process.env.NEXT_PUBLIC_ADMIN_INVITE_CODE) {
      setError("Invite code is invalid.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to create account.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-12">
      <Panel className="w-full max-w-lg p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)]">
            <Gem className="h-7 w-7 text-[var(--gold)]" />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl text-[var(--text)]">Initial Admin Setup</h1>
        </div>

        <div className="mb-6 flex gap-3 rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>For initial setup only. Restrict this route in production.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Admin Invite Code">
            <Input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Field label="Confirm Password">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </Field>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account…" : "Create Admin Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-dim)]">
          Already configured?
          <Link href="/dashboard/login" className="ml-2 text-[var(--gold)]">
            Return to login
          </Link>
        </p>
      </Panel>
    </div>
  );
}
