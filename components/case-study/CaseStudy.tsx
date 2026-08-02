"use client";

import { useState } from "react";
import { useCountUp } from "./useCountUp";
import type {
  CaseStudy as CaseStudyType,
  Stat,
  Expandable,
  Phase,
  FlowStep,
  Layer,
  SprintStep,
  KPI,
} from "@/data/caseStudies";

/* ---------- small building blocks ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-number mb-6 flex items-center gap-3">
      <span className="inline-block h-px w-8 bg-accent/60" aria-hidden />
      {children}
    </p>
  );
}

function StatBlock({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.value);
  const shown =
    stat.decimals != null
      ? value.toFixed(stat.decimals)
      : Math.round(value).toLocaleString();

  return (
    <div className="group border-t border-paper/15 pt-4">
      <p className="font-display text-4xl md:text-5xl leading-none tracking-tight text-paper">
        {stat.prefix ?? ""}
        <span ref={ref}>{shown}</span>
        <span className="text-accent">{stat.suffix ?? ""}</span>
      </p>
      <p className="mt-3 text-sm text-muted leading-snug">{stat.label}</p>
    </div>
  );
}

function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="reveal grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((s, i) => (
        <StatBlock key={i} stat={s} />
      ))}
    </div>
  );
}

function ExpandList({
  items,
  openFirst = false,
}: {
  items: Expandable[];
  openFirst?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(openFirst ? 0 : null);
  return (
    <div className="reveal divide-y divide-paper/10 border-y border-paper/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-start gap-4 py-5 text-left"
            >
              <span className="mt-1 font-mono text-xs text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-display text-xl md:text-2xl text-paper group-hover:text-accent transition-colors">
                {item.title}
              </span>
              <span
                aria-hidden
                className={`mt-1 text-muted transition-transform duration-300 ease-editorial ${
                  isOpen ? "rotate-45 text-accent" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-editorial ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pl-8 pr-8 text-paper/80 leading-relaxed md:text-lg">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PhaseCards({ phases }: { phases: Phase[] }) {
  return (
    <div className="reveal grid gap-6 md:grid-cols-2">
      {phases.map((phase, i) => (
        <div
          key={i}
          className="relative rounded-sm border border-paper/10 bg-paper/[0.02] p-6 md:p-8"
        >
          <p className="section-number text-accent">{phase.label}</p>
          <h4 className="mt-2 font-display text-2xl leading-tight">{phase.title}</h4>
          <ul className="mt-5 space-y-3">
            {phase.points.map((p, j) => (
              <li key={j} className="flex gap-3 text-sm text-paper/80 leading-relaxed">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PipelineFlow({ steps }: { steps: FlowStep[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="reveal">
      <div className="flex gap-3 overflow-x-auto pb-4 md:grid md:grid-flow-col md:auto-cols-fr md:gap-0 md:overflow-visible">
        {steps.map((step, i) => (
          <div key={i} className="flex items-stretch md:contents">
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`group relative flex min-w-[9rem] flex-1 flex-col rounded-sm border p-4 text-left transition-all duration-300 ease-editorial md:min-w-0 ${
                active === i
                  ? "border-accent bg-accent/[0.06]"
                  : "border-paper/10 bg-paper/[0.02] hover:border-paper/30"
              }`}
            >
              <span
                aria-hidden
                className={`text-lg transition-colors ${
                  active === i ? "text-accent" : "text-muted"
                }`}
              >
                {step.icon ?? "◦"}
              </span>
              <span className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-paper leading-tight">
                {step.title}
              </span>
              <span className="mt-1 text-[11px] text-muted leading-tight">
                {step.sub}
              </span>
              <span className="mt-2 text-[10px] font-mono text-muted/60">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="flex items-center px-1 text-accent/50 md:px-0.5"
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function LayersDiagram({ groups }: { groups: Layer[] }) {
  return (
    <div className="reveal space-y-3">
      {groups.map((group, i) => (
        <div
          key={i}
          className="group grid gap-3 rounded-sm border border-paper/10 bg-paper/[0.02] p-5 transition-colors hover:border-accent/40 md:grid-cols-12 md:items-center"
        >
          <div className="flex items-center gap-3 md:col-span-4">
            <span className="font-mono text-xs text-accent">L{i + 1}</span>
            <span className="font-display text-lg leading-tight">{group.label}</span>
          </div>
          <ul className="flex flex-wrap gap-2 md:col-span-8">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-paper/15 bg-ink px-3 py-1 text-xs text-paper/85 transition-colors group-hover:border-paper/30"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SprintStepper({ steps }: { steps: SprintStep[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="reveal grid gap-8 md:grid-cols-12 md:gap-12">
      <ol className="md:col-span-5">
        {steps.map((step, i) => {
          const isActive = active === i;
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className="flex w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-mono transition-colors duration-300 ${
                    isActive
                      ? "border-accent bg-accent text-ink"
                      : "border-paper/25 text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col">
                  <span
                    className={`text-[11px] uppercase tracking-[0.15em] transition-colors ${
                      isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`font-display text-lg leading-tight transition-colors ${
                      isActive ? "text-paper" : "text-paper/60"
                    }`}
                  >
                    {step.title}
                  </span>
                </span>
              </button>
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[18px] top-11 h-[calc(100%-1.5rem)] w-px bg-paper/15"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="md:col-span-7 md:border-l md:border-paper/10 md:pl-12">
        <div className="sticky top-24">
          <p className="section-number text-accent">{steps[active].label}</p>
          <h4 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
            {steps[active].title}
          </h4>
          <p className="mt-5 text-paper/80 leading-relaxed md:text-lg">
            {steps[active].body}
          </p>
        </div>
      </div>
    </div>
  );
}

function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal rounded-sm border border-paper/10 bg-paper/[0.02] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-accent">
            KPI {String(index + 1).padStart(2, "0")}
          </span>
          <h4 className="mt-2 font-display text-xl md:text-2xl leading-tight">
            {kpi.metric}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="shrink-0 rounded-full border border-paper/20 px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {open ? "Hide" : "Why"}
        </button>
      </div>

      <div
        className={`grid transition-all duration-500 ease-editorial ${
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-2 text-sm text-muted leading-relaxed">{kpi.why}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-paper/10 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Goal</p>
          <p className="mt-1 text-sm text-paper/80">{kpi.goal}</p>
        </div>
        <div className="rounded-sm border border-accent/40 bg-accent/[0.06] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Result</p>
          <p className="mt-1 text-sm font-medium text-paper">{kpi.result}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- composed case study ---------- */

