
import Image from "next/image";
import {auth} from "@/auth"
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";
import LandingPage from "@/components/landing-page";

export default async function Home() {
  const session = await auth()
  return (
    <div>
      <LandingPage userId={session?.userId ?? null}/>
    </div>
  );
}
