import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/libs/helpers";
import { prisma } from "@/db/db";
import { expenseSchema } from "@/libs/validators";

export const GET = async () => {
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
    const data = await prisma.expense.findMany({
      where: {
        userId: session.userId,
      },

      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Expense data fetched successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: "An error occurred",
        data: null,
      },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getUserId();

  // check if the user is authenticated
  if (!session?.userId) {
    return NextResponse.json(
      {
        message: "user not authenticated",
        data: null,
      },
      { status: 500 },
    );
  }

  try {
    const expenseRawData = await req.json();

    const expenseData =
      expenseSchema.safeParse(expenseRawData);

    if (!expenseData.success) {
      return NextResponse.json(
        { message: "invalid data" },
        { status: 500 },
      );
    }
    console.log(expenseData)
    await prisma.$transaction(async (tx) => {
      // create expense
      await tx.expense.create({
        data: {
          userId: session.userId,
          category: expenseData.data.category,
          description:
            expenseData.data.description,
          amount: expenseData.data.amount,
          accountId:
            expenseData.data.accountId,
          date: expenseData.data.date,
        },
      });

      // subtract expense from account balance
      const updatedFinance =
        await tx.financialAccount.update({
          where: {
            id: expenseData.data.accountId,
            userId: session.userId,
          },

          data: {
            balance: {
              decrement:
                expenseData.data.amount,
            },
          },
        });

      // save new balance to balance history
      await tx.financialBalanceHistory.create({
        data: {
          accountId:
            expenseData.data.accountId,
          balance: updatedFinance.balance,
        },
      });
    }, {
      maxWait: 5000,
      timeout: 10000
    });

    return NextResponse.json(
      {
        message:
          "expense submitted successfully",
      },
      { status: 200 },
    );
  } catch (error){
    console.log("error in expense", error)
    return NextResponse.json(
      { message: "an error occured" },
      { status: 500 },
    );
  }
};