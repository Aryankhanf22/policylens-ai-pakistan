# PolicyLens AI, Pakistan Edition

PolicyLens AI is a Vite + React application for simulating economic policy changes in Pakistan. It combines Google Gemini analysis, Firebase authentication, Firestore storage, charts, and interactive dashboards to help users explore fuel price shocks, tax changes, subsidy changes, business exposure, and personal fuel spending patterns.

## What This App Does

The app is built around one main workflow:

1. A user signs in with Google.
2. The user enters the app shell and switches between different analysis tabs.
3. Policy and business scenarios are simulated with local calculation logic.
4. Gemini generates plain-language insights in Markdown.
5. Results are optionally saved to Firestore for later review.

The project is focused on Pakistan-specific policy and market conditions, so the examples, charts, and AI prompts all use fuel prices, inflation, and household impact as the central model.

## Main Features

- Google sign-in and sign-out through Firebase Auth.
- Landing page with product positioning and login entry points.
- Dashboard with baseline metrics, historical inflation charts, and recent simulation history.
- Scenario Lab for modeling petrol, diesel, high octane, tax, and subsidy changes.
- Business Hub for estimating how fuel increases affect a business's monthly costs.
- Habit Log for tracking personal fuel spending entries over time.
- Market Analytics for charts and policy trade-off views.
- AI-generated policy, business, and habit summaries using Gemini.
- Firestore persistence for simulations, business logs, and habit logs.

## How The App Works

### Authentication Flow

- The app wraps everything in `AuthProvider` from [src/hooks/useAuth.tsx](src/hooks/useAuth.tsx).
- Firebase auth state is monitored with `onAuthStateChanged`.
- If no user is signed in, the app shows [src/components/LandingPage.tsx](src/components/LandingPage.tsx).
- After login, the app renders [src/components/layout/Shell.tsx](src/components/layout/Shell.tsx) and the internal feature tabs.

### Navigation Flow

The shell keeps the following tabs available:

- Dashboard
- Scenario Lab
- Business Hub
- Habit Log
- Market Analytics

The active tab is stored in local React state inside [src/App.tsx](src/App.tsx).

### Simulation Flow

- The Scenario Lab uses local formulas from [src/services/simulation.ts](src/services/simulation.ts).
- It compares user inputs against baseline fuel prices from [src/constants.ts](src/constants.ts).
- It calculates inflation, household burden, confidence, and risk level.
- Gemini then turns those numbers into a structured Markdown report.
- The result can be saved to Firestore as a simulation record.

## Screen By Screen

### Landing Page

[src/components/LandingPage.tsx](src/components/LandingPage.tsx) is the public marketing page shown before login.

It includes:

- A top navigation bar with links to the product sections.
- A hero block explaining the platform.
- A four-step explanation of the workflow.
- Sections that describe why traditional policy analysis is limited.
- A capabilities section for scenario testing, CPI forecasting, and regional modeling.
- A footer with product and company links.

It also uses scroll-triggered animation classes from [src/components/Landing.css](src/components/Landing.css).

### Dashboard

[src/components/Dashboard.tsx](src/components/Dashboard.tsx) is the main overview screen.

It shows:

- Baseline inflation from [src/constants.ts](src/constants.ts).
- A historical inflation trend chart built with Recharts.
- A live Firestore query for the three most recent simulations created by the signed-in user.
- Quick summary cards for market exposure and household burden.

The dashboard listens to the `simulations` collection and updates in real time using `onSnapshot`.

### Scenario Lab

[src/components/ScenarioLab.tsx](src/components/ScenarioLab.tsx) is the core policy simulation tool.

Users can:

- Edit petrol, diesel, and high-octane prices.
- Adjust tax and subsidy values.
- Change the baseline market prices before running a scenario.
- Recalculate the model automatically when inputs change.
- Request AI analysis from Gemini.
- Save the final scenario to Firestore.

The screen calculates and displays:

- Estimated inflation.
- Risk level.
- Household impact in PKR.
- Confidence score.
- Fuel shock percentage.
- Sector sensitivity indicators for transport, food, agriculture, and retail.

### Business Hub

[src/components/BusinessHub.tsx](src/components/BusinessHub.tsx) focuses on business cost exposure.

It lets the user:

- Choose a business type.
- Set daily fuel usage.
- Compare old and new fuel prices.
- View monthly and annual cost impact.
- Generate AI strategy advice.

If a user is signed in, each analysis is written to Firestore in the `businessLogs` collection.

### Habit Log

[src/components/HabitLog.tsx](src/components/HabitLog.tsx) is a personal fuel expense tracker.

It supports:

- Creating fuel log entries.
- Selecting fuel type.
- Recording amount spent and estimated liters.
- Listing all saved logs for the signed-in user.
- Deleting old entries.
- Generating a Gemini summary of recent spending behavior.

Entries are stored in the `habitLogs` collection.

### Market Analytics

[src/components/Analytics.tsx](src/components/Analytics.tsx) presents static analytics views.

It includes:

- Fuel price trajectory charts.
- Inflation projection charts.
- A policy trade-off matrix.
- A confidence score panel.

This screen is mainly for presentation and comparison rather than data entry.

## Data And Logic Layer

### Local Calculation Helpers

