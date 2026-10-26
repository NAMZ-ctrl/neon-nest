import axios from "axios";
import { FinancialAccount, Prisma } from "@/prisma/app/generated/prisma/client";

export type FinancialAccountResponse = {
    message: string;
    data: FinancialAccount[] | null
}

// using this function to get financial account
export const getFinancialAccounts = async () => {
    try{
        const response = await axios.get<FinancialAccountResponse>("/api/financial-accounts", {withCredentials: true});
        return {message: "Financial accounts retrieved successfully", data: response.data.data}
    } catch (error){
        return {message: "Error in retrieving financial account", data: null}
    }
} 

export const convertDecimalToNumber = <
  T extends
    | { total: Prisma.Decimal }
    | { amount: Prisma.Decimal }
>(
  data: T[]
) => {
  const converter = data.map((each) => {
    if ("amount" in each) {
      return {
        ...each,
        amount: each.amount.toNumber(),
      };
    }

    return {
      ...each,
      total: each.total.toNumber(),
    };
  });

  return converter;
};