export default function CaseStudy({
  study,
  index,
}: {
  study: CaseStudyType;
  index: number;
}) {
  return (
    <section
      id={study.slug}
      aria-labelledby={`${study.slug}-title`}
      className="scroll-mt-24 border-t border-paper/15 pt-16 md:pt-24"
    >
      {/* header */}
      <header className="reveal grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="section-number">
            Case study {String(index + 1).padStart(2, "0")} — {study.dates}
          </p>
          <h3
            id={`${study.slug}-title`}
            className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl"
          >
            {study.company}
          </h3>
          <p className="mt-3 font-display text-xl text-accent md:text-2xl">
            {study.product}
          </p>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="text-sm text-paper/80">{study.tagline}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted">
            {study.meta}
          </p>
        </div>
      </header>

      {/* problem */}
      <div className="mt-12 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <Eyebrow>The problem</Eyebrow>
        </div>
        <p className="reveal md:col-span-9 font-display text-xl leading-[1.5] text-paper/90 md:text-2xl">
          {study.problem}
        </p>
      </div>

      {/* stats */}
      <div className="mt-16">
        <div className="mb-8">
          <Eyebrow>By the numbers</Eyebrow>
        </div>
        <StatGrid stats={study.stats} />
      </div>

      {/* pain points */}
      <div className="mt-20 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <Eyebrow>What was broken</Eyebrow>
          <p className="hidden text-sm text-muted md:block">Tap each to expand.</p>
        </div>
        <div className="md:col-span-9">
          <ExpandList items={study.painPoints} openFirst />
        </div>
      </div>

      {/* validation */}
      {study.validation ? (
        <div className="mt-20">
          <div className="mb-8">
            <Eyebrow>How I validated it</Eyebrow>
          </div>
          <PhaseCards phases={study.validation} />
        </div>
      ) : null}

      {/* flow */}
      {study.flow ? (
        <div className="mt-20">
          <div className="mb-8">
            <Eyebrow>{study.flow.title}</Eyebrow>
          </div>
          <PipelineFlow steps={study.flow.steps} />
        </div>
      ) : null}

      {/* layers */}
      {study.layers ? (
        <div className="mt-20">
          <div className="mb-8">
            <Eyebrow>{study.layers.title}</Eyebrow>
          </div>
          <LayersDiagram groups={study.layers.groups} />
        </div>
      ) : null}

      {/* capabilities */}
      {study.capabilities ? (
        <div className="mt-20 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <Eyebrow>{study.capabilities.title}</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <ExpandList items={study.capabilities.items} />
          </div>
        </div>
      ) : null}

      {/* decisions */}
      {study.decisions ? (
        <div className="mt-20 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <Eyebrow>{study.decisions.title}</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <ExpandList items={study.decisions.items} />
          </div>
        </div>
      ) : null}

      {/* sprints */}
      <div className="mt-20">
        <div className="mb-8">
          <Eyebrow>How I built it — sprint by sprint</Eyebrow>
        </div>
        <SprintStepper steps={study.sprints} />
      </div>

      {/* kpis */}
      <div className="mt-20">
        <div className="mb-8">
          <Eyebrow>Goal vs. result</Eyebrow>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {study.kpis.map((kpi, i) => (
            <KPICard key={i} kpi={kpi} index={i} />
          ))}
        </div>
      </div>

      {/* tradeoffs */}
      {study.tradeoffs ? (
        <div className="mt-20 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <Eyebrow>Tradeoffs I made</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <ExpandList items={study.tradeoffs} />
          </div>
        </div>
      ) : null}

      {/* lessons / v2 */}
      {study.lessons ? (
        <div className="mt-20 grid gap-6 md:grid-cols-12 pb-4">
          <div className="md:col-span-3">
            <Eyebrow>{study.lessons.title}</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <ExpandList items={study.lessons.items} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
