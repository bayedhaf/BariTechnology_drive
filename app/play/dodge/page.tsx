import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import DodgeGame from "@/components/games/DodgeGame";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Dodge the Blocks | 2BG Tech Solution",
  description: "Switch lanes, jump barriers and collect coins in this 3D runner.",
};

export default function DodgePage() {
  return (
    <main className={rajdhani.className}>
      <DodgeGame />
    </main>
  );
}
