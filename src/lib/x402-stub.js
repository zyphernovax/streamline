// Stub for @x402/* peer deps of @coinbase/cdp-sdk (pulled in transitively
// through RainbowKit's Base Account wallet connector). We never install
// these optional x402/Solana packages and never call the code paths that
// use them — @coinbase/cdp-sdk lazy-loads them behind a try/catch — but
// the bundler still needs the static imports below to resolve. See
// next.config.ts.
export function x402Client() {}
export function registerExactEvmScheme() {}
export function registerExactSvmScheme() {}
export function UptoEvmScheme() {}
export function ExactSvmScheme() {}
export function toClientEvmSigner() {}
