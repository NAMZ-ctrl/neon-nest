import { DataTable } from "@/components/shared/data-table";
import SummaryCard from "@/components/shared/summary-card";
import {
  CircleDollarSign,
  ChartNoAxesColumnIncreasing,
  ShoppingCart,
} from "lucide-react";

import { expenseColumns } from "./columns";
import ExpenseForm from "@/components/forms/expense-form";

import { getFinancialAccountByUser } from "@/actions/financial-accounts.action";

import {
  getAverageExpense,
  getExpenseData,
  getMonthlyExpense,
  getTotalExpense,
} from "@/actions/expense.action";

import {
  calculateMonthlyTrend,
  convertBalanceType,
} from "@/libs/helpers";

import { ConvertedExpense } from "@/libs/types";
import { convertDecimalToNumber } from "@/libs/api-helper";

export default async function ExpensePage() {
  const [
    totalExpense,
    financialAccountData,
    expenseData,
    averageExpense,
    trend,
  ] = await Promise.all([
    getTotalExpense(),
    getFinancialAccountByUser(),
    getExpenseData(),
    getAverageExpense(),
    getMonthlyExpense(),
  ]);

  if (!expenseData.success) {
    return <div>No data found</div>;
  }

  const data = [
    {
      title: "Total Expense",
      amount: Number(totalExpense.data ?? 0),
      children: <CircleDollarSign />,
      type: "currency",
      trend: calculateMonthlyTrend(trend.data ?? []),
    },
    {
      title: "Average Expense",
      amount: Number(
        averageExpense.data?.[0]?.average ?? 0
      ),
      length: Number(
        averageExpense.data?.[0]?.count ?? 0
      ),
      children: <ChartNoAxesColumnIncreasing />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Expenses
          </h1>

          <p className="text-sm text-muted-foreground">
            Track and manage spending across your accounts.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.map((each, index) => (
          <SummaryCard
            key={index}
            title={each.title}
            amount={each.amount}
            value={each.value}
            name={each.name}
            length={each.length}
            trend={each.trend}
          >
            {each.children}
          </SummaryCard>
        ))}
      </section>

      <div className="space-y-3">
        <div className="flex justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            All expenses
          </h2>

          <ExpenseForm
            financialAccountData={
              financialAccountData.data
            }
          />
        </div>

        {expenseData.data && (
          <DataTable
            columns={expenseColumns}
            data={convertDecimalToNumber(expenseData.data) as ConvertedExpense[]}
          />
        )}
      </div>
    </div>
  );
}