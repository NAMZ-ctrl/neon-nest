"use server";

import { getUserId } from "@/libs/helpers";
import { prisma } from "@/db/db";
import { number, success } from "zod";

export async function getIncomeData() {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("User not authenticated");
  }
  try {
    const incomeData = await prisma.income.findMany({
      where: {
        userId: session?.userId,
      },
    });
    return {
      success: true,
      message: "income data fetched successfully",
      data: incomeData,
    };
  } catch (error) {
    return {
      success: false,
      message: "an error occured",
      data: null,
    };
  }
}

export async function getTotalIncome() {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("user not authenticated");
  }
  try {
    const incomeTotal = await prisma.income.aggregate({
      _sum: {
        amount: true,
      },
    });
    return {
      success: true,
      message: "total income fetched successfully",
      data: incomeTotal._sum.amount || 0,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: null,
    };
  }
}

export async function getAverageIncome() {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("user not authenticated");
  }
  console.log("did not reach here", session.userId);
  try {
    const incomeAvg = await prisma.$queryRaw<
      Array<{ count: number; average: number }>
    >`
      SELECT COUNT(*) AS count,COALESCE(AVG(income."amount"), 0) AS average FROM "Income" AS income
      WHERE income."userId" = ${session.userId};
    `;
    return {
      success: true,
      message: "average calculated successfully",
      data: incomeAvg,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: null,
    };
  }
}

export async function getMonthlyIncome() {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("user not authenticated");
  }
  try {
    const monthlyIncome = await prisma.$queryRaw<
      Array<{ month: string; total: number }>
    >`
      SELECT
  months.month AS month,
  COALESCE(SUM(income.amount), 0) AS total
FROM generate_series(
  date_trunc('month', NOW()) - INTERVAL '11 months',
  date_trunc('month', NOW()),
  INTERVAL '1 month'
) AS months(month)

LEFT JOIN "Income" AS income
  ON date_trunc('month', income."date") = months.month
  AND income."userId" = ${session.userId}

GROUP BY months.month
ORDER BY months.month DESC
LIMIT 2;

    `;
    return {
      success: true,
      message: "monthly income gotten successfully",
      data: monthlyIncome,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: null,
    };
  }
}

export async function getTopIncomeSource() {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("user not authenticated");
  }
  try {
    const topIncome = await prisma.$queryRaw<
      Array<{ name: string; percent: number }>
    >`
      SELECT fa."name" AS name, (SUM(income."amount") / (SELECT SUM(amount) FROM "Income")) AS percent FROM "Income" AS income
INNER JOIN "FinancialAccount" AS fa
ON income."accountId" = fa."id"
WHERE income."userId" = ${session.userId}
GROUP BY fa."name"
ORDER BY fa."name" DESC;
    `;
    return {
      success: true,
      message: "top income source calculated",
      data: topIncome,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: null,
    };
  }
}
