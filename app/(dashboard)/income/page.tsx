import { DataTable } from "@/components/shared/data-table";
import SummaryCard from "@/components/shared/summary-card";
import {
  BadgeDollarSign,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
} from "lucide-react";
import { incomeColumns } from "./columns";
import IncomeForm from "@/components/forms/income-form";
import { getFinancialAccountByUser } from "@/actions/financial-accounts.action";
import {
  getAverageIncome,
  getIncomeData,
  getMonthlyIncome,
  getTopIncomeSource,
  getTotalIncome,
} from "@/actions/income.action";
import { calculateMonthlyTrend, convertBalanceType } from "@/libs/helpers";
import { ConvertedIncome } from "@/libs/types";

export default async function IncomePage() {
  const [
    totalIncome,
    financialAccountData,
    incomeData,
    averageIncome,
    trend,
    topIncome,
  ] = await Promise.all([
    getTotalIncome(),
    getFinancialAccountByUser(),
    getIncomeData(),
    getAverageIncome(),
    getMonthlyIncome(),
    getTopIncomeSource(),
  ]);
  if (!incomeData.success) return <div>no data found</div>;
    console.log("checking each data", totalIncome.data)
  const data = [
    {
      title: "Total Income",
      amount: Number(totalIncome.data),
      children: <CircleDollarSign />,
      type: "currency",
      trend: calculateMonthlyTrend(trend.data!),
    },
    {
      title: "Average Income",
      amount: Number(averageIncome.data?.[0].average ?? 0),
      length: Number(averageIncome.data?.[0].count ?? 0),
      children: <ChartNoAxesColumnIncreasing />,
    },

  ];
  console.log("data", data);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage income across your accounts.
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
            All income
          </h2>
          <IncomeForm financialAccountData={financialAccountData.data} />
        </div>
        {incomeData?.data && (
          <DataTable
            columns={incomeColumns}
            data={convertBalanceType(incomeData.data) as ConvertedIncome[]}
          />
        )}
      </div>
    </div>
  );
}
