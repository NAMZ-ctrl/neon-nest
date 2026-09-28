-- CreateTable
CREATE TABLE "FinancialBalanceHistory" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialBalanceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinancialBalanceHistory_accountId_date_idx" ON "FinancialBalanceHistory"("accountId", "date");

-- AddForeignKey
ALTER TABLE "FinancialBalanceHistory" ADD CONSTRAINT "FinancialBalanceHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
