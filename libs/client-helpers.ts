import { AccountType } from "@/prisma/app/generated/prisma/enums";


// get a total amount for financial accounts

interface UpdatedFinancialAccount {
  accountNumber: string | undefined;
  name: string;
  type: AccountType;
  balance: number;
}

export const getTotalBalance = (data: UpdatedFinancialAccount[]) => {
  const totalAmount = data.reduce((sum, account) => sum + account.balance, 0);
  return totalAmount;
};

export const calculateBankBalance = (data: UpdatedFinancialAccount[]) => {
  const bankAccounts = data.filter((acc) => acc.type ===  "BANK");
  const total = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  return total
}

export const calculateCashBalance = (data: UpdatedFinancialAccount[]) => {
  const cashAccounts = data.filter((each) => (each.type === "CASH" || each.type === "WALLET"))
  return cashAccounts.reduce((sum, account) => sum + account.balance, 0)
}

