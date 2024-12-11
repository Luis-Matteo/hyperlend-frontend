import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import { formatNumber } from '../../utils/functions';
import { useProtocolInterestRateModel } from '../../utils/protocol/core/interestRates';

interface InterestRateModelChartType {
  token: string;
  currentUtilization: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
        }}
      >
        <p
          className='label'
          style={{ color: '#302DC2' }}
        >{`Utilization Rate: ${label}%`}</p>
        <p
          className='intro'
          style={{ color: '#f10750' }}
        >{`Borrow APY: ${payload[0].value}%`}</p>
        <p
          className='intro'
          style={{ color: '#38b2ac' }}
        >{`Supply APY: ${payload[1].value}%`}</p>
      </div>
    );
  }

  return null;
};

const InterestRateModelChart: React.FC<InterestRateModelChartType> = ({
  token,
  currentUtilization,
}) => {
  const rawData = useProtocolInterestRateModel(token);

  const data = rawData.map((e) => {
    let borrowRatePercent = e.variableRate * 100;
    let supplyRatePercent = e.utilization * e.variableRate * (1 - 0.2);
    return {
      utilization: e.utilization,
      supply: Number(formatNumber(supplyRatePercent, 2)),
      borrow: Number(formatNumber(borrowRatePercent, 2)),
    };
  });

  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <XAxis
          dataKey='utilization'
          name='Utilization rate'
          axisLine={false}
          tickLine={false}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          x={Number(parseFloat(currentUtilization.toString()).toFixed(0))}
          stroke='#302DC2'
        />
        <Line
          type='monotone'
          dataKey='borrow'
          stroke='#f10750'
          dot={false}
          name='Borrow APY'
        />
        <Line
          type='monotone'
          dataKey='supply'
          stroke='#38b2ac'
          dot={false}
          name='Supply APY'
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InterestRateModelChart;
