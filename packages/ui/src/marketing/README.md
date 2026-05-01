# 🎨 Easyfest UI — Marketing sections

> 8 composants modulaires pour la landing page, /pricing, cas client.
> Tous basés sur la palette earth-tones brand (corail, ink, cream, ambre).

## Import

```tsx
import {
  HeroSection,
  FeatureGrid,
  PricingTable,
  TestimonialPam,
  FAQSection,
  TrustSignals,
  CTASection,
  ProblemSolution,
  DEFAULT_PLANS,
  DEFAULT_FAQ,
} from "@easyfest/ui";
```

## Exemple de landing complète (`apps/vitrine/app/page.tsx`)

```tsx
import {
  HeroSection,
  ProblemSolution,
  FeatureGrid,
  TrustSignals,
  TestimonialPam,
  PricingTable,
  FAQSection,
  CTASection,
} from "@easyfest/ui";

export default function HomePage() {
  return (
    <main>
      <HeroSection
        badge="● BETA · LIVE"
        title={<>Le festival pro,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-coral to-brand-amber">sans le prix pro.</span></>}
        subtitle="Easyfest remplace ton tableau Excel partagé, ton WhatsApp et ton outil d'inscription par une seule app pensée pour les organisateurs de festivals associatifs."
        primaryCta={{ label: "Commencer gratuitement", href: "/commencer" }}
        secondaryCta={{ label: "Voir une démo", href: "#demo" }}
        trustLine="Données EU · DPA Supabase signé · 100% RGPD"
      />

      <TrustSignals
        metrics={[
          { value: "82", label: "bénévoles gérés" },
          { value: "100%", label: "RGPD-compliant" },
          { value: "EU", label: "données hébergées" },
          { value: "30s", label: "pour signer une convention" },
        ]}
        partners={["ZIK en PACA", "Mairie de Montauroux", "Brasserie de la Côte"]}
      />

      <ProblemSolution
        problemTitle="Aujourd'hui, organiser un festival, c'est..."
        problems={[
          { emoji: "📊", text: "Un Excel partagé qui se casse à chaque modif" },
          { emoji: "💬", text: "5 groupes WhatsApp qui se contredisent" },
          { emoji: "📂", text: "Un Drive avec 14 versions du planning" },
          { emoji: "📧", text: "Des inscriptions qui se perdent dans les mails" },
        ]}
        solutionTitle="Avec Easyfest, c'est..."
        solutions={[
          { emoji: "🎟️", text: "Un dashboard unique pour tes bénévoles" },
          { emoji: "📱", text: "Une app que chaque rôle utilise (régie, scan, équipe)" },
          { emoji: "✓", text: "1 source de vérité, 0 conflits, RGPD-clean" },
          { emoji: "📦", text: "Pack préfecture en 1 clic, plus 3 jours de paperasse" },
        ]}
      />

      <FeatureGrid
        badge="POUR LES ORGANISATEURS"
        title="Tout ce dont tu as besoin, rien de superflu"
        features={[
          {
            emoji: "📋",
            title: "Bénévoles centralisés",
            body: "Tu sais qui vient, qui ne vient pas, en 1 coup d'œil. Plus de Doodle qui se perd dans les mails.",
          },
          {
            emoji: "📜",
            title: "Convention signable en 30 secondes",
            body: "Tes bénévoles signent leur convention électroniquement avec horodatage et IP. Trace juridique conforme.",
            highlight: true,
          },
          {
            emoji: "🎯",
            title: "Drag & drop des équipes",
            body: "Tu glisses tes bénévoles entre Bar, Catering, Loge. Les souhaits de chacun apparaissent sur la carte.",
          },
          {
            emoji: "🤝",
            title: "Sponsors trackés",
            body: "CRM partenaires : statut contrat, montant, contreparties. Plus besoin d'un Notion en plus.",
          },
          {
            emoji: "📦",
            title: "Pack préfecture en 1 clic",
            body: "ZIP avec liste bénévoles, conventions, sponsors. Tu joins à ta déclaration manifestation, c'est plié.",
          },
          {
            emoji: "🚨",
            title: "Safer space intégré",
            body: "Bouton alerte anonyme, signalements modérés, bans si besoin. Tes bénévoles sont en sécurité.",
          },
        ]}
      />

      <TestimonialPam
        authorName="Pamela Giordanengo"
        authorRole="Présidente"
        authorOrg="ZIK en PACA · Roots du Lac"
        quote="On gérait nos 51 bénévoles avec un Excel et 3 WhatsApp. Easyfest a remplacé ça en 30 minutes. Le moment où mes bénévoles ont signé leur convention en 1 clic, j'ai compris."
        stats={[
          { before: "5h", after: "30 min", label: "pour gérer les inscriptions" },
          { before: "3 outils", after: "1 outil", label: "pour tout coordonner" },
          { before: "0%", after: "100%", label: "conventions signées tracées" },
        ]}
      />

      <PricingTable />

      <FAQSection items={DEFAULT_FAQ} />

      <CTASection
        title="Prêt·e à organiser ton festival sans stresser ?"
        subtitle="Compte gratuit en 30 secondes. Aucune carte bleue requise."
        primaryCta={{ label: "Commencer maintenant", href: "/commencer" }}
        secondaryCta={{ label: "Réserver une démo", href: "/demo" }}
      />
    </main>
  );
}
```

## Composants disponibles

| Composant | Rôle | Position type | Hauteur |
|---|---|---|---|
| `<HeroSection>` | Above the fold | Top | ~80vh |
| `<TrustSignals>` | Social proof + metrics | 2e | ~30vh |
| `<ProblemSolution>` | Avant/après | 3e | ~70vh |
| `<FeatureGrid>` | Bénéfices clés | 4e | ~80vh |
| `<TestimonialPam>` | Cas client | 5e | ~70vh |
| `<PricingTable>` | 4 paliers | 6e | ~80vh |
| `<FAQSection>` | 8 questions | 7e | ~70vh |
| `<CTASection>` | Convert final | 8e | ~50vh |

## Conventions

- Tous les composants acceptent `className` pour overrides custom
- Les CTAs prennent `{ label, href }` typés
- Palette : `bg-brand-cream`, `text-brand-coral`, `text-brand-ink`, `bg-brand-amber/X`
- Responsive : mobile-first, breakpoints `md:` et `lg:`
- A11y : titre H1 unique dans Hero, H2 dans chaque section, semantic HTML

## Performance attendue

- LCP < 2.5s (Hero pas de JS bloquant)
- CLS < 0.05 (tailles fixes sur images, fontes)
- FCP < 1.8s (CSS critique inline via Tailwind)
