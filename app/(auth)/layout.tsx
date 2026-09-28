import React from "react";
import AuthClient from "./auth-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth()
  if (session?.userId){
    redirect("/income")
  }
  return <>
    <AuthClient children={children}/>
  </>
}
