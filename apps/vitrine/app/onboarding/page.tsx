import { permanentRedirect } from "next/navigation";

/**
 * /onboarding — alias historique. Redirige (308 permanent) vers /commencer
 * qui est la route canonique en français.
 */
export const metadata = {
  title: "Créer mon organisation — Easyfest",
  robots: { index: false, follow: true },
};

export default function OnboardingAliasPage() {
  permanentRedirect("/commencer");
}
