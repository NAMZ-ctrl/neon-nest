import { prisma } from "@/db/db";
import { getUserId } from "@/libs/helpers";
import { budgetSchema } from "@/libs/validators";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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
    const budgetRawData = await req.json();

    const budgetData = budgetSchema.safeParse(budgetRawData);

    if (!budgetData.success) {
      return NextResponse.json(
        {
          message: "invalid data",
        },
        { status: 500 },
      );
    }

    await prisma.budget.create({
      data: {
        userId: session.userId,
        month: budgetData.data.month,
        year: budgetData.data.year,
        categories: {
          create: budgetData.data.categories.map((category) => ({
            category: category.category,
            amount: category.amount,
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({message: "budget added successfully"}, {status: 200})
  } catch (error){
    console.log('budget error',error)
    return NextResponse.json({ message: "an error occured" }, { status: 500 });
  }
};
