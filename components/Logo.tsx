import Image from "next/image";

type Props = { variant?: "onLight" | "onDark"; className?: string; label: string };

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/2bg-logo.png"
      alt="2BG Tech Solution"
      width={1024}
      height={576}
      className="h-12 w-32 rounded-md object-cover"
      style={{ width: `${size * 3.2}px`, height: `${size * 1.2}px` }}
      priority
    />
  );
}

export default function Logo({ className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark />
    </span>
  );
}