"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerClient } from "@/lib/supabase/server";

interface PasswordResult {
  ok: boolean;
  error?: string;
}

const setupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "Au moins 12 caractères")
      .regex(/[A-Za-z]/, "Au moins une lettre")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["confirm"],
  });

export async function loginWithPassword(formData: FormData): Promise<PasswordResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/hub";

  if (!email || !password) return { ok: false, error: "Email et mot de passe requis" };

  const supabase = createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };

  // Redirect côté serveur (le cookie a été posé via Next cookies() par createServerClient)
  redirect(redirectTo);
}

export async function setupPassword(formData: FormData): Promise<PasswordResult> {
  const parsed = setupPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Mot de passe invalide" };
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Session expirée" };

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
    data: { ...(user.user_metadata ?? {}), password_set: true },
  });

  if (error) return { ok: false, error: error.message };

  redirect("/hub");
}

export async function sendMagicLink(formData: FormData): Promise<PasswordResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const redirectTo = (formData.get("redirect") as string) || "/hub";

  if (!email) return { ok: false, error: "Email requis" };

  const supabase = createServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env["NEXT_PUBLIC_APP_URL"]}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
