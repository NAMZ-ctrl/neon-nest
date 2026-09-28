"use server";

import {prisma } from "@/db/db";

// convert account id to bank name
export async function getAccountNameById(id: string) {
  const account = await prisma.financialAccount.findUnique({
    where: {
      id
    }
  });

  return account?.name || null;
}