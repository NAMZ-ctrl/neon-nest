"use server";

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
      { message: "user not authenticated", data: null },
      { status: 500 },
    );
  }
  try {
    const { id } = await params;
    await prisma.$transaction(async (tx) => {
      const deletedIncome = await tx.income.delete({
        where: {
          userId: session.userId,
          id: id,
        },
      });

      await tx.financialAccount.update({
        where: {
          id: deletedIncome.accountId,
          userId: session.userId,
        },
        data: {
          balance: {
            decrement: deletedIncome.amount,
          },
        },
      });
    });

    return NextResponse.json({message: "income deleted successfully"}, {status: 200})
  } catch (error) {
    return NextResponse.json(
      { message: "an error occured", data: null },
      { status: 500 },
    );
  }
};
