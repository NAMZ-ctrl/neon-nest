import type { FinancialAccount, Income} from "@/prisma/app/generated/prisma/client";

// action result type
export type ActionResult<T> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; data?: null };


export interface RemoveDialogProp {
  open: boolean;
  setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export interface RemoveArchiveProp {
  open: boolean;
  setArchiveOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string
}


// using omit in typescript to convert my financial account type
export type ConvertedFinancialAccount = Omit<FinancialAccount, "balance"> & {balance: number} 
export type ConvertedIncome = Omit<Income, "amount"> & {amount: number}
export type IconName =
  | "landmark"
  | "currency"
  | "wallet"
  | "trending-up"
  | "trending-down";

export interface SummaryCardData {
  title: string;
  type: "amount" | "number";
  icon: IconName;
  value: number;
  trend?: {
    value: number; // e.g. 12.5 for +12.5%
    direction: "up" | "down";
  };
}


export type Period = "7d" | "1m" | "3m" | "6m" | "1y";