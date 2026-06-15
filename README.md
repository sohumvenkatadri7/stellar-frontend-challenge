☄️ LumenVault

A Wallet With Attitude. 




LumenVault is a fearless Web3 dashboard for the Stellar Network — thick borders, harder shadows, and frosted glass on top. Connect Freighter and ship lumens in seconds.

✨ Features

Network Agnostic: Seamlessly toggle between Stellar Mainnet and Testnet with a single click. Balances and network routing update instantly.

Non-Custodial: Your keys, your crypto. LumenVault integrates securely with the Freighter browser extension to sign transactions without ever touching your private keys.

Neo-Brutalist UI: Built for speed and clarity. Features high-contrast borders, sharp shadows, and smooth page transitions using Framer Motion.

Smart Operations: The backend automatically detects whether to use a Payment operation or a CreateAccount operation depending on whether the receiving address is funded.

Instant QR Codes: Dynamically generated, high-contrast QR codes for easy mobile scanning on the Receive page.

Client-Side Safeguards: Built-in address validation, maximum balance calculations, and minimum base reserve protections.

🛠️ Tech Stack

Framework: Next.js (App Router, React 18)

Styling: Tailwind CSS (Custom brutalist utility classes)

Animation: Framer Motion

Icons: Lucide React

Web3/Stellar: * @stellar/stellar-sdk (Core blockchain interaction)

@creit.tech/stellar-wallets-kit (Wallet connection management)

Utilities: react-qr-code, sonner (Toast notifications)

🚀 Getting Started

Prerequisites

Ensure you have Node.js installed (v18+ recommended).

Install the Freighter Wallet Extension in your browser and fund it via the Stellar Laboratory if using the Testnet.

Installation

Clone the repository:

git clone [https://github.com/yourusername/lumenvault.git](https://github.com/yourusername/lumenvault.git)
cd lumenvault


Install the dependencies:

npm install
# or
yarn install


Run the development server:

npm run dev
# or
yarn dev


Open http://localhost:3000 with your browser to see the result.

📁 Project Structure

/app - Next.js App Router pages (Landing, Dashboard, Send, Receive).

/components - Reusable UI elements (Sidebar, NetworkBadge, UI components).

/lib - Core logic and utilities.

wallet-context.tsx - Global React Context managing wallet state and network toggling.

stellar-helper.ts - Singleton class managing the Horizon server connection and transaction building.

utils.ts - Formatting and validation helpers.

🧠 Development Notes

Handling SSR with Wallet Kits

Stellar wallet kits rely on the browser's window object to communicate with extensions. To prevent Next.js from crashing during Server-Side Rendering (SSR), the StellarWalletsKit is dynamically initialized only when the component mounts in the client environment:

// Example from lib/stellar-helper.ts
if (typeof window !== 'undefined') {
  this.kit = new StellarWalletsKit({
    network: this.network,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
  });
}


🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

⚠ Note: This project was built as a Web3 UI/UX exploration. Always review transaction code thoroughly before deploying Mainnet applications handling real user funds.