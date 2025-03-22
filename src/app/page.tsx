import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">I got that shit recorded</h1>
            <h2 className="text-2xl">
                Never loose another cool combo again.
            </h2>
            <Button asChild>
                <Link href="/login">
                    Get Started
                </Link>
            </Button>
        </div>
    </main>
  );
}
