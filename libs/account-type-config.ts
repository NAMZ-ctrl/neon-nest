// lib/account-type-config.ts
import { AccountType } from "@/prisma/app/generated/prisma/client";

export const accountTypeConfig: Record<
  AccountType,
  { label: string; icon: string; bg: string; text: string }
> = {
  BANK: {
    label: "Bank accounts",
    icon: "ti-building-bank",
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
  },
  WALLET: {
    label: "Wallets",
    icon: "ti-wallet",
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
  },
  CASH: {
    label: "Cash",
    icon: "ti-cash",
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-600 dark:text-amber-400",
  },
  OTHER: {
    label: "Other",
    icon: "ti-dots",
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
  },
};