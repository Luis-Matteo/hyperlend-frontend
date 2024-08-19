import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the data type
interface DataPoint {
  month: string;
  borrow: number;
}

// Sample data
const data: DataPoint[] = [
  { month: "JAN", borrow: 20 },
  { month: "FEB", borrow: 15 },
  { month: "MAR", borrow: 10 },
  { month: "APR", borrow: 35 },
  { month: "MAY", borrow: 70 },
  { month: "JUN", borrow: 40 },
  { month: "JUL", borrow: 80 },
  { month: "AUG", borrow: 50 },
  { month: "SEP", borrow: 60 },
  { month: "OCT", borrow: 40 },
  { month: "NOV", borrow: 50 },
  { month: "DEC", borrow: 55 },
];

interface BorrowInfoChartType {
  color?: string;
}

const BorrowInfoChart: React.FC<BorrowInfoChartType> = ({ color }) => {
  return (
    <div style={{ padding: "20px" }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ left: 20, right: 20, top: 20, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            fontSize={15}
            padding={{ left: 30, right: 0 }} // Add padding to the left
          />
          <YAxis
            tickFormatter={(value) => (value === 0 ? "" : value)} // Skip displaying the '0' value
            domain={[10, 100]} // Set the Y-axis domain from 10 to 100
            ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Define ticks manually
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="borrow"
            stroke={color || "#4c51bf"}
            strokeWidth={2}
            dot={false}
            name="Borrow API"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowInfoChart;
