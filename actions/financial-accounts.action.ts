"use server";
import { prisma } from "@/db/db";
import { getUserId } from "@/libs/helpers";
import { ActionResult, ConvertedFinancialAccount, Period } from "@/libs/types";
import {  Prisma } from "@/prisma/app/generated/prisma/client";
import { convertBalanceType } from "@/libs/helpers";

import { convertDecimalToNumber } from "@/libs/api-helper";
export async function getFinancialAccountByUser(): Promise<
  ActionResult<ConvertedFinancialAccount[]>
> {
  // getting the user id with the session
  const session = await getUserId();
  if (!session?.userId) {
    return { success: false, message: "user not authenticated", data: null };
  }
  try {
    const accountData = await prisma.financialAccount.findMany({
      where: {
        userId: session?.userId,
      },
    });
    return {
      success: true,
      message: "financial account successfull",
      data: convertBalanceType(accountData) as ConvertedFinancialAccount[],
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "an error occured", data: null };
  }
}



export async function getFianancialAccountData(userId: string) {
  const weeklytotalRaw = await prisma.$queryRaw<
    Array<{ day: string; total: Prisma.Decimal }>
  >`
  SELECT date_trunc('day', fb."date") AS day, sum(fb.balance) AS total FROM "FinancialBalanceHistory" AS fb
INNER JOIN "FinancialAccount" AS fa
ON fb."accountId" = fa.id
WHERE fb."date" >= now() - interval '7 days' AND fa."userId" = ${userId}
GROUP BY date_trunc('day', fb."date")
ORDER BY date_trunc('day', fb."date") ASC;
  `;

  const monthlytotalRaw = await prisma.$queryRaw<
    Array<{ month: string; total: Prisma.Decimal }>
  >`
  SELECT date_trunc('month', fb."date") AS month, sum(fb.balance) AS total FROM "FinancialBalanceHistory" AS fb
INNER JOIN "FinancialAccount" AS fa
ON fb."accountId" = fa.id
WHERE fb."date" >= now() - interval '7 days' AND fa."userId" = ${userId}
GROUP BY date_trunc('month', fb."date")
ORDER BY date_trunc('month', fb."date") ASC;
  `;

  const accountDonutData = await prisma.$queryRaw<
    Array<{ name: string; total: Prisma.Decimal }>
  >`
  SELECT fa."name", sum(fa."balance") AS total FROM "FinancialAccount" AS fa 
  WHERE fa."userId" = ${userId}
  GROUP BY fa."name";`;

  return {
    weeklytotal: convertDecimalToNumber(weeklytotalRaw),
    monthlytotal: convertDecimalToNumber(monthlytotalRaw),
    accountDonutData: convertDecimalToNumber(accountDonutData),
  };
}
