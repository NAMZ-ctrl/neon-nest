"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CurrencyContext } from "@/context/currency-provider";
import { ExpenseCategory } from "@/prisma/app/generated/prisma/enums";
import { WalletCards } from "lucide-react";
import { useContext } from "react";

interface TotalBudgetMonthProps {
  monthlyBudget: {
    id: string;
    amount: number;
    category: ExpenseCategory;
    budgetId: string;
  }[];
}
export default function TotalBudgetMonth({
  monthlyBudget,
}: TotalBudgetMonthProps) {
  const totalBudget = monthlyBudget.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const {formatCurrency} = useContext(CurrencyContext)
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          {/* monthly card */}
          <div>
            <p className="text-sm text-muted-foreground">Monthly Budget</p>
            <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(totalBudget)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">October 2026</p>
          </div>
          {/*monthly card ends */}
          <div className="rounded-lg bg-muted p-3">
            <WalletCards className="size-5" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
