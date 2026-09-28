import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { getUserId } from "@/libs/helpers";
import { revalidatePath } from "next/cache";

export const GET = async (req: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string;
    }>
  }
) => {
  const session = await getUserId();
  if (!session?.userId) {
    return NextResponse.json(
      { message: "user not authenticated" },
      { status: 500 },
    );
  }
  try {
    const { id } = await params;
    const accountData = await prisma.financialAccount.findUnique({
      where: { id: id, userId: session.userId },
    });
    return NextResponse.json(
      { message: "account data retrieved successfully", data: accountData?.name },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "error retrieving account data" },
      { status: 500 },
    );
  }
}

export const PUT = async (
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
  if (!session) {
    return NextResponse.json(
      { message: "user not authenticated" },
      { status: 500 },
    );
  }
  try {
    const { id } = await params;
    const updatedData = await req.json();
    await prisma.financialAccount.update({
      where: { id: id, userId: session.userId },
      data: {
        userId: session.userId,
        name: updatedData.name,
        type: updatedData.type,
        balance: updatedData.balance,
        accountNumber: updatedData.accountNumber,
        history: {
          create: {
            balance: updatedData.balance,
          },
        },
      },
    });
    revalidatePath("/financial-accounts");
    return NextResponse.json(
      { message: "update successfull" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "update was not successfull" },
      { status: 500 },
    );
  }
};

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
      { message: "user not authenticated" },
      { status: 500 },
    );
  }
  try {
    const { id } = await params;
    await prisma.financialAccount.delete({
      where: { id: id, userId: session?.userId },
    });

    revalidatePath("/financial-accounts");
    return NextResponse.json({message: "account successfully deleted" }, {status: 200})
  } catch (error) {
    return NextResponse.json({message: "error deleting account" }, {status: 500})
  }
};
