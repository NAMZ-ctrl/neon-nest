"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CurrencyContext } from "@/context/currency-provider";
import { cn } from "@/lib/utils";
import { Currency, LandmarkIcon, TrendingDownIcon, TrendingUpIcon, WalletCards, type LucideIcon } from "lucide-react";
import { useContext } from "react";
import { IconName, SummaryCardData } from "@/libs/types";


interface SummaryCardProps {
  cardData: SummaryCardData;
  className?: string;
}

const icons = {
  "landmark": LandmarkIcon,
  "currency": Currency,
  "wallet": WalletCards,
  "trending-up": TrendingUpIcon,
  "trending-down": TrendingDownIcon
}

export default function SummaryCard({ cardData, className }: SummaryCardProps) {
  const { formatCurrency } = useContext(CurrencyContext);
  const { title, type, icon,  value, trend } = cardData;
  const Icon = icons[icon]
  const formatValue = (value: number, type: SummaryCardData["type"]) => {
    if (type === "amount") {
      return formatCurrency(value);
    }
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">
          {formatValue(value, type)}
        </div>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              trend.direction === "up" ? "text-emerald-600" : "text-red-600",
            )}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}% vs last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
