import Image from "next/image";

type LeafAccentProps = {
  /** Which hero leaf asset to use */
  variant?: "left" | "right";
  /** Positioning + sizing utility classes (absolute placement within a relative section) */
  className?: string;
  /** Mirror horizontally */
  flip?: boolean;
  opacity?: number;
};

/**
 * Decorative botanical accent reusing the hero leaf cut-outs. Purely ornamental:
 * pointer-events-none and z-0 so it sits behind content. Place inside a
 * `relative overflow-hidden` section and keep the content wrapper at `z-10`.
 */
export default function LeafAccent({
  variant = "left",
  className = "",
  flip = false,
  opacity = 0.55,
}: LeafAccentProps) {
  const src = variant === "left" ? "/left%20leaf%20element.png" : "/right%20leaf%20element.png";
  const width = variant === "left" ? 814 : 705;
  const height = variant === "left" ? 1247 : 1240;

  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} style={{ opacity }} aria-hidden>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={`h-auto w-full object-contain ${flip ? "-scale-x-100" : ""}`}
        style={{ filter: "saturate(1.08)" }}
      />
    </div>
  );
}
