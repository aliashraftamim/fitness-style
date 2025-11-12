"use client";

import { useGetEarningChartQuery } from "@/redux/features/admin/overview.api";
import { Select } from "antd";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyIncome {
  month: string;
  income: number;
}

const EarningChart = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i); // Current year + previous 10

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // API call with selected year
  const { data: chartData } = useGetEarningChartQuery(selectedYear);
  const data: MonthlyIncome[] = chartData?.data || [];

  return (
    <div className="bg-white rounded-2xl shadow-md p-10">
      <div className="w-full h-[460px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Monthly Earning Summary
          </h3>

          <Select
            value={selectedYear}
            style={{ width: 120 }}
            onChange={(value) => setSelectedYear(value)}
            options={years.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            }))}
          />
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="#001d46"
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -5,
                fontSize: 14,
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#4b5563"
              label={{
                value: "Earnings ($)",
                angle: -90,
                position: "insideLeft",
                fontSize: 14,
                offset: -5,
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
              formatter={(value: number) => [`$${value}`, "Earnings"]}
            />
            <Bar
              dataKey="income"
              barSize={70}
              fill="#022914"
              radius={[6, 6, 0, 0]}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningChart;
