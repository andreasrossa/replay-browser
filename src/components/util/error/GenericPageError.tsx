export default function GenericPageError({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      {children}
    </div>
  );
}
