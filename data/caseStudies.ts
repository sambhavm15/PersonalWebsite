export type Stat = {
  prefix?: string;
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

export type Expandable = { title: string; body: string };

export type Phase = { label: string; title: string; points: string[] };

export type FlowStep = { title: string; sub: string; icon?: string };

export type Layer = { label: string; items: string[] };

export type SprintStep = { label: string; title: string; body: string };

export type KPI = {
  metric: string;
  why: string;
  goal: string;
  result: string;
};

export type CaseStudy = {
  slug: string;
  company: string;
  product: string;
  tagline: string;
  meta: string;
  dates: string;
  problem: string;
  stats: Stat[];
  painPoints: Expandable[];
  validation?: Phase[];
  flow?: { title: string; steps: FlowStep[] };
  layers?: { title: string; groups: Layer[] };
  capabilities?: { title: string; items: Expandable[] };
  decisions?: { title: string; items: Expandable[] };
  sprints: SprintStep[];
  kpis: KPI[];
  tradeoffs?: Expandable[];
  lessons?: { title: string; items: Expandable[] };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "mongodb",
    company: "MongoDB",
    product: "Central SKU Management Platform",
    tagline: "Product synopsis · FinTech & Revenue Operations",
    meta: "Technical PM Intern · Palo Alto, CA",
    dates: "Jun–Aug 2026",
    problem:
      "Every product MongoDB sells begins as a SKU — and today every SKU is assembled by hand. A committee opens a quarterly intake window by email, the form is built in Google Docs, and eight teams negotiate the language a customer signs across scattered comments and Slack threads. No shared queue, no audit trail, no way to see where a request stands. Roughly two and a half months pass before a SKU is ready for development, and the same data is then rekeyed into Salesforce, NetSuite, and Certinia through separate Jira tickets.",
    stats: [
      { value: 2.5, decimals: 1, suffix: " mo", label: "to create one new SKU" },
      { value: 8, suffix: " teams", label: "in every approval chain" },
      { prefix: "~", value: 200, suffix: "/yr", label: "SKU requests to absorb" },
      { value: 4, suffix: " objects", label: "custom data model I specified" },
      { value: 12, suffix: " steps", label: "sequenced build order" },
    ],
    painPoints: [
      {
        title: "Alignment happens in the wrong place",
        body: "Order-form language is debated in Google Docs comments and side meetings, so the debate scatters and nothing is decided of record in one centralized location.",
      },
      {
        title: "Manual chase, no accountability",
        body: "With many interdependent fields and no system of record, no one in the SKU-build stage knows whether they need to complete their part or wait on another team.",
      },
      {
        title: "Single approvers, no queue, no reuse",
        body: "One out-of-office day stalls a SKU; reviewers share no queue, and the same data is rekeyed into Salesforce and NetSuite from separate Jira tickets.",
      },
    ],
    validation: [
      {
        label: "Phase 1",
        title: "Map the process, stage by stage",
        points: [
          "Ran 7 discovery sessions across NPI, Revenue, Billing, Deal Strategy, Tax, Legal, and CPQ.",
          "Timed every stage: pre-approval 1–2 weeks, final approval 1 week, Salesforce build 2–3 weeks, NetSuite upload 1–2 weeks.",
          "Audited live forms — one carrying 50 SKUs plus 24 more in a 160-page attachment.",
        ],
      },
      {
        label: "Phase 2",
        title: "Isolate the real constraint",
        points: [
          "Sorted every pain point by time cost, not by how often it was raised.",
          "Traced rework to one source: disagreement on order-form language, settled in comment threads that leave no decision of record.",
          "Pressure-tested with the CPQ PM, who splits the process into a business half and a technical half — and puts the pain in the business half.",
        ],
      },
    ],
    capabilities: {
      title: "Six capabilities, and what runs them",
      items: [
        {
          title: "Structured intake and build",
          body: "One SKU_Build_Form record with eight team sections, rendered by the skuFormContainer LWC that shows or hides sections off SKU_Type. Per-SKU fields normalize down to line-item and pricing children, not repeated on the parent.",
        },
        {
          title: "Ownership without a free-for-all",
          body: "Org-wide default is Private. Six owner-based sharing rules grant each public group read/write on the build form, and permission-set groups layer field-level security so a team edits only its own section.",
        },
        {
          title: "Final approval — parallel and unanimous",
          body: "A metadata type maps each SKU type to its required approvers. A formula marks completion true only when the outstanding list is empty and every section is pre-approved — completion is never set by a user.",
        },
        {
          title: "Reopen without restarting",
          body: "Request Changes flips the selected section back to In Progress and re-adds only the acting approver. Approvals already recorded stay put, so the whole chain never resets.",
        },
        {
          title: "Locks and an audit trail that hold",
          body: "Section lock is enforced twice — in the LWC and again by a validation rule — so it holds through the API, Data Loader, and Flow. Status field history is the audit; a Flow posts completion to Chatter.",
        },
        {
          title: "Safe concurrency, then sync",
          body: "Approve and Request Changes both take a row lock (SELECT … FOR UPDATE) before the read-modify-write; without it two concurrent approvers deadlock. Submit-for-Sync is gated on final-approval-complete in both the LWC and a validation rule.",
        },
      ],
    },
    decisions: {
      title: "Technical architecture decisions I owned",
      items: [
        {
          title: "Lookup up, master-detail down",
          body: "Intake-to-build is a Lookup, so the two objects keep separate org-wide defaults and sharing rules. Build-form to line-item to pricing is Master-Detail, so children are controlled by parent and inherit sharing with no rules of their own.",
        },
        {
          title: "Two approval engines on purpose",
          body: "Intake is a native two-step Approval Process (NPI queue, then SSC queue) doing field updates on a read-only Status, so status is never hand-set. Final approval is custom Apex, because a native process can't send one section back and reopen it while every other approval stands.",
        },
        {
          title: "Config before code",
          body: "Build order was objects, queues and public groups, sharing rules, permission-set groups, the Approval Process, record-triggered Flows, validation rules, then LWCs last — so nothing landed in Apex that a declarative feature could do.",
        },
      ],
    },
    sprints: [
      {
        label: "Week 1–2",
        title: "Discovery and the architecture decision",
        body: "Ran the seven stakeholder sessions and published a discovery-insights memo trimmed for a VP audience. Built a cost-and-effort model comparing a Salesforce-native build, a custom React app, and a vendor tool — which settled the architecture question with BizSys and engineering.",
      },
      {
        label: "Week 3–4",
        title: "PRD and engineering requirements",
        body: "Wrote the detailed PRD, then the technical design with engineering: object model, security model, automation inventory, and build order. Specified the Salesforce object chain field by field, from GS Product Attribute through Price Book Entry, Pricing, Quote Term, and Quote Term Condition.",
      },
      {
        label: "Week 5–7",
        title: "Building and the end-system integration spec",
        body: "Shipped an interactive prototype first to settle flow and field questions before code. Specified the NetSuite kit parent-and-child structure for every SKU type — Atlas, OEM, DBaaS, EA, Search, and PS — including name derivation, GL accounts, revenue-recognition rules, and department codes.",
      },
      {
        label: "Week 8–9",
        title: "QA and User Acceptance Testing",
        body: "Built the UAT tracker with role-based scenarios covering both end systems, then ran sessions team by team. Notification routing was tested first, since it's the one piece the MVP can't ship without.",
      },
      {
        label: "Week 10",
        title: "Launch, training, and handoff",
        body: "Training for all stakeholder teams, published documentation, and a handoff package: the Edit-SKU PRD with a working prototype and a scoped deprecation flow, so the roadmap doesn't restart when I leave.",
      },
    ],
    kpis: [
      {
        metric: "SKU cycle time, request to live",
        why: "North-star lagging indicator — time to value from intake to a synced, sellable SKU, and the one number that proves coordination cost left the process.",
        goal: "~10 weeks",
        result: "4.5 weeks for MVP",
      },
      {
        metric: "Order-form alignment lead time",
        why: "The pacing item on the critical path. Alignment on the record replaces async doc threads with a single decision of record, so the same language stops relitigating.",
        goal: "2–4 weeks",
        result: "1 week",
      },
      {
        metric: "Approval first-pass yield",
        why: "Confirms front-loaded alignment is turning approval from a negotiation into a checkpoint — fewer send-back loops, higher SLA adherence.",
        goal: "single approver, frequent send-backs",
        result: "90% within SLA",
      },
      {
        metric: "Rekey elimination on end-system sync",
        why: "Duplicate entry across Salesforce and NetSuite is wasted work and a defect source. One gated sync collapses two Jira tickets and a manual workbook into a single push.",
        goal: "SFDC 2–3 wks, NS 1–2 wks, 2 tickets",
        result: "same day, zero rekey",
      },
      {
        metric: "User adoption rate (14 days)",
        why: "The platform is the single source of truth only at full capture. Activation is the share of new SKU requests originated in-platform.",
        goal: "2 requests at MVP",
        result: "10+ requests in 2 weeks of tracking",
      },
    ],
    tradeoffs: [
      {
        title: "Scope over completeness",
        body: "Held deprecation, usage-based SKUs, and guided selling out of the MVP to protect the ten-week launch — shipping value on the highest-volume path first.",
      },
      {
        title: "Simple now over clean later",
        body: "Stored approval progress in one field instead of a dedicated object — simpler to ship, but it needs careful handling when people approve at the same time.",
      },
      {
        title: "Native over custom",
        body: "Built on Salesforce rather than a custom React app or a vendor tool, trading UI flexibility for inherited identity, sharing, and audit.",
      },
    ],
    lessons: {
      title: "Key growth lessons",
      items: [
        {
          title: "Model state as records",
          body: "Track shared state in proper records, not one overloaded field. My first version worked but got fragile under concurrent edits.",
        },
        {
          title: "Access is critical path",
          body: "The slowest part was waiting on access I requested too late. I now secure environments and test data before development starts.",
        },
        {
          title: "Ship narrow, then widen",
          body: "I kept one integration minimal to protect the launch date — and that restraint is what let me deliver on time.",
        },
        {
          title: "Discover at field level",
          body: "Real requirements hid in the specific fields people use daily, not their high-level process. Asking at that depth surfaced the gaps.",
        },
      ],
    },
  },
  {
    slug: "gi-partners",
    company: "GI Partners",
    product: "AI Research Agent — RAG-Powered Deal Intelligence",
    tagline: "Retrieval-augmented deal research over $50B+ of history",
    meta: "Technical PM Intern · AI Data Infrastructure · San Francisco, CA",
    dates: "Sep–Dec 2025",
    problem:
      "GI Partners ($50B+ AUM, San Francisco) runs a portfolio spanning private equity, real estate, and data infrastructure. Deal teams managing $7.5B+ in deployable capital were using ChatGPT Enterprise for research — but the model had zero access to GI's proprietary deal history: decades of investment memos, financial models, CRM records, and LP reports sitting in the firm's Ignite database. Associates copy-pasted the same context into ChatGPT repeatedly, ran redundant research across 70+ team members, and received generic responses. A single missed comparable or overlooked risk factor in a $500M+ deal could cost millions.",
    stats: [
      { prefix: "$", value: 50, suffix: "B+", label: "historical deal data vectorized and indexed" },
      { value: 70, suffix: "+", label: "team members served by the agent" },
      { prefix: "$", value: 7.5, decimals: 1, suffix: "B+", label: "deployable capital supported" },
      { value: 30, suffix: "%", label: "research-time reduction achieved" },
      { value: 45, suffix: "%", label: "AI grounding-accuracy improvement" },
    ],
    painPoints: [
      {
        title: "Ungrounded AI responses",
        body: "ChatGPT Enterprise had no access to GI's proprietary data. Associates got generic answers about “typical PE deals” instead of responses grounded in the firm's $50B+ deal history, leading to hallucinated figures and missed comparables.",
      },
      {
        title: "Siloed and scattered data",
        body: "Deal memos lived in SharePoint, financial models in shared drives, CRM records in Salesforce, LP reports in a document-management system. No unified access layer existed — associates spent 2+ hours per deal manually searching across systems.",
      },
      {
        title: "Redundant research",
        body: "70+ professionals independently researched the same sectors, companies, and deal terms. Institutional knowledge walked out the door with departing employees because it was never captured in a searchable, AI-accessible format.",
      },
    ],
    validation: [
      {
        label: "Phase 1",
        title: "Quantitative — 15 stakeholder interviews",
        points: [
          "~2.1 hrs/deal spent on manual research before the initial investment-committee discussion.",
          "60% of associates reported copy-pasting context into ChatGPT for every new query.",
          "3–4 tools consulted per research task (SharePoint, Salesforce, shared drives, external databases).",
        ],
      },
      {
        label: "Phase 2",
        title: "Workflow analysis",
        points: [
          "Mapped the end-to-end research workflow from deal sourcing to IC memo, identifying 7 discrete retrieval bottlenecks.",
          "Benchmarked ChatGPT accuracy against ground-truth deal data: only 55% grounding accuracy without RAG context.",
          "Identified the top-5 query patterns: comparable transactions, risk-factor analysis, historical valuations, sector themes, and LP reporting.",
        ],
      },
    ],
    flow: {
      title: "The RAG pipeline, end to end",
      steps: [
        { title: "User Prompt", sub: "Natural-language query", icon: "❝" },
        { title: "Query Formulation", sub: "GPT-4o Mini", icon: "✎" },
        { title: "Hybrid Retrieval", sub: "BM25 + Vector", icon: "⚭" },
        { title: "Cross-Encoder Re-Ranking", sub: "Top-K selection", icon: "⇅" },
        { title: "LLM Grounded Generation", sub: "Azure OpenAI GPT-4", icon: "◆" },
        { title: "Output Validation", sub: "Citation + safety", icon: "✓" },
        { title: "Cited Response", sub: "With source links", icon: "❞" },
      ],
    },
    layers: {
      title: "Solution architecture — the stack behind each layer",
      groups: [
        { label: "Data layer — unified connectors", items: ["SharePoint API", "Salesforce API", "Azure Ignite", "Custom parsers"] },
        { label: "Chunking — semantic splitting", items: ["Section-aware", "Overlap: 50 tokens", "Python"] },
        { label: "Vector database — semantic index", items: ["ada-002", "1536-dim vectors", "Azure AI Search"] },
        { label: "Retrieval — hybrid search + re-ranking", items: ["BM25", "Cosine similarity", "RRF", "Cross-encoder"] },
      ],
    },
    sprints: [
      {
        label: "Sprint 1",
        title: "Data ingestion and connector architecture",
        body: "Defined P0 requirements for the data pipeline. Built connectors to SharePoint, Salesforce, and the DMS. Worked cross-functionally with Legal and IT to ensure API usage met data-governance and compliance requirements. Evaluated embedding models (ada-002 vs. Cohere embed-v3).",
      },
      {
        label: "Sprint 2",
        title: "Vector database and chunking optimization",
        body: "Built the proprietary vector database on Azure. Ran A/B tests on 3 chunking strategies using a 200-query eval set rated by senior associates. Implemented semantic chunking with custom section-aware parsers for each document type — deal memos, LP reports, models.",
      },
      {
        label: "Sprint 3",
        title: "RAG pipeline and system-prompt engineering",
        body: "Integrated hybrid retrieval (BM25 + vector) with RRF merging. Added cross-encoder re-ranking. Iterated the system prompt through 15+ versions to optimize grounding instructions, citation formatting, and PE-specific terminology. Built output validation for hallucination detection.",
      },
      {
        label: "Sprint 4",
        title: "Validation, launch, and adoption",
        body: "End-to-end evaluation against a ground-truth dataset. Presented the build-vs-buy business case to leadership (evaluated 40+ vendors incl. Hebbia, Keye). Conducted 15 stakeholder interviews to refine UX. Rolled out to 70+ team members with training, and monitored adoption for 3 weeks post-launch.",
      },
    ],
    kpis: [
      {
        metric: "Grounding accuracy (North Star)",
        why: "% of factual claims in LLM responses traceable to source documents — directly measures whether the system eliminates hallucination, the #1 risk in PE research.",
        goal: "80%+ traceable to source chunks",
        result: "90%+ (up from 55% baseline) — 45% improvement",
      },
      {
        metric: "Retrieval precision@5",
        why: "Of the top-5 retrieved chunks, how many are genuinely relevant — the quality of the hybrid-search + re-ranking pipeline.",
        goal: "75%+ precision at rank 5",
        result: "85% (vs. 60% keyword-only)",
      },
      {
        metric: "Research-time reduction",
        why: "Average hours per deal on initial research (pulling comps, reviewing memos, scanning market data) — the core ROI metric for the firm.",
        goal: "25% reduction from 2.1-hr baseline",
        result: "30% (~35–40 min saved per deal across 70+ users)",
      },
      {
        metric: "End-to-end latency",
        why: "Time from prompt submission to full cited response — must be fast enough to fit an associate's workflow without friction.",
        goal: "P50 < 5s, P95 < 10s",
        result: "P50 4.0s, P95 8.2s",
      },
      {
        metric: "User adoption (30-day)",
        why: "% of investment professionals actively using the research agent weekly — a prerequisite for all other metrics.",
        goal: "60%+ using weekly by month 1",
        result: "Adoption +15%; integrated into daily IC prep",
      },
    ],
    tradeoffs: [
      {
        title: "Semantic vs. fixed-size chunking",
        body: "Fixed-size (500 tokens) was fast but cut mid-paragraph, producing incoherent chunks. Semantic chunking needed custom parsers per document type but preserved topical coherence. Chose semantic — precision@5 improved ~15pp, justified by $500M+ deal stakes.",
      },
      {
        title: "Latency vs. quality: model selection",
        body: "GPT-4o Mini returned responses in ~1.5s but struggled with multi-document synthesis; GPT-4 Turbo produced higher-quality analysis in ~4s. Chose GPT-4 Turbo for generation, GPT-4o Mini for query formulation. P50 latency: 4s.",
      },
      {
        title: "Context-window budget: depth vs. breadth",
        body: "Stuffing 20+ chunks into a 128K context improved recall but degraded quality (the LLM “lost in the middle” problem). Chose 8–12 chunks with cross-encoder re-ranking, placing highest-relevance chunks at the start and end of context.",
      },
      {
        title: "Embedding model: ada-002 vs. Cohere embed-v3",
        body: "Cohere showed ~2% higher recall on benchmarks but required data egress outside Azure (compliance risk) and added 40ms latency per query. Chose ada-002 — Azure-native, zero data egress, compliant with GI's security posture.",
      },
      {
        title: "Why Azure OpenAI over the public API",
        body: "Data stays within GI's Azure tenant (zero egress), customer data is never used for training, SOC 2 / HIPAA-compliant, regional data residency enforced, dedicated throughput with a 99.9% SLA. No proprietary deal data ever leaves Microsoft's cloud boundary.",
      },
    ],
    lessons: {
      title: "V2 roadmap and future development",
      items: [
        {
          title: "AI Associate Agent (agentic workflows)",
          body: "Chain multi-step tasks — pull comps from the vector DB, fetch live market data via external APIs, run the financial model, draft an IC-memo section — all from a single prompt, with a parent orchestrator routing subtasks to specialized tool agents.",
        },
        {
          title: "Multi-agent orchestration",
          body: "Decompose complex queries into parallel subtasks (retrieval agent, computation agent, generation agent) for faster, more accurate responses on multi-faceted research questions.",
        },
        {
          title: "MCP integration",
          body: "Adopt the Model Context Protocol for standardized tool connections, so new data sources (Bloomberg terminal, CapIQ) can be added as MCP servers without custom integration code.",
        },
        {
          title: "Predictive deal scoring",
          body: "Train an embedding-based model on historical portfolio successes to score new deals by similarity to past winners, surfacing highest-potential opportunities automatically.",
        },
        {
          title: "Real-time ingestion",
          body: "Move from weekly batch re-indexing to event-driven ingestion — documents vectorized within minutes of upload, keeping the index always current.",
        },
      ],
    },
  },
  {
    slug: "alumni-ventures",
    company: "Alumni Ventures",
    product: "AI Startup CRM & Deal-Sourcing Platform",
    tagline: "Catching the conversations that were falling through the cracks",
    meta: "AI PM Intern · Deep Tech · Menlo Park, CA",
    dates: "Jun–Aug 2025",
    problem:
      "Alumni Ventures ($1.4B VC, Menlo Park) manages 1,600+ portfolio companies, closes ~300 deals a year, and sends 500+ emails a day. That volume created a critical problem: valuable startup conversations were falling through the cracks. A decentralized system of spreadsheets and personal inboxes made it impossible to track interactions, ensure timely follow-ups, or manage the pipeline. In my first week, my deep-tech team lost a competitive deal when a Principal missed a founder's email — by the time we were ready to commit, the startup had already closed its round.",
    stats: [
      { value: 1600, suffix: "+", label: "portfolio companies" },
      { value: 500, suffix: "+", label: "emails sent per day" },
      { value: 300, suffix: "+", label: "closed rounds per year" },
    ],
    painPoints: [
      {
        title: "Inefficient and manual sourcing",
        body: "Professionals spent hours weekly searching multiple databases with inconsistent criteria, causing duplicated effort and missed opportunities.",
      },
      {
        title: "Time-consuming data enrichment",
        body: "Critical data (e.g. last valuation) was scattered. Analysts spent valuable time manually enriching profiles instead of engaging founders.",
      },
      {
        title: "Siloed communication tracking",
        body: "All outreach and replies were trapped in individual inboxes — blocking handoffs, team-wide visibility, and a coherent experience for founders.",
      },
    ],
    validation: [
      {
        label: "Phase 1",
        title: "Quantitative problem validation",
        points: [
          "A deal-flow audit found 25% of qualified, thesis-aligned leads received no follow-up after 7 days.",
          "Average response time to inbound inquiries was over 2 business days.",
          "Pipeline leakage of nearly 15% for “interesting” companies fitting our thesis.",
          "HubSpot analysis confirmed many inbound emails received no response within a 14-day window.",
        ],
      },
      {
        label: "Phase 2",
        title: "Qualitative and workflow analysis",
        points: [
          "Interviewed 20+ investment professionals (Analysts to Partners) on sourcing methods, tool frustrations, and gaps.",
          "Tracked “Time-to-Enrichment” — the avg. hours an analyst spent on data entry per company before outreach.",
          "Measured “Time-to-First-Contact” for high-priority leads, highlighting delays in our most important deal flows.",
        ],
      },
    ],
    sprints: [
      {
        label: "Week 1",
        title: "Foundation and data aggregation",
        body: "Defined P0 requirements for the core data pipeline and automated funnel. Worked directly with Legal and Compliance to ensure data aggregation and API usage were compliant, unblocking engineering. Collaborated with the designer on initial wireframes for the “unclaimed deals” interface.",
      },
      {
        label: "Week 2",
        title: "Enrichment and AI filtering",
        body: "Prioritized the backlog, writing user stories for the AI-powered enrichment layer and scripts to populate 30+ data fields. Managed development of the enrichment feature, which called the ChatGPT and Harmonic APIs via the Airtable Data Fetcher. Led validation of the AI thesis filter against historical deal data.",
      },
      {
        label: "Week 3",
        title: "Interface and personal CRM",
        body: "Managed development of the user-facing “claim” functionality and the individual CRM dashboards. Organized and led rapid user-testing sessions with a cohort of analysts. Synthesized feedback into actionable tickets for engineering before launch.",
      },
      {
        label: "Week 4",
        title: "Testing, launch, and training",
        body: "Owned the complete go-to-market plan, including final end-to-end testing and bug-squashing. Personally built a comprehensive set of training materials — quick-start guides and video walk-throughs — and held two all-hands sessions rolling the platform out to all 60+ users.",
      },
    ],
    kpis: [
      {
        metric: "Weekly Qualified Opportunities Engaged (North Star)",
        why: "Connects the whole platform's value — not just automation but growth: thesis-aligned startups that moved from the funnel to an active conversation each week. Proves the platform is a growth engine, not just an efficiency tool.",
        goal: "40+ WQOs engaged per week by EOM",
        result: "Averaged 55 WQOs engaged per week",
      },
      {
        metric: "Reduction in manual sourcing time",
        why: "Quantifies the core value proposition of automation — eliminating low-value manual data aggregation so professionals focus on founder outreach and diligence.",
        goal: "50% reduction in avg. hours/week",
        result: "75% reduction (10 → 2.5 hrs/week)",
      },
      {
        metric: "Lead response rate (within 48 hrs)",
        why: "Direct impact on pipeline leakage. A high response rate to qualified, thesis-aligned startups is a leading indicator of deal velocity and competitiveness.",
        goal: "Increase 48-hr response from 45% to 60%",
        result: "65% (194/300 emails)",
      },
      {
        metric: "Pipeline velocity (time-to-first-meeting)",
        why: "End-to-end efficiency from initial sourcing to a scheduled first meeting — proves the system accelerates deals, not just identifies them.",
        goal: "15% reduction in sourcing-to-meeting time",
        result: "20% reduction (5 days → 4)",
      },
      {
        metric: "User adoption rate (14-day)",
        why: "The top-of-funnel metric for internal success. High adoption is a prerequisite for all other efficiency gains and validates the tool is intuitive and valuable.",
        goal: "90% of team claims ≥1 company in 2 weeks",
        result: "100% adoption within 14 days (all 14 teams)",
      },
    ],
    lessons: {
      title: "Risks and V2 development",
      items: [
        {
          title: "Deeper integration",
          body: "Integrate the CRM directly with user inboxes (Gmail/Outlook) to automatically log email conversations, reducing manual entry and creating a true single source of truth.",
        },
        {
          title: "Predictive scoring",
          body: "Enhance the AI layer to not only filter but score startups on a predictive model trained on our historical portfolio successes, bubbling the highest-potential deals to the top.",
        },
        {
          title: "Collaborative features",
          body: "Let multiple professionals “follow” a company or share notes on a single record before it's claimed, improving team-wide collaboration on promising deals.",
        },
        {
          title: "Managed risk: data hygiene",
          body: "As API sources change, the enrichment system could break or pull inaccurate data — and over-reliance on the AI filter could screen out high-quality, non-obvious deals. Both need ongoing maintenance and human-in-the-loop review.",
        },
      ],
    },
  },
];
