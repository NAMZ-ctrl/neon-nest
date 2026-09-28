import SignUpForm from "@/components/auth/sign-up-form";

import { auth } from "@/auth";


export default async function SignUp() {
  // getting session values using getserversession function
  const session = await auth()
  console.log("session from signup", session)
  return (
    <>
        <SignUpForm />
    </>
  );
}
