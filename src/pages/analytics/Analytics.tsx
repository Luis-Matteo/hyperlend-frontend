import { useEffect, useState } from 'react';
import BorderCard from '../../components/analytics/BorderCard';
import ColumnChart from '../../components/analytics/ColumnChart';
import LineChart from '../../components/analytics/LineChart';
import PolarAreaChart from '../../components/analytics/PolarArea';
import Navbar from '../../layouts/Navbar';
import { apy } from '../../utils/constants/analytics';
import { formatAddress, formatNumber } from '../../utils/functions';
import { useAccount } from 'wagmi';
import { colorList } from '../../utils/constants/colorList';
import { LargestUsers } from '../../utils/types';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

function Analytics() {
    const { chainId } = useAccount();
    const [tvlList, setTvlList] = useState<{ name: any; value: number; color: string; }[]>([]);
    const [usersActivityList, setUsersActivityList] = useState<{ name: any; value: number; color: string; }[]>([]);
    const [depositors, setDepositors] = useState([]);
    const [borrowers, setBorrowers] = useState([]);
    const [dailyTVL, setDailyTVL] = useState([]);
    const [dailyUsers, setDailyUsers] = useState([]);
    const [dailyDeposits, setDailyDeposits] = useState([]);
    const [dailyBorrows, setDailyBorrows] = useState([]);
    const [dailyLiquidation, setDailyLiquidations] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_API;
    const [period, setPeriod] = useState<string>('daily')
    const [value, setValue] = useState<DateValueType>({
        startDate: null,
        endDate: null
    });

    useEffect(() => {
        const chain = chainId === 998 ? "hyperEvmTestnet" : "arbitrum"
        // Get TVL Composition
        fetch(`${backendUrl}/analytics/tvl-composition?chain=${chain}`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                const updatedTvlList = result.data.map((item: any, index: number) => ({
                    name: item.assetSymbol,
                    value: Number(item.tvlComp),
                    color: colorList[index]
                }));
                setTvlList(updatedTvlList);
            }
        })
        .catch((error) => console.error(error));

        // Get Users Activity
        fetch(`${backendUrl}/analytics/users-activity?chain=${chain}`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                const list = result.data.map((item: any, index: number) => ({
                    name: item.event === "LiquidationCall" ? "Liquidation" : item.event,
                    value: Number(item.composition),
                    color: colorList[index]
                }));
                setUsersActivityList(list);
            }
        })
        .catch((error) => console.error(error));

        // Get Largest Users
        fetch(`${backendUrl}/analytics/largest-users?chain=${chain}`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setDepositors(result.depositors);
                setBorrowers(result.borrowers);
            }
        })
        .catch((error) => console.error(error));

        // Get Daily TVL
        fetch(`${backendUrl}/analytics/daily-tvl?chain=${chain}&startDate=2024-11-10&endDate=2024-11-28`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setDailyTVL(result.data)
            }
        })
        .catch((error) => console.error(error));

        // Get Daily Users
        fetch(`${backendUrl}/analytics/daily-users?chain=${chain}&startDate=2024-11-10&endDate=2024-12-06`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setDailyUsers(result.data)
            }
        })
        .catch((error) => console.error(error));

        // Get Daily Volume - Supply
        fetch(`${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=2024-12-01&endDate=2024-12-06&type=Supply`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setDailyDeposits(result.data)
            }
        })
        .catch((error) => console.error(error));

        // Get Daily Volume - Borrow
        fetch(`${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=2024-12-01&endDate=2024-12-06&type=Borrow`)
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setDailyBorrows(result.data)
            }
        })
        .catch((error) => console.error(error));

        // Get Daily Volume - Liquidations
        fetch(`${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=2024-12-01&endDate=2024-12-06&type=LiquidationCall`)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if(result.success) {
                setDailyLiquidations(result.data)
            }
        })
        .catch((error) => console.error(error));
    }, [chainId])

    return (
        <>
            <div className='w-full'>
                <Navbar pageTitle={<span className="hidden lg:inline">Data Analytics</span>} />
                <div className='flex items-center gap-2 flex-wrap mt-4 lg:mt-10'>
                    <button
                        className={`${period === 'daily' ? 'text-secondary' : 'text-secondary/60'} border-secondary/60 border-2 hover:bg-secondary/20 py-3 px-5 font-lufga active:scale-95 duration-200 rounded-lg`}
                        onClick={() => setPeriod('daily')}>
                        Daily
                    </button>
                    <button
                        className={`${period === 'weekly' ? 'text-secondary' : 'text-secondary/60'} border-secondary/60 border-2 hover:bg-secondary/20 py-3 px-5 font-lufga active:scale-95 duration-200 rounded-lg`}
                        onClick={() => setPeriod('weekly')}>
                        Weekly
                    </button>
                    <div className='relative'>
                        <Datepicker
                            value={value}
                            onChange={(newValue: DateValueType) => setValue(newValue)}
                            useRange={false}
                            inputClassName={"relative transition-all duration-300 py-3 pl-4 pr-14 w-full border-2 border-secondary/60 rounded-lg bg-primary-light text-secondary/60 font-lufga placeholder-gray-400 disabled:cursor-not-allowed "}
                            toggleClassName={"absolute right-0 h-full px-3 text-secondary/60 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"}
                            displayFormat='DD/MM/YY'
                        />
                    </div>
                </div>
                <div className='grid grid-cols-1 xl:grid-cols-2 h-full gap-4 mt-6'>
                    <BorderCard
                        title='TVL Composition'>
                            <PolarAreaChart data={tvlList} />
                    </BorderCard>
                    <BorderCard
                        title='Users Activity'>
                        <PolarAreaChart
                            data={usersActivityList} />
                    </BorderCard>
                    <BorderCard
                        title='TVL'>
                        <LineChart
                            data={dailyTVL} />
                    </BorderCard>
                    <BorderCard
                        title='Total Users'>
                        <LineChart
                            data={dailyUsers} />
                    </BorderCard>
                    <BorderCard
                        title='Total Deposits'>
                        <LineChart
                            data={dailyDeposits} />
                    </BorderCard>
                    <BorderCard
                        title='Total Borrowed'>
                        <LineChart
                            data={dailyBorrows} />
                    </BorderCard>
                    <BorderCard
                        title='APY'>
                        <ColumnChart
                            data={apy} />
                    </BorderCard>
                    <BorderCard
                        title='Utilization Rate'>
                        <ColumnChart
                            data={apy} />
                    </BorderCard>
                </div>
                <div className='mt-4'>
                    <BorderCard
                        title='Liquidations'>
                        <LineChart
                            data={dailyLiquidation}
                            xgrid={false}
                            ygrid={true} />
                    </BorderCard>
                </div>
                <div className='grid grid-cols-1 xl:grid-cols-2 h-full gap-4 mt-4'>
                    <BorderCard
                        title='Largest Depositors'>
                        <div className='flex justify-between mt-8 mb-3'>
                            <p className='text-secondary font-lufga'>Address</p>
                            <p className='text-secondary font-lufga'>Amount</p>
                        </div>
                        <div className='flex flex-col'>
                            {
                                depositors.map((item: LargestUsers, index) => (
                                    <div key={index} className='flex justify-between py-3 border-t-[1px] border-[#212325]'>
                                        <p className='text-secondary text-opacity-70 font-lufga'>{formatAddress(item.user)}</p>
                                        <p className='text-secondary font-lufga'>${formatNumber(item.totalUSD, 2)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </BorderCard>
                    <BorderCard
                        title='Largest Borrowers'>
                        <div className='flex justify-between mt-8 mb-3'>
                            <p className='text-secondary font-lufga'>Address</p>
                            <p className='text-secondary font-lufga'>Amount</p>
                        </div>
                        <div className='flex flex-col'>
                            {
                                borrowers.map((item: LargestUsers, index) => (
                                    <div key={index} className='flex justify-between py-3 border-t-[1px] border-[#212325]'>
                                        <p className='text-secondary text-opacity-70 font-lufga'>{formatAddress(item.user)}</p>
                                        <p className='text-secondary font-lufga'>${formatNumber(item.totalUSD, 2)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </BorderCard>
                </div>
            </div >

        </>
    );
}

export default Analytics;
