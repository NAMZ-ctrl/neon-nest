import { StepperComponent } from "./stepper";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="min-h-dvh bg-white px-4 pt-24">
  <div className="mx-auto w-full max-w-[420px]">
    <StepperComponent email={email ?? ""} />
  </div>
</main>
  );
}