import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { Resend, ErrorResponse } from "resend";
import { randomInt } from "crypto";
import { hashSync } from "bcrypt-ts";
import { otpRequestLimiter } from "@/libs/redis";
import ForgotPasswordEmail from "@/components/email/forgot-password-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    // if email exists
    console.log("email", email)
    const emailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!emailExists) {
      console.log("i am here")
      throw new Error("email does not exist");
    }
    //applying rate limiter logiv
    const {success, limit, remaining, reset} = await otpRequestLimiter.limit(email);

    if (!success){
      return NextResponse.json({
        error: "too many requests",
        message: "please wait before trying again",
      }, {
        status: 429
      })
    }
    // if email exist send an otp
    const otp = randomInt(100000, 1000000).toString();
    // the expiry code is 10 minute
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.passwordResetOTP.create({
      data: {
        otpHash: hashSync(otp),
        userId: emailExists.id,
        expiresAt: expiresAt,
      },
    });
    const {data, error} = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${emailExists.email}`],
        subject: 'Your NeonNest password reset code',
        react: <ForgotPasswordEmail otp={otp}/>
    })
    console.log("resend error", error?.statusCode)
    if (error){
      throw new Error("email could not be sent")
    }
    return NextResponse.json(
      { message: "otp stored successfully" },
      { status: 200 },
    );
  } catch (error) {
     console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
