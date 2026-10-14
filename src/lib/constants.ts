import type { Address } from "viem";

// Base Sepolia testnet USDC
export const USDC_ADDRESS: Address = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
export const USDC_DECIMALS = 6;

// Wallet that receives tips — set NEXT_PUBLIC_CREATOR_ADDRESS in .env.local
export const CREATOR_ADDRESS = (process.env.NEXT_PUBLIC_CREATOR_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as Address;

export const CREATOR_NAME = "Jane Creator";
export const CREATOR_PHOTO_URL = "/creator.jpg";

export const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;
