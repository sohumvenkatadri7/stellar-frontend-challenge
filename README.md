# ☄️ LumenVault

**A Wallet With Attitude.**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Stellar-Network-08B5F7?style=for-the-badge&logo=stellar" alt="Stellar" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<br/>

LumenVault is a fearless **neo-brutalist** Web3 dashboard for the Stellar Network — thick borders, harder shadows, and frosted glass on top. Connect [Freighter](https://freighter.app/) and ship lumens in seconds.

> **Built for speed and clarity.** Every pixel is intentional. Every interaction is instant.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌐 **Network Agnostic** | Seamlessly toggle between Stellar **Mainnet** and **Testnet** with a single click. Balances and routing update instantly. |
| 🔐 **Non-Custodial** | Your keys, your crypto. Integrates securely with the Freighter browser extension — we never touch your private keys. |
| 🎨 **Neo-Brutalist UI** | High-contrast borders, sharp shadows, frosted glass panels, and smooth page transitions powered by Framer Motion. |
| ⚡ **Smart Operations** | Automatically detects whether to use a `Payment` or `CreateAccount` operation based on whether the receiving address is funded. |
| 📱 **Instant QR Codes** | Dynamically generated, high-contrast QR codes for easy mobile scanning on the Receive page. |
| 🛡️ **Client-Side Safeguards** | Built-in Stellar address validation, maximum balance calculations, and minimum base reserve protections. |
| 🚀 **Token Launchpad** | Issue your own native asset on the Stellar Testnet in seconds — complete with trustline setup and automated minting. |
| 📜 **Transaction History** | Browse recent payments with direct links to [Stellar Expert](https://stellar.expert/) for on-chain verification. |
| 🔔 **Toast Notifications** | Real-time feedback for every action via Sonner toasts — success, error, and everything in between. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, React 18) |
| **Language** | [TypeScript 5.4](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) with custom brutalist utility classes |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) (via `motion`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Blockchain** | [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk) — Core blockchain interaction |
| **Wallet** | [@creit.tech/stellar-wallets-kit](https://www.npmjs.com/package/@creit.tech/stellar-wallets-kit) — Wallet connection management |
| **QR Codes** | [react-qr-code](https://www.npmjs.com/package/react-qr-code) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (recommended)
- **Freighter Wallet** — Install the [browser extension](https://freighter.app/) and fund it via the [Stellar Laboratory](https://laboratory.stellar.org/) if using Testnet.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lumenvault.git
cd lumenvault

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
lumenvault/
├── app/
│   ├── (app)/                  # Authenticated routes
│   │   ├── dashboard/          # Balance overview & quick actions
│   │   ├── send/               # Send XLM with validation
│   │   ├── receive/            # QR code & address display
│   │   ├── history/            # Transaction history with explorer links
│   │   ├── launchpad/          # Token issuance on Testnet
│   │   └── settings/           # Account & network settings
│   ├── globals.css             # Global styles & Tailwind config
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page with connect flow
│   └── providers.tsx           # Client-side providers
├── components/
│   ├── AppSidebar.tsx          # Collapsible sidebar with nav
│   ├── NetworkBadge.tsx        # Floating network indicator
│   └── ui/                     # Reusable primitives (Button, Card, Input, etc.)
├── lib/
│   ├── stellar-helper.ts       # Singleton: Horizon server, signing, token launch
│   ├── wallet-context.tsx      # Global React Context for wallet state
│   └── utils.ts                # Formatting, validation, and helper functions
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🧠 Architecture

### Wallet Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Freighter  │────▶│  StellarWallets   │────▶│  StellarHelper   │
│   Extension  │◀────│  Kit (Modal)      │◀────│  (Singleton)     │
└─────────────┘     └──────────────────┘     └──────────────────┘
                            │                          │
                            ▼                          ▼
                    ┌──────────────┐          ┌──────────────────┐
                    │   Wallet     │          │   Horizon API    │
                    │   Context    │          │   (Testnet /     │
                    │   (React)    │          │    Mainnet)      │
                    └──────────────┘          └──────────────────┘
```

- **`lib/stellar-helper.ts`** — A singleton class that manages the Horizon server connection, transaction building, wallet signing, and token minting. It dynamically switches networks and lazily initializes the wallet kit to avoid SSR crashes.

- **`lib/wallet-context.tsx`** — A React Context that wraps the helper and exposes `connect`, `disconnect`, `toggleNetwork`, `refreshBalance`, and `launchToken` to every component. All blockchain imports are **dynamic** to prevent server-side errors.

- **`lib/utils.ts`** — Lightweight helpers for address truncation, validation (`/^G[A-Z0-9]{55}$/`), and Stellar Expert URL generation.

### SSR Safety

Stellar wallet kits rely on the browser's `window` object. To prevent Next.js from crashing during SSR, the `StellarWalletsKit` is **dynamically imported only when needed** in the client:

```typescript
// lib/wallet-context.tsx
const connect = useCallback(async () => {
  // Dynamic import — only runs in the browser
  const { stellar } = await import('@/lib/stellar-helper');
  const pk = await stellar.connectWallet();
  setPublicKey(pk);
}, []);
```

---

## 🎨 Design System

LumenVault uses a **neo-brutalist** design language with custom Tailwind utilities:

| Class | Description |
|-------|-------------|
| `.brutal` | Standard border + shadow treatment |
| `.brutal-sm` | Smaller border variant |
| `.brutal-lg` | Larger shadow emphasis |
| `.brutal-hover` | Scale + shadow interaction on hover |
| `.glass` | Frosted glass panel with backdrop blur |
| `.text-gradient` | Gradient text effect |
| `.font-display` | Display font for headings |

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero section, feature cards, FAQ, and wallet connect |
| **Dashboard** | `/dashboard` | Balance overview, network status, quick action buttons |
| **Send** | `/send` | Send XLM with address validation, memo support, max balance |
| **Receive** | `/receive` | QR code generation and address copy |
| **History** | `/history` | Recent transaction list with Stellar Expert links |
| **Launchpad** | `/launchpad` | Create custom tokens on Testnet (asset code + supply) |
| **Settings** | `/settings` | Connected address, network info, disconnect |

---
## 🤝 Screenshots
<img width="1882" height="932" alt="Screenshot 2026-06-15 233921" src="https://github.com/user-attachments/assets/19d34b1e-1318-461e-8bca-5e5fb5635cd2" />

 <center> Homepage </center>

<img width="1885" height="932" alt="Screenshot 2026-06-15 234024" src="https://github.com/user-attachments/assets/1fedec5e-af63-4ee3-a302-9c2221c193f6" />

 <center> Dashboard with account balance </center>
 <br/>

<img width="1888" height="936" alt="Screenshot 2026-06-15 234109" src="https://github.com/user-attachments/assets/cdf1a15a-3a6c-4dd2-9ee5-f8e1fcd7c096" />

 <center> Transaction successful </center>

<img width="1885" height="933" alt="Screenshot 2026-06-15 234152" src="https://github.com/user-attachments/assets/2879ca92-35af-4b01-a51f-ea6aeb401ed6" />

 <center> Transaction history fetched from wallet </center>

<img width="1898" height="931" alt="Screenshot 2026-06-15 234219" src="https://github.com/user-attachments/assets/d6056205-a621-484a-8dac-e80cc5661b61" />

 <center> Transaction screenshot from Stellar Explorer </center>
---
## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

```bash
# Fork, then:
git checkout -b feature/your-feature
npm install
npm run dev
# Make your changes, then:
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## ⚠️ Disclaimer

This project was built as a **Web3 UI/UX exploration**. Always review transaction code thoroughly before deploying Mainnet applications handling real user funds. **This is a testnet-first application** — do not use real funds unless you understand the risks.

---

## 📝 License

MIT © LumenVault

---

<p align="center">
  Built with ❤️ using <a href="https://stellar.org/">Stellar SDK</a>
</p>
