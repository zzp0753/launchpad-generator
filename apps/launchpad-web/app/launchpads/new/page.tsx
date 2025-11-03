'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@packages/ui";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createLaunchpad } from "@/lib/launchpads";

const launchpadFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    chain: z.string().min(1, "Chain is required"),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .refine(
        (value) => !Number.isNaN(new Date(value).getTime()),
        "Invalid start time",
      ),
    endTime: z
      .string()
      .min(1, "End time is required")
      .refine(
        (value) => !Number.isNaN(new Date(value).getTime()),
        "Invalid end time",
      ),
  })
  .refine(
    (values) =>
      new Date(values.endTime).getTime() >
      new Date(values.startTime).getTime(),
    {
      path: ["endTime"],
      message: "End time must be later than start time",
    },
  );

type LaunchpadFormValues = z.infer<typeof launchpadFormSchema>;

interface ToastState {
  type: "success" | "error";
  title: string;
  description?: string;
}

export default function LaunchpadCreatePage() {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LaunchpadFormValues>({
    resolver: zodResolver(launchpadFormSchema),
    defaultValues: {
      name: "",
      chain: "EVM",
      startTime: "",
      endTime: "",
    },
  });

  async function onSubmit(values: LaunchpadFormValues) {
    try {
      await createLaunchpad({
        name: values.name,
        chain: values.chain,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      });

      setToast({
        type: "success",
        title: "Launchpad created",
        description: "You will be redirected to the list view.",
      });

      reset();

      setTimeout(() => {
        setToast(null);
      }, 3000);

      setTimeout(() => {
        router.push("/launchpads");
        router.refresh();
      }, 600);
    } catch (error) {
      console.error("Failed to create launchpad", error);
      const description =
        error instanceof Error ? error.message : "Unknown error occurred";

      setToast({
        type: "error",
        title: "Failed to create launchpad",
        description,
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Launchpads
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Create a new launchpad
            </h1>
            <p className="text-base text-slate-600">
              Provide the minimal configuration to bootstrap a launchpad in the
              control plane.
            </p>
          </div>
          <Link
            href="/launchpads"
            className={`${buttonVariants({ variant: "outline" })} inline-flex items-center justify-center`}
          >
            Back to list
          </Link>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Launchpad details
            </h2>
            <p className="text-sm text-slate-500">
              All fields are required. Times should be provided in your local
              timezone.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-6 py-8"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Launchpad name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-rose-600">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chain"
                className="text-sm font-medium text-slate-700"
              >
                Chain
              </label>
              <input
                id="chain"
                type="text"
                placeholder="EVM"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                {...register("chain")}
              />
              {errors.chain ? (
                <p className="text-sm text-rose-600">{errors.chain.message}</p>
              ) : null}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="startTime"
                  className="text-sm font-medium text-slate-700"
                >
                  Start time
                </label>
                <div className="relative">
                  <input
                    id="startTime"
                    type="datetime-local"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    {...register("startTime")}
                  />
                  <CalendarClock className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
                {errors.startTime ? (
                  <p className="text-sm text-rose-600">
                    {errors.startTime.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endTime"
                  className="text-sm font-medium text-slate-700"
                >
                  End time
                </label>
                <div className="relative">
                  <input
                    id="endTime"
                    type="datetime-local"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    {...register("endTime")}
                  />
                  <CalendarClock className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
                {errors.endTime ? (
                  <p className="text-sm text-rose-600">
                    {errors.endTime.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  "Create launchpad"
                )}
              </Button>
            </div>
          </form>
        </section>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  if (!toast) {
    return null;
  }

  const isError = toast.type === "error";

  return (
    <div className="fixed inset-x-0 top-4 flex justify-center px-4 sm:justify-end sm:px-6">
      <div
        role="status"
        className={[
          "flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition",
          isError
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700",
        ].join(" ")}
      >
        <div className="mt-0.5">
          {isError ? (
            <AlertCircle className="h-5 w-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="text-sm">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
