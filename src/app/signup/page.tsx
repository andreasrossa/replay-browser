import SignUpCard from "./_components/signup-card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpCard />
      </div>
    </div>
  );
}
