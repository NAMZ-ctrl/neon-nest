import { getUserId } from "@/libs/helpers";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { incomeSchema } from "@/libs/validators";
import { TagX } from "lucide-react";

export const GET = async (req: NextRequest) => {
  const session = await getUserId();
  // i have to check if the user is auntheticated
  if (!session?.userId) {
    return NextResponse.json(
      { message: "user not authenticated", data: null },
      { status: 500 },
    );
  }
  try {
    const data = await prisma.income.findMany({
      where: {
        userId: session.userId,
      },
    });
    if (!data) {
      return NextResponse.json(
        { message: "user not in database", data: null },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "income data successfull", data: data },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "an error occured", data: null },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getUserId();
  // i have to check if the user is auntheticated
  if (!session?.userId) {
    return NextResponse.json(
      { message: "user not authenticated", data: null },
      { status: 500 },
    );
  }
  try {
    const incomeRawData = await req.json();
    const incomeData = incomeSchema.safeParse(incomeRawData);
    if (!incomeData.success) {
      return NextResponse.json({ message: "invalid data" }, { status: 500 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.income.create({
        data: {
          userId: session.userId,
          source: incomeData.data.source,
          description: incomeData.data.description,
          amount: incomeData.data.amount,
          accountId: incomeData.data.accountId,
          date: incomeData.data.date,
        },
      });

      const updatedFinance = await tx.financialAccount.update({
        where: {
          id: incomeData.data.accountId,
          userId: session.userId,
        },
        data: {
          balance: {
            increment: incomeData.data.amount,
          },
        },
      });

      await tx.financialBalanceHistory.create({
        data: {
          accountId: incomeData.data.accountId,
          balance: updatedFinance.balance,
        },
      });
    });

    return NextResponse.json(
      { message: "income submitted successfullt" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "an error occured" }, { status: 500 });
  }
};
