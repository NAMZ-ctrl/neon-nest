import { loginSchema } from "@/libs/validators";
import { signIn } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyRaw = await req.json();
    console.log(bodyRaw)
  try {
    const userData = loginSchema.safeParse(bodyRaw);
    if (!userData.success) {
        console.log("hello world ")
      return NextResponse.json({ message: "error in inputs" }, { status: 500 });
    }
    await signIn("credentials", {
      email: userData.data.email,
      password: userData.data.password,
    });
    return NextResponse.json(
      { message: "signed up successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "an error occured" }, { status: 500 });
  }
}
