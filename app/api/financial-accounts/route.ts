import { getUserId } from "@/libs/helpers";
import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { accountSchema } from "@/libs/validators";
import { revalidatePath } from "next/cache";
import { ConvertedFinancialAccount } from "@/libs/types";

// deprecated
// export const GET = async (req: NextRequest) => {
//   const session = await getUserId();
//   console.log("finance session", session)
//   if (!session?.userId) {
//     console.log("session not found")
//     return NextResponse.json(
//       { message: "user not authenticated", data: null },
//       { status: 500 },
//     );
//   }
//   try{
//     const finaceAccountData = await prisma.financialAccount.findMany({
//       where: {
//         userId: session.userId,
//       },
//     });

//     return NextResponse.json(
//       { message: "financial account exists", data: finaceAccountData },
//       { status: 200 },
//     );
//   }catch (error){
//     console.error(error)
//     return NextResponse.json({message: "an error occured", data:null}, {status: 500})
//   }
// };

export const POST = async (req: NextRequest) => {
  const session = await getUserId();
  console.log("user is", session?.userId);
  if (!session) {
    return NextResponse.json(
      { message: "user not authenticated" },
      { status: 500 },
    );
  }
  try {
    const financialAccountRawData = await req.json();
    const financialAccountData = accountSchema.safeParse(
      financialAccountRawData,
    );
    if (!financialAccountData.success) {
      return NextResponse.json({ message: "invalid data" }, { status: 500 });
    }
    console.log("did not reach here");
    await prisma.financialAccount.create({
      data: {
        userId: session.userId,
        name: financialAccountData.data.name,
        type: financialAccountData.data.type,
        balance: financialAccountData.data.balance,
        accountNumber: financialAccountData.data.accountNumber,
        history: {
         create: {
            balance: financialAccountData.data.balance
         }
        }
      },
    });
    revalidatePath("/financial-accounts");
    return NextResponse.json(
      { message: "form submitted successfully" },
      { status: 200 },
    );
  } catch (error){
      console.error(error)
    return NextResponse.json({ message: "an error occured" }, { status: 500 });
  }
};

