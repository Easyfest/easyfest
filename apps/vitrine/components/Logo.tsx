import Image from "next/image";

/**
 * Logo Easyfest v4 fmono — composant officiel.
 *
 * Variantes :
 * - horizontal : emblème + wordmark côte-à-côte (header desktop, signatures)
 * - vertical   : emblème au-dessus du wordmark (poster, splash)
 * - mark       : emblème seul (favicon haute densité, watermark, OG fallback)
 * - mono       : version monochrome ink (impression, embossage)
 * - dark       : variante fond sombre (cream-on-ink)
 *
 * Usage :
 *   <Logo />                     // horizontal default 32px
 *   <Logo variant="mark" size={64} />
 *   <Logo variant="vertical" size={120} />
 */

export type LogoVariant = "horizontal" | "vertical" | "mark" | "mono" | "dark";

const SOURCES: Record<LogoVariant, { src: string; ratio: number }> = {
  horizontal: { src: "/brand/logos-v4-fmono/logo-horizontal.svg", ratio: 320 / 64 },
  vertical: { src: "/brand/logos-v4-fmono/logo-vertical.svg", ratio: 280 / 220 },
  mark: { src: "/brand/logos-v4-fmono/emblem.svg", ratio: 1 },
  mono: { src: "/brand/logos-v4-fmono/mono.svg", ratio: 320 / 64 },
  dark: { src: "/brand/logos-v4-fmono/logo-dark.svg", ratio: 320 / 64 },
};

const ALT = "Easyfest — Le festival pro, sans le prix pro";

interface LogoProps {
  variant?: LogoVariant;
  /** Hauteur en pixels (la largeur est dérivée du ratio de la variante). */
  size?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "horizontal",
  size = 32,
  className,
  priority = false,
}: LogoProps) {
  const { src, ratio } = SOURCES[variant];
  const width = Math.round(size * ratio);
  return (
    <Image
      src={src}
      alt={ALT}
      width={width}
      height={size}
      priority={priority}
      className={className}
      // SVG : pas besoin de quality/loading hint, Next sert le fichier tel quel
      unoptimized
    />
  );
}
