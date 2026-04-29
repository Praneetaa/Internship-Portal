# Seed Script Design — MVP Demo Data

**Date:** 2026-04-30
**Project:** Internship Portal — Backend
**Purpose:** Drop all collections and seed realistic demo data for an academic panel presentation showcasing both candidate and employer journeys end-to-end.

---

## Goals

- Drop and re-seed all 7 collections in one command: `node seed.js`
- Data is realistic enough to impress a panel (Thai context, sensible stipends, proper statuses)
- All dates are computed relative to today so the demo never looks stale
- All demo accounts share password `Demo1234!` for easy live login

---

## File Structure

```
Backend/
├── seed.js                        ← orchestrator: drop → seed in dependency order
└── seeds/
    ├── users.js                   ← 3 orgs + 5 candidates
    ├── jobs.js                    ← 12 jobs (4 per employer)
    ├── events.js                  ← 5 events (mix of types/modes)
    ├── applications.js            ← 10 applications (all 4 statuses)
    ├── savedJobs.js               ← 6 saved jobs
    ├── eventRegistrations.js      ← 4 registrations
    └── analytics.js               ← 3 docs derived from actual counts
```

---

## Runner (`seed.js`)

1. Load `MONGO_URI` from `.env` via `dotenv`
2. Connect via mongoose
3. Drop collections in reverse-dependency order
4. Insert in dependency order: users → jobs → events → applications → savedJobs → eventRegistrations → analytics
5. Each seeder receives an `idMap` (plain object of named ids) — no extra DB reads
6. Log `✓ <collection>: N inserted` per step
7. Disconnect and exit with code 0 (or 1 on error)

---

## Data

### Users (8 total)

| Name | Role | Company / Notes |
|---|---|---|
| Arisa Techworks | organization | TechCorp Bangkok |
| Manon Startup | organization | StartupHub Thailand |
| Krit Finance | organization | FinTech Solutions |
| Napat Saelim | candidate | CS student |
| Priya Mendez | candidate | Business student |
| Tanita Wong | candidate | Design student |
| Jirat Phuket | candidate | Finance student |
| Suda Chantra | candidate | Marketing student |

Password for all: `Demo1234!`

### Jobs (12 total, 4 per employer)

| Employer | Title | Category | WorkMode | Stipend (THB) |
|---|---|---|---|---|
| TechCorp | Frontend Dev Intern | Software Development | Hybrid | 12,000 |
| TechCorp | Data Analyst Intern | Data Science | Remote | 10,000 |
| TechCorp | UI/UX Design Intern | Design | On-site | 9,000 |
| TechCorp | DevOps Intern | Software Development | Remote | 11,000 |
| StartupHub | Marketing Intern | Marketing | Hybrid | 8,000 |
| StartupHub | Content Creator Intern | Marketing | Remote | 7,000 |
| StartupHub | Product Intern | Product | Hybrid | 9,500 |
| StartupHub | Business Dev Intern | Business | On-site | 8,500 |
| FinTech | Finance Intern | Finance | On-site | 13,000 |
| FinTech | Risk Analyst Intern | Finance | Hybrid | 11,000 |
| FinTech | Backend Dev Intern | Software Development | Remote | 12,500 |
| FinTech | Compliance Intern | Legal | On-site | 9,000 |

All deadlines set 30 days from today. One job per employer marked `isClosed: true` for realism.

### Applications (10 total)

Each candidate applies to 2 jobs. Status spread:
- 3 × Applied
- 3 × In Review
- 2 × Accepted
- 2 × Rejected

### Events (5 total)

| Title | Type | Mode | Date |
|---|---|---|---|
| Tech Career Fair 2026 | Career Fair | In-Person | today + 14 days |
| React Workshop | Workshop | Online | today + 7 days |
| Fintech Trends Webinar | Webinar | Online | today + 21 days |
| Alumni Networking Night | Networking | Hybrid | today + 30 days |
| Data Science Seminar | Seminar | In-Person | today - 7 days (past, isClosed: true) |

### EventRegistrations (4)
Candidates registered to the Career Fair and Workshop.

### SavedJobs (6)
Candidates each have 1–2 saved jobs.

### Analytics (3)
One doc per employer. `totalJobPosted`, `totalApplicationReceived`, `totalHire` derived from actual inserted job/application counts — no hardcoded numbers.

---

## Constraints

- ES module syntax (`import/export`) — matches the rest of the backend
- Uses `bcryptjs` (already a dependency) to hash passwords — same as the `User` model pre-save hook does not fire on `insertMany`, so passwords must be hashed manually in the seed
- No external data dependencies (no API calls, no file uploads)
- Idempotent: running `node seed.js` twice always produces a clean, identical state
