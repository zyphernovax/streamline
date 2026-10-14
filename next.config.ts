import type { NextConfig } from "next";
import path from "node:path";

// @coinbase/cdp-sdk (pulled in transitively via RainbowKit's Base Account
// wallet connector) has optional x402/Solana peer deps we don't install
// and never invoke — @coinbase/cdp-sdk guards the real usage behind a
// try/catch at runtime, but the bundler still needs these static import
// specifiers to resolve to *something* at build time. Point them at a
// local stub instead. See src/lib/x402-stub.js.
const x402StubRelative = "./src/lib/x402-stub.js";
const x402OptionalDeps = {
  "@x402/core/client": x402StubRelative,
  "@x402/evm": x402StubRelative,
  "@x402/evm/exact/client": x402StubRelative,
  "@x402/evm/upto/client": x402StubRelative,
  "@x402/svm/exact/client": x402StubRelative,
} as const;

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: x402OptionalDeps,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(
        Object.entries(x402OptionalDeps).map(([k, v]) => [
          k,
          path.resolve(__dirname, v),
        ]),
      ),
    };
    return config;
  },
};

export default nextConfig;
