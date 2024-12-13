import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import React from 'react';
// import { formatNumber } from '../../utils/functions';
interface DataPoint {
  value: number;
  date: string;
}

interface ChartProps {
  data: DataPoint[];
  tip?: string;
  xgrid?: boolean;
  ygrid?: boolean;
}

const LineChart = React.memo(
  ({ data, tip, xgrid = true, ygrid }: ChartProps) => {
    const seriesData = data.map((item) => item.value);
    const categories = data.map((item) => item.date);

    const options: ApexOptions = {
      chart: {
        id: 'basic-line',
        toolbar: {
          show: false, // Hide the toolbar
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45, // Rotate labels for better readability
          style: {
            colors: '#D4D4D4',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true, // Hide x-axis border
          color: '#356152',
        },
        axisTicks: {
          show: true, // Hide x-axis ticks
          color: '#356152',
        },
        tickAmount: 5,
      },
      yaxis: {
        labels: {
          style: {
            colors: '#D4D4D4',
            fontSize: '12px',
          },
          offsetX: -15,
          formatter: (value) => `${value.toLocaleString()}`,
        },
        axisBorder: {
          show: false, // Hide y-axis border
        },
        axisTicks: {
          show: true, // Hide y-axis ticks
        },
        tickAmount: 5,
      },
      grid: {
        show: true, // Hide gridlines
        position: 'back',
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        borderColor: '#356152',
        xaxis: {
          lines: {
            show: xgrid, // Hide x-axis gridlines
          },
        },
        yaxis: {
          lines: {
            show: ygrid,
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#CAEAE5',
              opacity: 0.3,
            },
            {
              offset: 100,
              color: '#FEF0EE',
              opacity: 0,
            },
          ],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2, // Line width
        colors: ['#CAEAE5'], // Line color
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => `${value.toLocaleString()}`, // Format tooltip values
        },
      },
      legend: {
        show: false, // Hide the series label (legend)
      },
      dataLabels: {
        enabled: false, // Disable data labels on the graph
      },
      plotOptions: {
        area: {
          fillTo: 'end', // Ensure fill extends to the end
        },
      },
      responsive: [
        {
          options: {
            chart: {
              padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              },
            },
            grid: {
              padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    };

    const series = [
      {
        name: `Total ${tip}`,
        data: seriesData,
      },
    ];

    return (
      <Chart
        options={options as any}
        series={series}
        type='area'
        width='100%'
        height={250}
      />
    );
  },
);

export default LineChart;
