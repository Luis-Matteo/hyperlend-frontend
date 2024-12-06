import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions
import React from 'react';


type DataProps = {
    name: string;
    value: number;
    color: string;
};

type PolarAreaChartProps = {
    data: DataProps[];
};

const PolarAreaChart = React.memo(({ data }: PolarAreaChartProps) => {
    const series = data.map((item) => item.value)
    const labels = data.map((item) => item.name);
    const colors = data.map((item) => item.color)
    const options: ApexOptions = {
        chart: {
            type: 'polarArea', // Use one of the valid string literals
        },
        labels,
        colors,
        legend: {
            show: false, // Show legend
        },
        stroke: {
            colors: ['#737373'],
        },
        tooltip: {
            enabled: true, // Enable tooltips
            y: {
                formatter: (value) => `${value}%`, // Format the value shown in the tooltip
            },
        },
    };

    return (

        <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-8'>
            <div className='flex flex-col gap-4'>
                {
                    data.map((item, index) => (
                        <div className='flex items-center gap-2' key={index}>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className='flex justify-between items-center w-32'>
                                <p className='text-sm font-lufga text-[#D4D4D4]'>{item.name}</p>
                                <p className='text-sm font-lufga text-white'>{item.value}%</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <ReactApexChart options={options} series={series} type="polarArea" />
        </div>
    )
});

export default PolarAreaChart;
