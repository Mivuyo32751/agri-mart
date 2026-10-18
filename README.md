# Agri-Mart

A mobile-first Next.js starting point for farmer crop tracking and enterprise supply visibility.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## First slice

- Farmer home with a weather-style header, daily tasks, field cards, growth progress, expected harvest windows, and sale-ready quantities.
- Add-crop form and interactive growth update actions.
- Enterprise view with forecast and confirmed stock summaries, supplier visibility, and a crop availability list.
- Responsive layouts for desktop and phone screens.

The crop data is sample data held in page state. Farmer updates appear in the enterprise view during the current session, but reloads clear them and the data is not shared across real user accounts. Sign-in, durable records, verified quality workflows, live weather, and multi-farm aggregation need a backend.
# Agri-Mart local MVP setup

Farmer and enterprise accounts register independently from `/login/farmer` and `/login/enterprise`. Account data, crop records, supplier enquiries, and subscription requests are stored by the Next.js server in the ignored `.data/agri-mart.json` file. Passwords are stored as salted scrypt hashes; browser sessions use HTTP-only cookies.

## Administrator access

Set these values in a local `.env.local` file before starting the development server. Use a unique password of at least 16 characters and keep this file private:

```env
AGRI_ADMIN_EMAIL=admin@example.com
AGRI_ADMIN_PASSWORD=replace-with-a-long-random-secret
```

Open `/admin` and sign in with those credentials. The first successful admin login creates the administrator account. Admins can disable accounts, hide farmer listings, activate enterprise tiers, and review enquiries and listing reports.

This JSON-backed store is intended for local development and a single server process. It is not a production database: multiple server instances, production-grade backup, rate limiting, email verification/password recovery, and payment processing need to be added before public deployment. Enterprise Insights and Network analytics require an admin to activate the account's subscription. Farmer crop changes are saved on the server and the enterprise listing view refreshes every 15 seconds.
