import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Define the data type
interface DataPoint {
  year: string;
  utilization?: number;
  borrow?: number;
  supply?: number;
}

// Sample data
const data: DataPoint[] = [ 
  { year: '2010', utilization: 10, borrow: 10, supply: 10 },
  { year: '2011', utilization: 15, borrow: 12, supply: 11 },
  { year: '2012', utilization: 20, borrow: 15, supply: 13 },
  { year: '2013', utilization: 30, borrow: 20, supply: 17 },
  { year: '2014', utilization: 40, borrow: 25, supply: 20 },
  { year: '2015', utilization: 50, borrow: 35, supply: 25 },
  { year: '2016', utilization: 60, borrow: 40, supply: 30 },
  { year: '2017', utilization: 70, borrow: 50, supply: 35 },
  { year: '2018', utilization: 80, borrow: 55, supply: 40 },
  { year: '2019', utilization: 90, borrow: 60, supply: 50 },
];

const InterestRateModelChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <XAxis 
          dataKey="year"  
          axisLine={false} 
          tickLine={false} 
          padding={{ left: 30 }} // Add padding to create an empty space at the start
          tick={{ /*angle: -45, dy: 15*/ }} // Rotate the X-axis labels
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={(value) => (value === 0 ? '' : value)} // Skip displaying the '0' value
          domain={[10, 100]} // Set the Y-axis domain from 10 to 100
          tickCount={10} // Ensure 10 ticks are displayed
        />
        <Tooltip />
        <Line type="monotone" dataKey="utilization" stroke="#4c51bf" dot={false} name="Utilization rate" />
        <Line type="monotone" dataKey="borrow" stroke="#38b2ac" dot={false} name="Borrow API" />
        <Line type="monotone" dataKey="supply" stroke="#ecc94b" dot={false} name="Supply API" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InterestRateModelChart;
