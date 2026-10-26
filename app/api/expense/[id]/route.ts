import { getUserId } from "@/libs/helpers";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/db/db";

export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) => {
  const session = await getUserId();

  if (!session?.userId) {
    return NextResponse.json(
      {
        message: "User not authenticated",
        data: null,
      },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const deletedExpense = await tx.expense.delete({
        where: {
          id,
          userId: session.userId,
        },
      });

      const updatedFinance = await tx.financialAccount.update({
        where: {
          id: deletedExpense.accountId,
          userId: session.userId,
        },

        data: {
          balance: {
            increment: deletedExpense.amount,
          },
        },
      });

      await tx.financialBalanceHistory.create({
        data: {
          accountId: deletedExpense.accountId,

          balance: updatedFinance.balance,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Expense deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "An error occurred while deleting expense",
        data: null,
      },
      { status: 500 },
    );
  }
};
