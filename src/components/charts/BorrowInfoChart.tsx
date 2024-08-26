import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { calculateApy, formatNumber } from '../../utils/functions'
import { useInterestRateHistory } from '../../utils/protocolState';

interface BorrowInfoChartType {
  type: string;
  token: string;
}

const BorrowInfoChart: React.FC<BorrowInfoChartType> = ({ token, type }) => {
  const rawData = useInterestRateHistory(token)
  
  const data = rawData.map((e: any) => {
    const rate = type == "supply" ? e.liquidityRate : e.borrowRate;
    return {
      time: new Date(e.timestamp),
      rate: formatNumber(calculateApy(Number(rate)), 2)
    }
  })

  return (
    <div style={{ padding: "20px" }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ left: 20, right: 20, top: 20, bottom: 0 }}
        >
          <XAxis
            dataKey="time"
            fontSize={15}
            padding={{ left: 30, right: 0 }} // Add padding to the left
          />
          <YAxis
            tickFormatter={(value) => (value === 0 ? "" : value)} // Skip displaying the '0' value
            // domain={[10, 100]} // Set the Y-axis domain from 10 to 100
            // ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Define ticks manually
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={type == "supply" ? "#2DC24E" : "#4c51bf"}
            strokeWidth={2}
            dot={false}
            name={type == "supply" ? "Supply APY" : "Borrow APY"}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowInfoChart;
