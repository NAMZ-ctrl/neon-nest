import { prisma } from "@/db/db";
import {
  AccountType,
  FinancialAccount,
  FinancialBalanceHistory,
  Income,
} from "@/prisma/app/generated/prisma/client";
import { ConvertedFinancialAccount } from "./types";
import { auth } from "@/auth";
import { ErrorResponse } from "resend";
import { number } from "zod";

// i used this in the session callbacks
export const fetchUserWithEmail = async (email: string) => {
  const data = await prisma.user.findUnique({
    where: { email: email },
  });
  return data?.id!;
};

// using this function to get authentication
export const getUserId = async () => {
  const session = await auth();
  if (!session?.userId) {
    return null;
  }
  return session;
};

// changing the shape of the financial account data
export const updatedFinancialAccountData = (
  data: ConvertedFinancialAccount[],
) => {
  return data.map((account) => ({
    accountNumber: account.accountNumber ?? undefined,
    name: account.name,
    type: account.type,
    balance: Number(account.balance),
    isActive: account.isActive,
  }));
};

const isFinancialAccount = (
  account: FinancialAccount | Income,
): account is FinancialAccount => {
  return Object.hasOwn(account as FinancialAccount, "balance");
};

// convert each balance from decimal to number
export const convertBalanceType = (accounts: FinancialAccount[] | Income[]) => {
  const convertedAccount = accounts.map((each) => {
    if (isFinancialAccount(each)) {
      return {
        ...each,
        balance: each.balance.toNumber(),
      };
    }
    return {
      ...each,
      amount: each.amount.toNumber(),
    };
  });
  return convertedAccount;
};

// calculate the trend
export const calculateMonthlyTrend = (
  monthlyData: {
    month: string;
    total: number;
  }[],
) => {
  const currentMonth = monthlyData[0];
  const lastMonth = monthlyData[1];

  if (!currentMonth || !lastMonth) return 0;

  if (lastMonth.total === 0) {
    return currentMonth.total > 0 ? 100 : 0;
  }

  const difference = currentMonth.total - lastMonth.total;

  return (difference / lastMonth.total) * 100;
};

// calculate expense and budeget percentage
export const calculateMonthlyDifference = (budget: number, expense: number) => {
  if (!budget || !expense) {
    return 0;
  }

  const difference = budget - expense;

  const percentage = difference / budget;

  return percentage * 100;
};
