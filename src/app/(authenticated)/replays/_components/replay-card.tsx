import AnimatedNumber from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";
import { type ReplayDTO } from "@/server/db/schema";
import { cva } from "class-variance-authority";
import { ClockIcon, DotIcon, GamepadIcon, MountainIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CharacterBadge from "./character-badge";

const replayCardVariants = cva(
  "flex w-full justify-between rounded-lg px-4 py-4 ring-2 relative",
  {
    variants: {
      isLive: {
        true: "ring-green-500/50 bg-green-500/10",
        false: "ring-blue-500/50 bg-blue-500/10",
      },
    },
  },
);

export default function ReplayCard({ replay }: { replay: ReplayDTO }) {
  return (
    <div className={cn(replayCardVariants({ isLive: !replay.isFinished }))}>
      {!replay.isFinished && <LiveIndicator />}
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full">
          <Characters
            characters={replay.characterIds}
            liveInfo={
              !replay.isFinished
                ? [
                    { stocks: 1, percent: 78 },
                    { stocks: 3, percent: 212 },
                  ]
                : undefined
            }
          />
          <div className="ml-4 mt-1.5">
            <ReplayInfo />
          </div>
          <div className="ml-auto mr-4 mt-0.5">
            <GameTimer
              gameTime={
                replay.frameCount
                  ? Math.floor(replay.frameCount / 60)
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplayInfo() {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <MountainIcon className="h-4 w-4" /> Fountain of Dreams
      </span>
      <DotIcon className="h-4 w-4" />
      <span className="flex items-center gap-1">
        <GamepadIcon className="h-4 w-4" /> stormbreaker
      </span>
      <DotIcon className="h-4 w-4" />
      <span className="flex items-center gap-1">
        <ClockIcon className="h-4 w-4" /> 9.3.2025 - 18:33:12
      </span>
    </div>
  );
}

function LiveIndicator() {
  return (
    <div className="absolute -left-2 -top-2">
      <span className="relative flex h-4 w-4">
        <span className="absolute left-0 top-0 inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
      </span>
    </div>
  );
}

function Characters({
  characters,
  liveInfo,
}: {
  characters: number[];
  liveInfo?: { stocks: number; percent: number }[];
}) {
  return (
    <div className="flex gap-2">
      {characters.map((character, i) => (
        <div key={character} className="flex flex-col gap-2">
          <CharacterBadge key={character} character={character} team={1} />
          {liveInfo?.[i] && (
            <CharacterStats
              stocks={liveInfo[i].stocks}
              percent={liveInfo[i].percent}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CharacterStats({
  stocks,
  percent,
}: {
  stocks: number;
  percent: number;
}) {
  return (
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>
        <AnimatedNumber value={stocks} /> Stocks
      </li>
      <li>
        <AnimatedNumber value={percent} />%
      </li>
    </ul>
  );
}

function GameTimer({ gameTime }: { gameTime?: number }) {
  const [time, setTime] = useState(gameTime ?? 480);

  const [minutes, seconds] = useMemo(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return [minutes, seconds];
  }, [time]);

  useEffect(() => {
    if (gameTime) return;
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameTime]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xl italic">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
}
