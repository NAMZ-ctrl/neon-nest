"use client";

import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
}

export function SignInButton() {
  return <Button onClick={() => signIn()}>Sign In</Button>;
}
