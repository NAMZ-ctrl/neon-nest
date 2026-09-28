-- DropForeignKey
ALTER TABLE "FinancialBalanceHistory" DROP CONSTRAINT "FinancialBalanceHistory_accountId_fkey";

-- AddForeignKey
ALTER TABLE "FinancialBalanceHistory" ADD CONSTRAINT "FinancialBalanceHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