[src/services/simulation.ts](src/services/simulation.ts) contains the core math used by the Scenario Lab.

It provides:

- `calculateInflation(...)` - computes simulated inflation from fuel, tax, and subsidy changes.
- `getRiskLevel(...)` - maps inflation to Low, Medium, High, or Severe.
- `calculateHouseholdImpact(...)` - estimates the extra household cost in PKR.
- `calculateConfidence(...)` - estimates how close the model is to historical norms.
- `calculateBusinessImpactRating(...)` - rates business exposure from fuel shock.

### Constants

[src/constants.ts](src/constants.ts) stores the values used across the app.

Important values:

- `BASE_INFLATION` - the baseline CPI assumption used by the model.
- `FUEL_BASELINE` - petrol, diesel, and high octane reference prices.
- `HISTORICAL_INFLATION_DATA` - chart data for the dashboard and analytics views.
- `INCOME_SEGMENTS` - reference groups for economic modeling.
- `APP_THEME` - shared color values.

### Types

[src/types.ts](src/types.ts) defines the Firestore document shapes used by the app.

It includes:

- `Simulation`
- `BusinessLog`
- `HabitLog`

These interfaces keep Firestore reads and writes consistent across screens.

## AI Features

The AI layer lives in [src/services/gemini.ts](src/services/gemini.ts).

It uses the `GEMINI_API_KEY` environment variable and the `@google/genai` client.

Available AI helpers:

- `getPolicyAnalysis(...)` - generates policy analysis for Scenario Lab results.
- `getBusinessAdvice(...)` - generates mitigation advice for business fuel shocks.
- `getHabitSummary(...)` - summarizes personal fuel logs and suggests savings ideas.

Each helper returns Markdown, which is rendered in the UI with `react-markdown`.

## Firebase And Firestore

The Firebase setup is in [src/services/firebase.ts](src/services/firebase.ts).

It initializes:

- Firebase app instance.
- Firestore database connection.
- Google authentication provider.

It also includes a connection test and a shared error handler for Firestore operations.

The app expects the following collections:

- `simulations`
- `businessLogs`
- `habitLogs`

Security rules are defined in [firestore.rules](firestore.rules).

## Project Structure

```text
src/
   App.tsx              # Auth gate and top-level tab routing
   constants.ts         # Shared baseline values and chart data
   index.css            # Global Tailwind setup and markdown styles
   main.tsx             # React bootstrap
   types.ts             # Shared TypeScript interfaces
   components/
      Dashboard.tsx      # Overview dashboard
      BusinessHub.tsx    # Business fuel impact analysis
      HabitLog.tsx       # Personal fuel log tracker
      ScenarioLab.tsx    # Policy simulation engine
      Analytics.tsx      # Market charts and comparisons
      LandingPage.tsx    # Public landing page
      Landing.css        # Landing-page specific styles
      layout/
         Shell.tsx        # App chrome, sidebar, and header
      ui/
         index.tsx        # Shared Card, Button, Badge, cn helper
   hooks/
      useAuth.tsx        # Firebase auth context and helpers
   services/
      firebase.ts        # Firebase initialization and helpers
      gemini.ts          # Gemini prompt wrappers
      simulation.ts      # Local scenario calculations
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Firebase Auth and Firestore
- Google Gemini via `@google/genai`
- Recharts for charts
- `motion` for animations
- `react-markdown` for rendered AI responses
- `lucide-react` for icons

## Setup

### Prerequisites

- Node.js 18 or newer
- A Firebase project
- A Gemini API key

### Install

```bash
npm install
```

### Configure Environment

Create a `.env.local` file in the project root and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The app reads this value through Vite and passes it to the Gemini client.

### Firebase Configuration

This project uses the Firebase config stored in [firebase-applet-config.json](firebase-applet-config.json).

Make sure your Firebase project has:

- Google sign-in enabled in Authentication.
- Firestore enabled.
- Security rules that match the app's data model.

### Run Locally

```bash
npm run dev
```

The Vite dev server runs on port 3000 and binds to all interfaces.

### Build

```bash
npm run build
```

### Type Check

```bash
npm run lint
```

This project uses `tsc --noEmit` for the lint script, so it is effectively a type check.

## Notes On Files In The Root

- [firebase-blueprint.json](firebase-blueprint.json) contains Firebase project metadata used by the workspace.
- [firebase-applet-config.json](firebase-applet-config.json) contains the runtime Firebase app config.
- [firestore.rules](firestore.rules) contains Firestore access rules.
- [metadata.json](metadata.json) stores project metadata for the workspace.
- [vite.config.ts](vite.config.ts) configures Vite, Tailwind, the alias, and environment injection.

## Troubleshooting

- If login does not work, confirm Google auth is enabled in Firebase.
- If AI responses fail, check that `GEMINI_API_KEY` is set and valid.
- If Firestore reads or writes fail, verify the security rules and collection names.
- If charts render empty, make sure the expected data arrays are available and the user has saved simulations.

## Summary

PolicyLens AI is a policy simulation and decision-support app built around four ideas:

- model fuel and fiscal shocks,
- understand household and business impact,
- store user history in Firestore,
- and use Gemini to turn raw numbers into readable guidance.
# policylens-ai-pakistan
