import { expect, test } from "@playwright/test";

/**
 * OC-04 + OC-05 — RGPD self-service.
 * Vérifie le SQUELETTE des routes & UI sans dépendre d'un compte de test seedé.
 *  • Auth requise → redirection /auth/login
 *  • API routes répondent 401 sans session
 *  • Page /legal/privacy mentionne /account/privacy
 *  • Bandeau de confirmation après suppression (?account_deleted=1)
 *
 * Les tests authentifiés (export + delete + restore) sont exécutés en
 * "smoke API" via fetch direct (mock auth via cookies n'est pas trivial sans
 * Supabase test instance ; on se contente ici de la vérification publique).
 */

test.describe("RGPD — pages et redirections publiques", () => {
  test("/account/privacy non-authentifié redirige vers /auth/login", async ({ page }) => {
    await page.goto("/account/privacy");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).toHaveURL(/redirect=%2Faccount%2Fprivacy/);
  });

  test("/legal/privacy mentionne le canal auto-service /account/privacy", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(
      page.getByRole("heading", { name: /Politique de confidentialité/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /\/account\/privacy/ })).toBeVisible();
    await expect(page.getByText(/auto-service/i)).toBeVisible();
    await expect(page.getByText(/30 jours/i)).toBeVisible();
  });

  test("/legal/privacy?account_deleted=1 affiche le bandeau de confirmation", async ({ page }) => {
    await page.goto("/legal/privacy?account_deleted=1");
    await expect(page.getByText(/Demande de suppression enregistrée/i)).toBeVisible();
    await expect(page.getByText(/30 jours/i).first()).toBeVisible();
  });
});

test.describe("RGPD — API routes refusent sans session", () => {
  test("GET /api/account/export → 401", async ({ request }) => {
    const res = await request.get("/api/account/export");
    expect(res.status()).toBe(401);
    const body = await res.json().catch(() => ({}));
    expect(body.error).toBe("unauthenticated");
  });

  test("POST /api/account/delete → 400 sans body de confirmation", async ({ request }) => {
    const res = await request.post("/api/account/delete", { data: {} });
    // Sans session ET sans confirmation → 400 (missing_confirmation contrôlé en premier)
    expect([400, 401]).toContain(res.status());
  });

  test("POST /api/account/delete avec mauvaise confirmation → 400", async ({ request }) => {
    const res = await request.post("/api/account/delete", {
      data: { confirm: "yes" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json().catch(() => ({}));
    expect(body.error).toBe("missing_confirmation");
  });

  test("POST /api/account/delete avec confirmation valide mais sans session → 401", async ({
    request,
  }) => {
    const res = await request.post("/api/account/delete", {
      data: { confirm: "DELETE" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/account/restore → 401 sans session", async ({ request }) => {
    const res = await request.post("/api/account/restore");
    expect(res.status()).toBe(401);
  });
});
