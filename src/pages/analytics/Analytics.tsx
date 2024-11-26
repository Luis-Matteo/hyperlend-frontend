
import BorderCard from '../../components/analytics/BorderCard';
import LineChart from '../../components/analytics/LineChart';
import PolarAreaChart from '../../components/analytics/PolarArea';
import Navbar from '../../layouts/Navbar';

const tvlcomposition = [
    {
        name: "BTC",
        value: 25,
        color: "#CAEAE5",
    },
    {
        name: "ETH",
        value: 11,
        color: "#CAEAE5CC",
    },
    {
        name: "USDT",
        value: 12,
        color: "#CAEAE5B2",
    },

    {
        name: "USDC",
        value: 13,
        color: "#CAEAE5B2",
    },
    {
        name: "BTC",
        value: 14,
        color: "#CAEAE580",
    },
    {
        name: "BTC",
        value: 15,
        color: "#CAEAE566",
    },
    {
        name: "BTC",
        value: 10,
        color: "#CAEAE54D",
    },
]

const usersActivity = [
    {
        name: "Supply",
        value: 25,
        color: "#CAEAE5",
    },
    {
        name: "Borrow",
        value: 11,
        color: "#CAEAE5CC",
    },
    {
        name: "Withdraw",
        value: 12,
        color: "#CAEAE5B2",
    },

    {
        name: "Repay",
        value: 13,
        color: "#CAEAE5B2",
    },
    {
        name: "Liquidation",
        value: 14,
        color: "#CAEAE580",
    },

]

const lineChartData = [10, 40, 50, 60, 80, 20, 30, 50, 30, 30, 30, 30, 40, 70, 100]
function Analytics() {
    return (
        <>
            <div className='w-full'>
                <Navbar pageTitle='Data Analytics' />
                <div className='grid grid-cols-1 xl:grid-cols-2 h-full gap-4 mt-24'>
                    <BorderCard
                        title='TVL Composition'>
                        <PolarAreaChart
                            data={tvlcomposition} />
                    </BorderCard>
                    <BorderCard
                        title='Users Activity'>
                        <PolarAreaChart
                            data={usersActivity} />
                    </BorderCard>
                    <BorderCard
                        title='TVL'>
                        <LineChart
                            data={lineChartData} />
                    </BorderCard>
                    <BorderCard
                        title='Total Users'>
                        <LineChart
                            data={lineChartData} />
                    </BorderCard>
                    <BorderCard
                        title='Total Deposits'>
                        <LineChart
                            data={lineChartData} />
                    </BorderCard>
                    <BorderCard
                        title='Total Borrowed'>
                        <LineChart
                            data={lineChartData} />
                    </BorderCard>
                </div>
                <div className='mt-4'>
                    <BorderCard
                        title='Liquidations'>
                        <LineChart
                            data={lineChartData}
                            xgrid={false}
                            ygrid={true} />
                    </BorderCard>
                </div>
            </div>

        </>
    );
}

export default Analytics;
