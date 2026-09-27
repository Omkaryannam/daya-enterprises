import Image from "next/image";

type LogoProps = {
  /** Tailwind classes controlling the logo height, e.g. "h-10 md:h-11" */
  heightClass?: string;
  className?: string;
  priority?: boolean;
  /**
   * "green" (default) renders the true dark-green brand artwork.
   * "white" recolors the same artwork solid white via CSS filter — use on
   * dark surfaces (e.g. the footer) where the green art loses contrast.
   */
  variant?: "green" | "white";
};

/**
 * Daya Enterprises logo (tree + wordmark).
 * The source PNG already has a transparent background and dark-green
 * artwork — rendered directly (no background badge) per brand request,
 * so the navbar can stay fully transparent. The "white" variant is the
 * same file recolored with a CSS filter (the art is a single solid
 * color, so brightness(0) invert(1) turns it pure white cleanly).
 * Source asset: /public/brand/logo-horizontal.png (1229 x 240).
 */
export default function Logo({
  heightClass = "h-10",
  className = "",
  priority = false,
  variant = "green",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/brand/logo-horizontal.png"
        alt="Daya Enterprises"
        width={1229}
        height={240}
        priority={priority}
        className={`${heightClass} w-auto transition-[height] duration-300 ${
          variant === "white"
            ? "brightness-0 invert"
            : "drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]"
        }`}
      />
    </span>
  );
}
