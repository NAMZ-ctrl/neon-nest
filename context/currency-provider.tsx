"use client";

import React, { createContext, useState } from "react";

type PreferredCurrency = "NGN" | "USD" | "GBP" | "EUR";

interface CurrencyContextData {
  preferredCurrency: PreferredCurrency;
  setPreferredCurrency: React.Dispatch<React.SetStateAction<PreferredCurrency>>;
  formatCurrency: (amount: number) => string;
}
export const CurrencyContext = createContext<CurrencyContextData>(
  {} as CurrencyContextData,
);
export default function CurrencyProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [preferredCurrency, setPreferredCurrency] =
    useState<PreferredCurrency>("NGN");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: preferredCurrency,
    }).format(amount);
  };

  return (
    <>
      <CurrencyContext.Provider
        value={{
          preferredCurrency,
          setPreferredCurrency,
          formatCurrency,
        }}
      >
        {children}
      </CurrencyContext.Provider>
    </>
  );
}
