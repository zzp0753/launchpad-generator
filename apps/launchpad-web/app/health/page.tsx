import { Button } from "@packages/ui";

export default function HealthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-2xl font-bold text-gray-900">Frontend OK</h1>
      <Button variant="outline">Test Button1</Button>
    </main>
  );
}
