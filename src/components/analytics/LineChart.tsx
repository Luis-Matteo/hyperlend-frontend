import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
// import { formatNumber } from '../../utils/functions';

interface ChartProps {
    data: number[];
    xgrid?: boolean;
    ygrid?: boolean;
}

const LineChart = ({ data, xgrid = true, ygrid }: ChartProps) => {
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
            labels: {
                show: false, // Hide x-axis labels
            },
            axisBorder: {
                show: true, // Hide x-axis border
            },
            axisTicks: {
                show: false, // Hide x-axis ticks
            },
            tickAmount: 5
        },
        yaxis: {
            labels: {
                show: true, // Hide y-axis labels
            },
            axisBorder: {
                show: false, // Hide y-axis border
            },
            axisTicks: {
                show: true, // Hide y-axis ticks
            },
            tickAmount: 5

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
                }
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
            // custom: function({series, seriesIndex, dataPointIndex}: any) {
            //     return `<div>$${formatNumber(series[seriesIndex][dataPointIndex], 2)}</div>`;
            // }
            enabled: false,
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
            name: 'series-1',
            data: data,
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
};

export default LineChart;
