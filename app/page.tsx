import { ShieldCheck, Workflow, Wrench } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const foundationItems = [
  {
    title: "Secure foundation",
    description: "Security headers, environment validation, protected route middleware, and audit structure are prepared.",
    icon: ShieldCheck,
  },
  {
    title: "Feature-first structure",
    description: "Future modules are isolated under features with service, repository, and documentation boundaries.",
    icon: Workflow,
  },
  {
    title: "Development baseline",
    description: "TypeScript, Tailwind, Prisma, Supabase, Jest, Playwright, Docker, linting, and formatting are configured.",
    icon: Wrench,
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Project initialization
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Secure Dance Academy Management System
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This foundation is ready for requirements engineering and future secure
            feature development. No business workflows have been implemented.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {foundationItems.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm"
            >
              <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
