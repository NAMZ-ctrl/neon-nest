"use server";

import { prisma } from "@/db/db";
import { convertDecimalToNumber } from "@/libs/api-helper";
import { getUserId } from "@/libs/helpers";
import { Prisma } from "@/prisma/app/generated/prisma/client";

export const getAllBudget = async () => {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("User not authenticated");
  }
  try {
    const budgetMonthlyTotal = await prisma.budget.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: [{ month: "desc" }, { year: "desc" }],
    });
    return {
      success: true,
      message: "all user budget gotten successfully",
      data: budgetMonthlyTotal,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: [],
    };
  }
};

export const getMonthBudget = async (budgetId: string) => {
  const session = await getUserId();
  if (!session?.userId) {
    throw new Error("User not authenticated");
  }
  try {
    const monthlyBudget = await prisma.budgetCategory.findMany({
      where: {
        budgetId: budgetId,
        budget: {
          userId: session.userId,
        },
      },
    });

    return {
      success: true,
      message: "all user budget gotten successfully",
      data: convertDecimalToNumber(monthlyBudget),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "an error occured",
      data: [],
    };
  }
};

export const getDifferenceByBudgetId = async (budgetId?: string) => {
  const session = await getUserId();

  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    const differenceTable = await prisma.$queryRaw<
      Array<{
        id: string;
        date: string;
        budget_month_amount: Prisma.Decimal;
        expense_history: Prisma.Decimal;
      }>
    >`
        WITH range AS(
  SELECT MIN(date)::date AS min, MAX(date)::date AS max
  FROM "Expense"
  WHERE "userId" = ${session.userId}
),series AS (
  SELECT generate_series(min, max, '1 day'::interval)::date AS generated_days FROM range
), expense_history AS (SELECT series.generated_days, coalesce(exp."amount", 0) as exp_amount FROM series
LEFT JOIN "Expense" exp 
ON exp.date::date = series.generated_days),
budget_coalasce AS (
 SELECT bd."id", MAKE_DATE(year, month, 1)::date as date, coalesce(SUM(bdc.amount), 0) as coalesce FROM "Budget" bd
INNER JOIN "BudgetCategory" bdc
ON bd."id" = bdc."budgetId"
WHERE bd."userId" = ${session.userId}
GROUP BY date, bd."id"
ORDER BY date DESC
)

SELECT bdc."id", to_char(bdc."date", 'Month YYYY') as date, bdc.coalesce as budget_month_amount, SUM(exh."exp_amount") FROM expense_history exh
INNER JOIN budget_coalasce bdc
ON date_trunc('month', exh.generated_days)::date = bdc."date"
GROUP BY bdc."date", bdc."coalesce", bdc."id", exh."exp_amount"
HAVING bdc."id" = ${budgetId};
      `;
      return {
        success: true,
        message: "difference table fetched successfully",
        data: differenceTable,  
      }
  } catch (error){
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
    
};
