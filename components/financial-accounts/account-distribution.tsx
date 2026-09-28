"use client";

import { useState, useMemo, useContext } from "react";
import { Card, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, Sector, Tooltip } from "recharts";
import CurrencyProvider, { CurrencyContext } from "@/context/currency-provider";

const COLORS = ["#8878DE", "#79B3C4", "#E0A93B", "#7FAE8A"];

function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
}

export default function AccountDistribution({
  data,
}: {
  data: Array<{ name: string; total: number }>;
}) {
    const {formatCurrency} = useContext(CurrencyContext)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const totalSum = useMemo(() => data.reduce((sum, d) => sum + d.total, 0), [data]);
  const maxIndex = useMemo(
    () => data.reduce((maxI, d, i, arr) => (d.total > arr[maxI].total ? i : maxI), 0),
    [data]
  );

  const isEmpty = !data || data.length === 0;

  const pieActiveProps = {
    activeIndex: activeIndex ?? maxIndex,
    activeShape: renderActiveShape,
  } as any;

  return (
    <Card className="p-6">
      <CardTitle className="mb-4">Account Distribution</CardTitle>

      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-neutral-400">
          No account data yet
        </div>
      ) : (
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={2}
            stroke="none"
            onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            {...pieActiveProps}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => {
              const numValue = typeof value === "number" ? value : Number(value ?? 0);
              const pct = totalSum ? ((numValue / totalSum) * 100).toFixed(0) : "0";
              const formatted = formatCurrency(numValue);
              return [`${formatted} (${pct}%)`, name];
            }}
            contentStyle={{
              backgroundColor: "#1c1c1e",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
            }}
          />
        </PieChart>
      )}
    </Card>
  );
}