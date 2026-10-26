"use server";

import { getUserId } from "@/libs/helpers";
import { prisma } from "@/db/db";

export async function getExpenseData() {
  const session = await getUserId();

  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    const expenseData = await prisma.expense.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      success: true,
      message: "Expense data fetched successfully",
      data: expenseData,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
}

export async function getTotalExpense() {
  const session = await getUserId();

  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    const expenseTotal = await prisma.expense.aggregate({
      where: {
        userId: session.userId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      success: true,
      message: "Total expense fetched successfully",
      data: expenseTotal._sum.amount || 0,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
}

export async function getAverageExpense() {
  const session = await getUserId();

  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    const expenseAvg = await prisma.$queryRaw<
      Array<{ count: number; average: number }>
    >`
      SELECT
        COUNT(*) AS count,
        COALESCE(AVG(expense."amount"), 0) AS average
      FROM "Expense" AS expense
      WHERE expense."userId" = ${session.userId};
    `;

    return {
      success: true,
      message: "Average expense calculated successfully",
      data: expenseAvg,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
}


export async function getMonthlyExpense() {
  const session = await getUserId();

  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    const monthlyExpense = await prisma.$queryRaw<
      Array<{ month: Date; total: number }>
    >`
      SELECT
        months.month AS month,
        COALESCE(SUM(expense."amount"), 0) AS total
      FROM generate_series(
        date_trunc('month', NOW()) - INTERVAL '11 months',
        date_trunc('month', NOW()),
        INTERVAL '1 month'
      ) AS months(month)

      LEFT JOIN "Expense" AS expense
        ON date_trunc('month', expense."date") = months.month
        AND expense."userId" = ${session.userId}

      GROUP BY months.month
      ORDER BY months.month DESC
      LIMIT 2;
    `;

    return {
      success: true,
      message: "Monthly expense fetched successfully",
      data: monthlyExpense,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
}
