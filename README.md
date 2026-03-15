# Pay Insights — WorkplaceAI Module

## Architecture
- Next.js App Router + TypeScript + Tailwind front-end.
- Deterministic salary simulation engine in `lib/calculations`.
- Config-driven tax/PT/PF constants under `lib/config`.
- Single source-of-truth `runSimulation` output consumed by UI and exports.
- PDF (`jspdf`) and Excel (`xlsx`) exports generated from the same computed payload.

## Runtime hardening notes
- `package.json` includes explicit Windows dev/prod scripts and fixed port behavior (`3000`).
- Batch files use `call`, check Node in PATH, and propagate error codes.
- This reduces common on-prem script failure modes where `npm.cmd` exits batch flow unexpectedly.

## Precision and formatting policy
- Calculations: 2-decimal precision in engine (`keepTwo` usage in simulation and tax path).
- Display: rounded INR (0 decimals) using `formatInrDisplay` for UI and PDF/Excel string outputs.
- Negative values (rebate/marginal relief) are displayed with a clear sign and INR format.

## Dependency and environment notes
- This is a standard Next.js app with browser-side PDF/Excel generation.
- No DB or external runtime service is required in V1.
- If install fails in restricted networks, configure npm registry/proxy access for Node + npm first.

## Local run (Mac/Linux)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Local production run (Mac/Linux)
```bash
npm run build
npm run start
```

## Windows on-prem usage
1. Install Node.js 20+ and ensure `node` + `npm` are available in PATH.
2. Open project folder.
3. Development mode: run `dev-pay-insights.bat`.
4. Production mode: run `start-pay-insights.bat`.

Both scripts:
- verify Node is available
- install dependencies if missing
- use explicit port `3000`
- return failure codes for supportability

## Test
```bash
npm run test
```

## Vercel deployment
1. Push repository to Git provider.
2. Import project in Vercel.
3. Framework preset: Next.js.
4. Keep Node 20+ in project settings.
5. No required env vars for V1 (`.env.example` is optional metadata only).
6. Deploy.

## Key module coverage
- 14 input fields with validations.
- CTC integrity: fixed CTC includes employer PF + gratuity and is never inflated.
- Output with 5 sections + summary cards.
- PDF and Excel downloads using same computed payload.
