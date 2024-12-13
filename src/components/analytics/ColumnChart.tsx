import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
// import { formatNumber } from '../../utils/functions';

interface ChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const ColumnChart = ({ data }: ChartProps) => {
  const values = data.map((item) => item.value);
  const options: ApexOptions = {
    chart: {
      id: 'basic-column',
      toolbar: {
        show: false, // Hide the toolbar
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: data.map((item) => item.name), // Add categories for each bar
      labels: {
        show: true, // Hide x-axis labels
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        offsetX: -15,
      },
      axisBorder: {
        show: false, // Hide y-axis border
      },
      axisTicks: {
        show: true, // Hide y-axis ticks
      },
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
          show: true, // Hide x-axis gridlines
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      colors: ['#CAEAE5'],
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      width: 2, // Line width
      colors: ['#CAEAE5'], // Line color
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false, // Hide the series label (legend)
    },
    dataLabels: {
      enabled: true, // Disable data labels on the graph
      style: {
        colors: ['#050F0D'],
      },
    },
    plotOptions: {
      area: {
        fillTo: 'end', // Ensure fill extends to the end
      },
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: {
          position: 'top',
        },
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
      name: 'series-1',
      data: values,
    },
  ];

  return (
    <Chart
      options={options as any}
      series={series}
      type='bar'
      width='100%'
      height={250}
    />
  );
};

export default ColumnChart;
