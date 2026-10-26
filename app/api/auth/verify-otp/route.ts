import { prisma } from "@/db/db";
import { compareSync } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, otp } = await req.json();

    // get user id
    const userId = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // get latest otp from database
    const currentOtp = await prisma.passwordResetOTP.findFirst({
      where: {
        userId: userId?.id,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!currentOtp) {
      return NextResponse.json(
        {
          message: "Invalid or expired verificaton code",
        },
        { status: 400 },
      );
    }
    if (compareSync(otp, currentOtp.otpHash)) {
      return NextResponse.json({ message: "otp verified" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Invalid or Expired verification code" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "somethimg went wrong" },
      { status: 500 },
    );
  }
};
