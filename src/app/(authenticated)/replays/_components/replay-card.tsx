import AnimatedNumber from "@/components/ui/animated-number";
import { type ReplayDTO } from "@/server/db/schema";
import { ClockIcon, GamepadIcon, MountainIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CharacterBadge from "./character-badge";

export default function ReplayCard({ replay }: { replay: ReplayDTO }) {
  return (
    <div className="relative flex w-full justify-between rounded-lg bg-green-500/10 px-8 py-4 ring-2 ring-green-500/50">
      <div className="absolute left-2 top-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute left-0 top-0 inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-8">
          <Characters characters={replay.characterIds} />
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MountainIcon className="h-4 w-4" /> Fountain of Dreams
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <GamepadIcon className="h-4 w-4" /> stormbreaker
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4" /> 9.3.2025 - 18:33:12
            </span>
          </div>
        </div>
        <GameTimer />
      </div>
    </div>
  );
}

function Characters({ characters }: { characters: number[] }) {
  const [stocks, setStocks] = useState([4, 4]);
  const [percent, setPercent] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.floor(Math.random() * 5);
      if (chance === 0) {
        // 0 or 1
        const random = Math.floor(Math.random() * 2);
        setPercent((prev) => {
          const newPercent = [...prev];
          newPercent[random] = 0;
          return newPercent;
        });
        setStocks((prev) => {
          const newStocks = [...prev];
          newStocks[random] = prev[random]! - 1;
          return newStocks;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 2);
      setPercent((prev) => {
        const newPercent = [...prev];
        newPercent[random] = prev[random]! + Math.floor(Math.random() * 30);
        return newPercent;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (characters.length !== 2) return "?";

  const character1 = characters[0]!;
  const character2 = characters[1]!;

  return (
    <div className="flex gap-2">
      <CharacterWithStats
        character={character1}
        stocks={stocks[0]!}
        percent={percent[0]!}
      />
      <span className="mt-1 text-sm italic text-muted-foreground">vs.</span>
      <CharacterWithStats
        character={character2}
        stocks={stocks[1]!}
        percent={percent[1]!}
      />
    </div>
  );
}

function CharacterWithStats({
  character,
  stocks,
  percent,
}: {
  character: number;
  stocks: number;
  percent: number;
}) {
  const team = useMemo(() => {
    return Math.floor(Math.random() * 4) + 1;
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <CharacterBadge team={team as 1 | 2 | 3 | 4} character={character} />
      <ul className="ml-4 list-disc text-sm text-muted-foreground">
        <li>
          <AnimatedNumber value={stocks} /> Stocks
        </li>
        <li>
          <AnimatedNumber value={percent} />%
        </li>
      </ul>
    </div>
  );
}

function GameTimer() {
  const [time, setTime] = useState(480);

  const [minutes, seconds] = useMemo(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return [minutes, seconds];
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xl italic">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
}
