import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const teamStyle = {
  1: "bg-purple-700 border-purple-500",
  2: "bg-blue-700 border-blue-500",
  3: "bg-green-700 border-green-500",
  4: "bg-red-700 border-red-500",
} as const;

export default function CharacterBadge({
  character,
  team,
}: {
  character: number;
  team: keyof typeof teamStyle;
}) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full border-2 ${teamStyle[team]} text-sm`}
    >
      <Image
        src={`/img/character/${character}/0/stock.png`}
        alt={`Character ${character}`}
        width={24}
        height={24}
        className="object-contain"
      />
      <span className="ml-2">Player 1</span>
    </Badge>
  );
}
