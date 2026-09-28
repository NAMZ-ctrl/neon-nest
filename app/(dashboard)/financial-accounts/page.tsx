import {
  getFianancialAccountData,
  getFinancialAccountByUser,
} from "@/actions/financial-accounts.action";
import { updatedFinancialAccountData } from "@/libs/helpers";
import SummaryCard from "@/components/finance-cards/summary-cards";
import AccountList from "@/components/financial-accounts/account-list";
import {
  calculateBankBalance,
  calculateCashBalance,
  getTotalBalance,
} from "@/libs/client-helpers";
import FinancialAccountsForm from "./financial-accounts-form";
import { ConvertedFinancialAccount, SummaryCardData, Period } from "@/libs/types";
import GraphOverview from "@/components/financial-accounts/graph-overview";
import AccountDistribution from "@/components/financial-accounts/account-distribution";
import { AccountType } from "@/prisma/app/generated/prisma/enums";
import { auth } from "@/auth";

export default async function FinancialAccountsPage({searchParams}: {searchParams: Promise<{account?: AccountType | "ALL", period?: Period}>}) {
  const session = await auth()
  const financialAccountData = await getFinancialAccountByUser();
  if (!financialAccountData.success) return <div>no data found</div>;
  const account = (await searchParams).account || "ALL";
  const period = (await searchParams).period || "7d";
  const updatedData = updatedFinancialAccountData(
    financialAccountData?.data as ConvertedFinancialAccount[],
  );
  console.log(account)
  const graphData = await getFianancialAccountData(
    session?.userId as string,
  );
  
  const summaryCards: SummaryCardData[] = [
    {
      title: "Total Balance",
      type: "amount",
      icon: "landmark",
      value: getTotalBalance(updatedData),
    },
    {
      title: "Active Accounts",
      type: "number",
      icon: "currency",
      value: updatedData.filter((acc) => acc.isActive).length,
    },
    {
      title: "Bank Balance",
      icon: "landmark",
      type: "amount",
      value: calculateBankBalance(updatedData),
    },
    {
      title: "Cash & Wallets",
      icon: "wallet",
      type: "amount",
      value: calculateCashBalance(updatedData),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header row: title left, form/action right */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">Your financial accounts</h1>
          <FinancialAccountsForm />
        </div>

        {/* Account list + summary cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <section>
            <AccountList acc={financialAccountData.data!} />
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} cardData={card} />
            ))}
          </section>
        </div>

        {/* Charts side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AccountDistribution data={graphData.accountDonutData} />
          <GraphOverview data={graphData} />
        </div>
      </div>
    </>
  );
}
