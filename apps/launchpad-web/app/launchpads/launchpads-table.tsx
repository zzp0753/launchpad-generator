'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { fetchLaunchpads, LaunchpadDto } from "@/lib/launchpads";

type RequestState = "idle" | "loading" | "success" | "error";

export function LaunchpadsTable() {
  const [launchpads, setLaunchpads] = useState<LaunchpadDto[]>([]);
  const [state, setState] = useState<RequestState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLaunchpads() {
      setState("loading");
      setErrorMessage(null);

      try {
        const data = await fetchLaunchpads();
        if (!isMounted) {
          return;
        }

        setLaunchpads(data);
        setState("success");
      } catch (error) {
        console.error("Failed to load launchpads", error);
        if (!isMounted) {
          return;
        }

        setState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      }
    }

    loadLaunchpads();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasLaunchpads = launchpads.length > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Launchpads overview
          </h2>
          <p className="text-sm text-slate-500">
            Data originates from /api/v1/launchpads endpoint.
          </p>
        </div>
      </header>

      <div className="px-6 py-4">
        {state === "loading" ? (
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading launchpads…</span>
          </div>
        ) : state === "error" ? (
          <div className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">Failed to fetch launchpads.</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        ) : hasLaunchpads ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {launchpads.map((launchpad) => (
                <TableRow
                  key={launchpad.id}
                  className="hover:bg-slate-50/80"
                >
                  <TableCell className="font-medium text-slate-900">
                    {launchpad.name}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {launchpad.chain}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(launchpad.startTime)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(launchpad.endTime)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-dashed border-slate-200 p-6 text-slate-500">
            <Inbox className="h-5 w-5" />
            <div>
              <p className="font-semibold text-slate-600">
                No launchpads available yet.
              </p>
              <p className="text-sm">
                Create a launchpad via the control plane to see it listed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}
