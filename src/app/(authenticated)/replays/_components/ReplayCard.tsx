import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { characterIds, stageIds } from "@/lib/melee-ids";
import { cn } from "@/lib/utils";
import { type Player, type ReplayDTO } from "@/server/db/schema";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { PercentageContext } from "./percentage-context";
import { StockContext } from "./stock-context";

const formatDate = (date: Date) => {
  return format(date, "dd.MM.yy HH:mm");
};

const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round((seconds % 60) * 100) / 100;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function StockDisplay({
  stocks,
  maxStocks = 4,
}: {
  stocks: number;
  maxStocks?: number;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStocks }, (_, i) => (
        <div
          key={i}
          className={`h-3 w-3 rounded-full border ${
            i < stocks
              ? "border-green-600 bg-green-500 dark:border-green-500 dark:bg-green-400"
              : "border-gray-300 bg-gray-200 dark:border-gray-500 dark:bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function PlayerCard({
  player,
  isLive,
  playerNumber,
  replayKey,
}: {
  player: Player;
  isLive: boolean;
  playerNumber: 1 | 2;
  replayKey: string;
}) {
  const { percentages } = useContext(PercentageContext);
  const { stocks } = useContext(StockContext);

  const bgColor = playerNumber === 1 ? "blue" : "red";
  return (
    <div
      className={`flex h-20 items-center justify-between rounded-lg border p-3 ${
        isLive
          ? `border-${bgColor}-200 bg-gradient-to-r from-${bgColor}-100/60 to-transparent dark:border-${bgColor}-700 dark:from-${bgColor}-900/30 dark:to-transparent`
          : `border-gray-200 bg-gradient-to-r from-${bgColor}-50 to-transparent dark:border-gray-700 dark:from-${bgColor}-950/30 dark:to-transparent`
      }`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={`/img/character/${player.characterId}/${player.skin}/stock.png`}
          alt="character icon"
          width={48}
          height={48}
          placeholder="empty"
          loading="lazy"
          className="h-12 w-12 rounded-full border-2 border-white p-1 shadow-sm dark:border-gray-700"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {player.tag ? (
              <span className="rounded border bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-800">
                #{player.tag}
              </span>
            ) : (
              <span className="text-xs italic text-gray-400 dark:text-gray-500">
                No tag ({player.characterId})
              </span>
            )}
          </div>
          <div
            className={cn(
              `mt-1 text-xs font-medium`,
              playerNumber === 1
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {characterIds[player.characterId] ?? "Unknown"}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StockDisplay
              stocks={stocks[replayKey]?.[player.characterId] ?? 4}
            />
          </div>
        </div>
      </div>
      <div className="text-right">
        <PercentageNumber
          percentage={percentages[replayKey]?.[player.characterId] ?? 0}
        />
      </div>
    </div>
  );
}

function PercentageNumber({ percentage }: { percentage: number }) {
  return (
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {Math.floor(percentage)}%
    </div>
  );
}

function VSDivider({ isLive }: { isLive: boolean }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`h-6 rounded-full px-3 py-1 text-xs font-semibold ${
          isLive
            ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
            : "bg-muted text-muted-foreground dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        VS
      </div>
    </div>
  );
}

export default function ReplayCard({ replay }: { replay: ReplayDTO }) {
  const isLive = replay.status === "live";

  return (
    <Card
      className={`mx-auto h-96 w-full max-w-md transition-all duration-200 ${
        isLive
          ? "border-green-300 bg-gradient-to-br from-green-50/80 to-white shadow-lg shadow-green-200/50 ring-2 ring-green-200 hover:shadow-xl hover:shadow-green-200/60 dark:border-green-600 dark:from-green-950/50 dark:to-gray-900 dark:shadow-green-900/30 dark:ring-green-700 dark:hover:shadow-green-900/40"
          : "border-gray-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Match {replay.key.split("-")[0]}
          </CardTitle>
          <Badge
            variant={isLive ? "default" : "secondary"}
            className={
              isLive
                ? "animate-pulse bg-green-500 text-white dark:bg-green-600"
                : "dark:bg-gray-700 dark:text-gray-300"
            }
          >
            {isLive ? (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                Live
              </div>
            ) : (
              "Completed"
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {formatDate(replay.startedAt)}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {replay.frameCount ? formatTimer(replay.frameCount / 60) : "N/A"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage Information */}
        <div
          className={`flex items-center justify-center gap-2 rounded-lg p-2 ${
            isLive
              ? "bg-green-100/50 dark:bg-green-900/30"
              : "bg-muted dark:bg-gray-800"
          }`}
        >
          <MapPinIcon className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {stageIds[replay.stageId] ?? "Unknown"}
          </span>
        </div>

        {/* Players Section */}
        <div className="space-y-3">
          <PlayerCard
            player={replay.player1}
            isLive={isLive}
            playerNumber={1}
            replayKey={replay.key}
          />
          <VSDivider isLive={isLive} />
          <PlayerCard
            player={replay.player2}
            isLive={isLive}
            playerNumber={2}
            replayKey={replay.key}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ReplayCardSkeleton() {
  return <Skeleton className="h-96 w-full" />;
}
