import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions

type DataProps = {
  name: string;
  value: number;
  color: string;
};

type PolarAreaChartProps = {
  data: DataProps[];
};

const PolarAreaChart = ({ data }: PolarAreaChartProps) => {
  const series = data.map((item) => item.value);

  const colors = data.map((item) => item.color);
  const options: ApexOptions = {
    chart: {
      type: 'polarArea', // Use one of the valid string literals
    },
    colors,
    legend: {
      show: false, // Show legend
    },
    stroke: {
      colors: ['#737373'],
    },
  };

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-8'>
      <div className='flex flex-col gap-4'>
        {data.map((item) => (
          <div className='flex items-center gap-2'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: item.color }}
            />
            <div className='flex justify-between items-center w-28'>
              <p className='text-sm font-lufga text-[#D4D4D4]'>{item.name}</p>
              <p className='text-sm font-lufga text-white'>{item.value}%</p>
            </div>
          </div>
        ))}
      </div>
      <ReactApexChart options={options} series={series} type='polarArea' />
    </div>
  );
};

export default PolarAreaChart;
