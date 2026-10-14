# Streamline — Crypto Tip Jar

A single-page tip jar for a creator. Visitors connect a wallet, enter an amount, and send testnet USDC directly to the creator's wallet on **Base Sepolia**. No accounts, no custodian, no middleman.

> **Testnet only.** The app is wired to Base Sepolia and test USDC. Nothing here moves real funds.

## Features

- Wallet connect via [RainbowKit](https://www.rainbowkit.com) + [wagmi](https://wagmi.sh) (MetaMask, Rainbow, Base, WalletConnect)
- Locked to Base Sepolia, with a prompt when the wallet is on the wrong network
- Sends an ERC-20 `transfer` of USDC to a fixed creator address, with pending / confirming / success / error states

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · wagmi 2 · viem · RainbowKit · TanStack Query

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Free project ID from [cloud.reown.com](https://cloud.reown.com). Required — RainbowKit throws on startup without it. |
| `NEXT_PUBLIC_CREATOR_ADDRESS` | The `0x…` wallet address that receives tips. |

Both are `NEXT_PUBLIC_*`, so they are embedded in the browser bundle. Never put a private key or seed phrase in either.

Restart the dev server after editing `.env.local`; Next.js only reads it at startup.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Trying a tip

You need two things in the sending wallet, both on Base Sepolia:

1. **Base Sepolia ETH** for gas
2. **Testnet USDC** (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`)

Both are available from the [Coinbase developer faucet](https://portal.cdp.coinbase.com/products/faucet). Then connect, enter an amount, and click **Send Tip**. You can verify the transfer on [Base Sepolia BaseScan](https://sepolia.basescan.org).

MetaMask won't show USDC until you import the token contract address above as a custom token.

## Customizing

| What | Where |
| --- | --- |
| Creator name and photo | `CREATOR_NAME`, `CREATOR_PHOTO_URL` in [src/lib/constants.ts](src/lib/constants.ts); replace [public/creator.jpg](public/creator.jpg) |
| USDC contract / ABI | [src/lib/constants.ts](src/lib/constants.ts) |
| Chain and wallet config | [src/wagmi.ts](src/wagmi.ts) |
| Providers (wagmi, RainbowKit, React Query) | [src/app/providers.tsx](src/app/providers.tsx) |
| Tip page UI and send logic | [src/app/page.tsx](src/app/page.tsx) |

## Project structure

```
src/
  app/
    layout.tsx       Root layout, wraps the app in <Providers>
    providers.tsx    wagmi + React Query + RainbowKit providers
    page.tsx         Tip jar page
  lib/
    constants.ts     USDC address, ABI, creator info
    x402-stub.js     Build-time stub (see below)
  wagmi.ts           wagmi / RainbowKit config
```

## Notes

**x402 stub.** RainbowKit's default wallet list includes the Base Account connector, which pulls in `@coinbase/cdp-sdk`. That SDK dynamically imports optional `@x402/*` packages that aren't installed, and the bundler fails to resolve them at build time. [next.config.ts](next.config.ts) aliases those specifiers to [src/lib/x402-stub.js](src/lib/x402-stub.js). The real code paths are never called by this app.

**Going to mainnet.** This is a deliberate, separate step: swap `baseSepolia` for `base` in [src/wagmi.ts](src/wagmi.ts), [src/app/providers.tsx](src/app/providers.tsx) and [src/app/page.tsx](src/app/page.tsx), and replace `USDC_ADDRESS` with the mainnet USDC contract. Re-test with small real amounts first.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
