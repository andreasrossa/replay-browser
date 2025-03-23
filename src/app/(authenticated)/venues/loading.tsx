import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReplaysLoading() {
  return (
    <Card className="mx-auto w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Venues</CardTitle>
        <CardDescription>
          Manage your venues and their settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-[250px]" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
