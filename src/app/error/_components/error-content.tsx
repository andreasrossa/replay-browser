"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPageContent() {
  const params = useSearchParams();

  console.log(params);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-sm text-gray-500">
        An error occurred while processing your request.
      </p>
    </div>
  );
}
