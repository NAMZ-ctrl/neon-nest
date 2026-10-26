"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyContext } from "@/context/currency-provider";
import { CircleDollarSign } from "lucide-react";
import { useContext } from "react";

interface TotalSpentProps{
  differences:{
    id: string;
    date: string;
    budget_month_amount: number;
    expense_history: number;
  }[]
}

export default function TotalSpentPage({differences}: TotalSpentProps) {
  const {formatCurrency} = useContext(CurrencyContext)
console.log("differences", differences);
    return (
        <>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatCurrency(differences[0].expense_history)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((differences[0].expense_history / differences[0].budget_month_amount) * 100)}% of your
                    budget
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <CircleDollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>
        </>
    )
}