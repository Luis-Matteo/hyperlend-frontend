import Chart from 'react-apexcharts';

interface ChartProps {
  data: number[];
}

const MyChart = ({ data }: ChartProps) => {
    const options = {
        chart: {
            id: "basic-line",
            toolbar: {
                show: false,  // Hide the toolbar
            },
            zoom: {
                enabled: false
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        },
        xaxis: {
            labels: {
                show: false  // Hide x-axis labels
            },
            axisBorder: {
                show: false  // Hide x-axis border
            },
            axisTicks: {
                show: false  // Hide x-axis ticks
            },
        },
        yaxis: {
            labels: {
                show: false  // Hide y-axis labels
            },
            axisBorder: {
                show: false  // Hide y-axis border
            },
            axisTicks: {
                show: false  // Hide y-axis ticks
            },
        },
        grid: {
            show: false,  // Hide gridlines
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
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
                        color: "#CAEAE5",
                        opacity: 0.3
                    },
                    {
                        offset: 100,
                        color: "#FEF0EE",
                        opacity: 0
                    }
                ]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2,  // Line width
            colors: ['#CAEAE5']  // Line color
        },
        tooltip: {
            enabled: false  // Disable the tooltip
        },
        legend: {
            show: false  // Hide the series label (legend)
        },
        dataLabels: {
            enabled: false  // Disable data labels on the graph
        },
        plotOptions: {
            area: {
                fillTo: 'end'  // Ensure fill extends to the end
            }
        },
        responsive: [{
            options: {
                chart: {
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                },
                grid: {
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            }
        }]
    };

    const series = [
        {
            name: "series-1",
            data: data
        }
    ];

    return (
        <Chart
            options={options as any}
            series={series}
            type="area"
            width="100%"
            height="100%"
        />
    );
};

export default MyChart;
