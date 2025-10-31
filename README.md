# QuickQR — Next.js 15 + Tailwind file sharing

Send and receive any file via a simple 6‑digit code or QR. Gorgeous dark/light UI. No auth.

## Features
- Next.js 15 (App Router) + Tailwind CSS 3
- Dark/light themes with system preference
- "Send" flow shows QR and 6‑digit code (nanoid) and lets you upload multiple files
- "Receive" flow accepts code or scans QR and downloads one file or a .zip
- Ephemeral in-memory storage with 15‑minute expiry (for demo). Swap to Redis/S3 for production.

## Quick start

```bash
# Install deps
npm install

# Run dev server
npm run dev

# Build and start
npm run build
npm start
```

Open http://localhost:3000

## Notes
- In-memory storage means files are cleared on server restart and not shared across instances. For production use, store metadata in a DB/Redis and files in S3 or similar.
- QR scanning needs camera permission and may not work in all desktop browsers. Use the code input as fallback.

## Tech
- next@15, react@18, tailwindcss@3
- nanoid, react-qr-code, react-qr-reader, next-themes, jszip

## License
MIT
