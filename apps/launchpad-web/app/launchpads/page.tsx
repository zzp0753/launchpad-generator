import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@packages/ui";
import { LaunchpadsTable } from "./launchpads-table";

export default function LaunchpadsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Launchpads
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Launchpad Configurations
            </h1>
            <p className="text-base text-slate-600">
              Review configured launchpads exposed by the control plane backend.
            </p>
          </div>
          <Link
            href="/launchpads/new"
            className={`${buttonVariants({ variant: "default" })} flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            New launchpad
          </Link>
        </header>
        <LaunchpadsTable />
      </div>
    </main>
  );
}
