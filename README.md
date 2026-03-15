# Pay Insights — WorkplaceAI Module

## Architecture
- Next.js App Router + TypeScript + Tailwind front-end.
- Deterministic salary simulation engine in `lib/calculations`.
- Config-driven tax/PT/PF constants under `lib/config`.
- Single source-of-truth `runSimulation` output consumed by UI and exports.
- PDF (`jspdf`) and Excel (`xlsx`) exports generated from output payload.

## Assumptions
- India-only payroll and tax logic, New Regime only.
- FY anchor starts on 1-Apr with DOJ annualization context note.
- Professional Tax supports Maharashtra explicitly (`₹2,500`) and extensible map.
- Variable pay excluded from recurring monthly in-hand except when monthly payout selected.

## Local run (Mac/Linux)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Local production run
```bash
npm run build
npm run start
```

## Windows on-prem usage
Root cause fixed: batch scripts now use `call` for npm commands so execution reliably returns to the parent batch flow.

- Development: double-click `dev-pay-insights.bat`.
- Production: double-click `start-pay-insights.bat`.

Both scripts:
- verify Node is available
- install dependencies if needed
- run with explicit port `3000`
- propagate failure codes for supportability

## Test
```bash
npm run test
```

## Vercel deployment
1. Push repository to Git provider.
2. Import project in Vercel.
3. Framework preset: Next.js.
4. No required env vars for V1 (optional `.env.example`).
5. Deploy.

## Key module coverage
- 14 input fields with validations.
- CTC integrity: fixed CTC includes employer PF + gratuity and is never inflated.
- Output with 5 sections + summary cards.
- PDF and Excel downloads using same computed payload.
