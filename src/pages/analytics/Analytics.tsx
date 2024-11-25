
import BorderCard from '../../components/analytics/BorderCard';
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

function Analytics() {
    return (
        <>
            <div className='w-full'>
                <Navbar pageTitle='Data Analytics' />
                <div className='grid grid-cols-2 h-full gap-4 mt-24'>
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
                </div>
            </div>
            
        </>
    );
}

export default Analytics;
