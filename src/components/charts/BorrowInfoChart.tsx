import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  calculateApy,
  calculateApyIsolated,
  formatNumber,
} from '../../utils/functions';
import { useInterestRateHistory } from '../../utils/protocol/history';

interface BorrowInfoChartType {
  type: string;
  token: string;
  isIsolated?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: 'black',
          padding: '10px',
          fontFamily: 'lufga',
          fontWeight: 'regular',
        }}
      >
        <p className='label' style={{ color: 'white' }}>{`${label}`}</p>
        <p className='intro' style={{ color: 'white' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor:
                payload[0].name == 'Borrow APY' ? '#4c51bf' : '#2DC24E',
              borderRadius: '50%',
              marginRight: '5px',
            }}
          ></span>
          APY: <span style={{ fontWeight: '600' }}>{payload[0].value}%</span>
        </p>
      </div>
    );
  }

  return null;
};

const BorrowInfoChart: React.FC<BorrowInfoChartType> = ({
  token,
  type,
  isIsolated = false,
}) => {
  const rawData = useInterestRateHistory(token);

  let data;
  if (isIsolated) {
    data = rawData.map((e: any) => {
      const borrowApy = calculateApyIsolated(e.ratePerSec as BigInt);
      const supplyApy =
        borrowApy *
        Number(e.utilizationRate) *
        (1 - Number(e.feeToProtocolRate) / 100000);

      return {
        time: new Date(e.timestamp).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        }),
        rate: formatNumber(type == 'supply' ? supplyApy : borrowApy, 2),
      };
    });
  } else {
    data = rawData.map((e: any) => {
      const rate = type == 'supply' ? e.liquidityRate : e.borrowRate;
      return {
        time: new Date(e.timestamp).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        }), // change date to numbers
        rate: formatNumber(calculateApy(rate), 2),
      };
    });
  }

  return (
    <div style={{ padding: '20px 20px 20px 0px' }}>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          data={data}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
        >
          <XAxis
            dataKey='time'
            fontSize={15}
            padding={{ left: 30, right: 0 }} // Add padding to the left
            fontFamily='lufga'
            fontWeight='regular'
          />
          <YAxis
            tickFormatter={(value) => (value === 0 ? '' : value)} // Skip displaying the '0' value
            // domain={[10, 100]} // Set the Y-axis domain from 10 to 100
            // ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Define ticks manually
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Line
            type='monotone'
            dataKey='rate'
            stroke={type == 'supply' ? '#2DC24E' : '#4c51bf'}
            strokeWidth={2}
            dot={false}
            name={type == 'supply' ? 'Supply APY' : 'Borrow APY'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowInfoChart;
