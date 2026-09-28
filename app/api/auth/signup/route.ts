import { NextRequest, NextResponse } from "next/server";
import { signupSchema} from "@/libs/validators";
import { auth } from "@/auth";
import { prisma } from "@/db/db";
import { hashSync } from "bcrypt-ts";


// validate and send the data to next auth

export async function GET(req: NextRequest) {
  const session = await auth();
  console.log(session);
  return NextResponse.json({ data: session }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const bodyRaw = await req.json();
  try {
    const data = signupSchema.safeParse(bodyRaw);
    if (!data.success) {
      return NextResponse.json({ message: "error in inputs" }, { status: 500 });
    }
    console.log(data.data);
    const emailExists = await prisma.user.findUnique({
      where: { email: data.data.email },
    });
    if (emailExists) {
      return NextResponse.json(
        { message: "email already exists" },
        { status: 500 },
      );
    }
    const newUserData = {
        email: data.data.email,
        name: `${data.data.firstName} ${data.data.lastName}`,
        password: hashSync(data.data.password)
    }
    await prisma.user.create(
        {data: newUserData}
    )
    return NextResponse.json(
      { message: "Signed up successfully" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "An error occured" }, { status: 500 });
  }
}
