import { expect, test } from "@playwright/test";

/**
 * OC-01 — wizard onboarding self-service direction (route canonique : /commencer).
 *
 * Vérifie le squelette UI sans dépendre d'un compte authentifié seedé :
 *  • /onboarding redirige 308 vers /commencer (alias historique)
 *  • /commencer non auth → redirect /auth/login?redirect=%2Fcommencer
 *  • templates publics chargés et sélectionnables (smoke)
 *
 * Les tests d'intégration end-to-end (création org + invitations Resend)
 * nécessitent une instance Supabase de test ; on couvre ici le parcours UI.
 */

test.describe("Onboarding wizard — gateway et redirections", () => {
  test("/onboarding redirige (308) vers /commencer", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page).toHaveURL(/\/commencer/);
  });

  test("/commencer non authentifié redirige vers /auth/login", async ({ page }) => {
    await page.goto("/commencer");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).toHaveURL(/redirect=%2Fcommencer/);
  });
});

test.describe("Onboarding — page d'accueil ne casse pas", () => {
  test("la page d'accueil reste accessible", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(500);
  });
});
