"use client";

import React, { useContext } from "react";
import { Card, CardContent } from "../ui/card";
import { CurrencyContext } from "@/context/currency-provider";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount?: number;
  value?: number | string;
  name?: string;
  length?: number;
  trend?: number;
  children: React.ReactNode;
}

export default function SummaryCard({
  title,
  value,
  amount,
  name,
  trend,
  length,
  children,
}: SummaryCardProps) {
  const { formatCurrency } = useContext(CurrencyContext);

  return (
    <Card className="group border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">

        {/* Header */}
        <div className="mb-5 flex items-start justify-between">

          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-5 [&_svg]:w-5">
            {children}
          </div>

          {/* Monthly trend */}
          {trend !== undefined && (
            <div className="mt-1 flex items-center gap-1.5 text-xs">

              <span
                className={cn(
                  "flex items-center gap-1 font-medium",
                  trend >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}

                {Math.abs(trend).toFixed(1)}%
              </span>

              <span className="text-muted-foreground">
                vs last month
              </span>
            </div>
          )}
        </div>

        {/* Card information */}
        <div>

          {/* Title */}
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          {/* Main value */}
          <p className="mt-1 truncate text-2xl font-semibold tracking-tight">
            {amount !== undefined
              ? formatCurrency(amount)
              : name ?? value ?? "TBD"}
          </p>

          {/* Average income transaction count */}
          {length !== undefined && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {length} {length === 1 ? "transaction" : "transactions"}
            </p>
          )}

          {/* Top income source percentage */}
          {name && value !== undefined && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {Number(value).toFixed(1)}% of total income
            </p>
          )}

        </div>
      </CardContent>
    </Card>
  );
}