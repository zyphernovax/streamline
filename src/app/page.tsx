"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
  CREATOR_ADDRESS,
  CREATOR_NAME,
  CREATOR_PHOTO_URL,
  USDC_ADDRESS,
  USDC_DECIMALS,
  erc20Abi,
} from "@/lib/constants";

const PRESET_AMOUNTS = ["1", "5", "10"];

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const onWrongNetwork = isConnected && chainId !== baseSepolia.id;
  const parsedAmount = Number(amount);
  const isAmountValid = amount !== "" && parsedAmount > 0;

  function handleSendTip() {
    if (!isAmountValid) return;
    writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [CREATOR_ADDRESS, parseUnits(amount, USDC_DECIMALS)],
      chainId: baseSepolia.id,
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-900">
        <Image
          src={CREATOR_PHOTO_URL}
          alt={CREATOR_NAME}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover bg-zinc-200 dark:bg-zinc-700"
        />
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {CREATOR_NAME}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Send a tip in testnet USDC on Base Sepolia
          </p>
        </div>

        <ConnectButton />

        {isConnected && (
          <div className="flex w-full flex-col gap-3">
            {onWrongNetwork && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Switch your wallet to Base Sepolia to send a tip.
              </p>
            )}

            <div className="flex gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    amount === preset
                      ? "border-foreground bg-foreground text-background"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {preset} USDC
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              Amount (USDC)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="5.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </label>

            <button
              onClick={handleSendTip}
              disabled={!isAmountValid || onWrongNetwork || isPending || isConfirming}
              className="rounded-full bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              {isPending
                ? "Confirm in wallet…"
                : isConfirming
                  ? "Sending tip…"
                  : "Send Tip"}
            </button>

            {isConfirmed && hash && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Tip sent! Thank you.{" "}
                <a
                  href={`${baseSepolia.blockExplorers.default.url}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View transaction
                </a>
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error.message}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
