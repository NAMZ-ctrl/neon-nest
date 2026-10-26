import { getAllBudget, getDifferenceByBudgetId, getMonthBudget } from "@/actions/budget.action";
import BudgetForm from "@/components/forms/budget-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, WalletCards, CircleDollarSign, PiggyBank } from "lucide-react";
import { id } from "zod/v4/locales";
import BudgetMonth from "./budget-month";
import { redirect } from "next/navigation";
import TotalBudgetMonth from "./total-budget-month";
import { TotalBudget } from "@/libs/types";
import { getAverageExpense } from "@/actions/expense.action";
import TotalSpentPage from "./total-spent";


const budgetCategories = [
  {
    category: "Food",
    spent: 38000,
    limit: 60000,
  },
  {
    category: "Transport",
    spent: 25000,
    limit: 30000,
  },
  {
    category: "Shopping",
    spent: 8000,
    limit: 40000,
  },
  {
    category: "Entertainment",
    spent: 22000,
    limit: 20000,
  },
];

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{
    budgetId?: string;
  }>;
}) {
  const { budgetId } = await searchParams;

  const allBudget = await getAllBudget();

  {/*if there is no budget ID these statements handles the change */}
  if (!budgetId) {
    if (allBudget.data.length > 0) {
      redirect(`/budget?budgetId=${allBudget.data[0].id}`);
    }
  }
  console.log("budget id is ", budgetId)
  const refinedBudget = allBudget.data?.map((each) => ({
    id: each.id,
    month: each.month,
    year: each.year,
  }));

  const [montlyBudget, latestMonthlyExpense, differences] = await Promise.all([getMonthBudget(budgetId), getAverageExpense(), getDifferenceByBudgetId(budgetId)]);
  console.log("all budget", allBudget);
  const totalBudget = budgetCategories.reduce(
    (total, item) => total + item.limit,
    0,
  );
  console.log("differences", differences)
  const refinedDifferences = differences.data?.map((each) => (
    {
      ...each,
      budget_month_amount: each.budget_month_amount.toNumber(),
      expense_history: each.expense_history.toNumber()
    }
  ))!

  const totalSpent = budgetCategories.reduce(
    (total, item) => total + item.spent,
    0,
  );

  const remaining = totalBudget - totalSpent;

  return (
    <main className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Budget</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Plan your spending and stay within your monthly limits.
          </p>
        </div>
        <BudgetForm />
      </div>
      {allBudget.data?.length === 0 ? (
        <div>no budget found</div>
      ) : (
        <div>
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">Budget period</p>
            <BudgetMonth budgets={refinedBudget} />
          </div>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <TotalBudgetMonth monthlyBudget={montlyBudget.data as TotalBudget[]}/>
            <TotalSpentPage  differences={refinedDifferences}/>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="mt-2 text-2xl font-semibold">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((totalSpent / totalBudget) * 100)}% of your
                    budget
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <CircleDollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="mt-2 text-2xl font-semibold">
                    ₦{remaining.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Available to spend
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <PiggyBank className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Budget Categories */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Budget Overview</h2>
              <p className="text-sm text-muted-foreground">
                See how your spending compares with each category limit.
              </p>
            </div>
            <Card>
              <CardContent className="divide-y p-0">
                {budgetCategories.map((item) => {
                  const percentage = (item.spent / item.limit) * 100;
                  const remaining = item.limit - item.spent;
                  return (
                    <div key={item.category} className="space-y-3 p-5">
                      {/* Category heading */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {percentage.toFixed(0)}% used
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₦{item.spent.toLocaleString()}
                            <span className="font-normal text-muted-foreground">
                              {" "}
                              / ₦{item.limit.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/* Progress */}
                      <Progress value={Math.min(percentage, 100)} />
                      {/* Remaining */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₦{item.spent.toLocaleString()} spent</span>
                        {remaining >= 0 ? (
                          <span>₦{remaining.toLocaleString()} remaining</span>
                        ) : (
                          <span className="font-medium text-destructive">
                            ₦{Math.abs(remaining).toLocaleString()} over budget
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </main>
  );
}
