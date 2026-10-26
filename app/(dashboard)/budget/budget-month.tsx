"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BudgetMonthProps {
  budgets: {
    id: string;
    month: number;
    year: number;
  }[];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// text-lg font-medium
export default function BudgetMonth({ budgets }: BudgetMonthProps) {
  const router = useRouter();
  const [id, setId] = useState(budgets[0].id);
  const currentLabel = budgets.find((budget) => budget.id === id) ?? budgets[0];
  console.log(budgets)
  
  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant={"outline"}
                className={cn("text-lg font-medium")}
              />
            }
          >
            {months[currentLabel.month - 1]} {currentLabel.year}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Month</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={id}
                onValueChange={(id) => {
                  setId(id);
                  router.replace(`/budget?budgetId=${id}`);
                }}
              >
                {budgets.map((budget) => (
                  <DropdownMenuRadioItem key={budget.id} value={budget.id}>
                    {months[budget.month - 1]} {budget.year}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
