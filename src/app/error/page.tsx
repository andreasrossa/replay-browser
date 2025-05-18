import { Suspense } from "react";
import ErrorPageContent from "./_components/error-content";

export default function ErrorPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPageContent />
      </Suspense>
    </div>
  );
}
