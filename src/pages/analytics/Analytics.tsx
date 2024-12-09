import { useEffect, useState } from 'react';
import BorderCard from '../../components/analytics/BorderCard';
import ColumnChart from '../../components/analytics/ColumnChart';
import LineChart from '../../components/analytics/LineChart';
import PolarAreaChart from '../../components/analytics/PolarArea';
import Navbar from '../../layouts/Navbar';
import {
  formatAddress,
  formatNumber,
  getWeeklyData,
  WeeklyData,
} from '../../utils/functions';
import { useAccount } from 'wagmi';
import { colorList } from '../../utils/constants/colorList';
import { LargestUsers } from '../../utils/types';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
// import { motion } from 'framer-motion';

interface APYData {
  name: string;
  value: number;
}

function Analytics() {
  const { chainId } = useAccount();
  const [tvlList, setTvlList] = useState<
    { name: any; value: number; color: string }[]
  >([]);
  const [usersActivityList, setUsersActivityList] = useState<
    { name: any; value: number; color: string }[]
  >([]);
  const [depositors, setDepositors] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [dailyTVL, setDailyTVL] = useState([]);
  const [weeklyTVL, setWeeklyTVL] = useState<WeeklyData[]>([]);
  const [dailyUsers, setDailyUsers] = useState([]);
  const [weeklyUsers, setWeeklyUsers] = useState<WeeklyData[]>([]);
  const [dailyDeposits, setDailyDeposits] = useState([]);
  const [weeklyDeposits, setWeeklyDeposits] = useState<WeeklyData[]>([]);
  const [dailyBorrows, setDailyBorrows] = useState([]);
  const [weeklyBorrows, setWeeklyBorrows] = useState<WeeklyData[]>([]);
  const [dailyLiquidation, setDailyLiquidations] = useState([]);
  const [weeklyLiquidation, setWeeklyLiquidations] = useState<WeeklyData[]>([]);
  const [apyList, setAPYList] = useState<APYData[]>([]);
  const [rateList, setRateList] = useState<APYData[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_API;
  const [period, setPeriod] = useState<string>('daily');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: sevenDaysAgo,
    endDate: new Date(),
  });

  useEffect(() => {
    const chain = chainId === 998 ? 'hyperEvmTestnet' : 'arbitrum';
    const startDate = dateRange?.startDate?.toISOString().split('T')[0];
    const endDate = dateRange?.endDate?.toISOString().split('T')[0];
    const today = new Date();

    // Get TVL Composition
    fetch(`${backendUrl}/analytics/tvl-composition?chain=${chain}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          const updatedTvlList = result.data.map(
            (item: any, index: number) => ({
              name: item.assetSymbol,
              value: Number(item.tvlComp),
              color: colorList[index],
            }),
          );
          setTvlList(updatedTvlList);
        }
      })
      .catch((error) => console.error(error));

    // Get Users Activity
    fetch(`${backendUrl}/analytics/users-activity?chain=${chain}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          const list = result.data.map((item: any, index: number) => ({
            name: item.event === 'LiquidationCall' ? 'Liquidation' : item.event,
            value: Number(item.composition),
            color: colorList[index],
          }));
          setUsersActivityList(list);
        }
      })
      .catch((error) => console.error(error));

    // Get Largest Users
    fetch(`${backendUrl}/analytics/largest-users?chain=${chain}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDepositors(result.depositors);
          setBorrowers(result.borrowers);
        }
      })
      .catch((error) => console.error(error));

    // Get Daily TVL
    fetch(
      `${backendUrl}/analytics/daily-tvl?chain=${chain}&startDate=${startDate}&endDate=${endDate}`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDailyTVL(result.data);
          const weeklyData = getWeeklyData(result.data);
          setWeeklyTVL(weeklyData);
        }
      })
      .catch((error) => console.error(error));

    // Get Daily Users
    fetch(
      `${backendUrl}/analytics/daily-users?chain=${chain}&startDate=${startDate}&endDate=${endDate}`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDailyUsers(result.data);
          const weeklyData = getWeeklyData(result.data);
          setWeeklyUsers(weeklyData);
        }
      })
      .catch((error) => console.error(error));

    // Get Daily Volume - Supply
    fetch(
      `${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=${startDate}&endDate=${endDate}&type=Supply`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDailyDeposits(result.data);
          const weeklyData = getWeeklyData(result.data);
          setWeeklyDeposits(weeklyData);
        }
      })
      .catch((error) => console.error(error));

    // Get Daily Volume - Borrow
    fetch(
      `${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=${startDate}&endDate=${endDate}&type=Borrow`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDailyBorrows(result.data);
          const weeklyData = getWeeklyData(result.data);
          setWeeklyBorrows(weeklyData);
        }
      })
      .catch((error) => console.error(error));

    // Get Daily Volume - Liquidations
    fetch(
      `${backendUrl}/analytics/daily-volume?chain=${chain}&startDate=${startDate}&endDate=${endDate}&type=LiquidationCall`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setDailyLiquidations(result.data);
          const weeklyData = getWeeklyData(result.data);
          setWeeklyLiquidations(weeklyData);
        }
      })
      .catch((error) => console.error(error));

    // Get APY
    fetch(
      `${backendUrl}/analytics/apy?chain=${chain}&date=${today.toISOString().split('T')[0]}`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          let supplyList: APYData[] = [];
          let borrowList: APYData[] = [];
          result.data.forEach((item: any) => {
            supplyList.push({
              name: item.assetSymbol,
              value: item.supplyAPY.toFixed(2),
            });
            borrowList.push({
              name: item.assetSymbol,
              value: item.borrowAPY.toFixed(2),
            });
          });
          setAPYList([...supplyList, ...borrowList]);
        }
      })
      .catch((error) => console.error(error));

    // Get APY
    fetch(
      `${backendUrl}/analytics/rate?chain=${chain}&date=${today.toISOString().split('T')[0]}`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          let list: APYData[] = [];
          result.data.forEach((item: any) => {
            list.push({
              name: item.assetSymbol,
              value: Number(item.rate),
            });
          });
          setRateList(list);
        }
      })
      .catch((error) => console.error(error));
  }, [chainId, dateRange]);

  return (
    <>
      <div className='w-full'>
        <Navbar
          pageTitle={<span className='hidden lg:inline'>Data Analytics</span>}
        />
        <div className='flex items-center gap-2 flex-wrap mt-4 lg:mt-10'>
          <button
            className={`${period === 'daily' ? 'text-secondary' : 'text-secondary/60'} border-secondary/60 border-2 hover:bg-secondary/20 py-3 px-5 font-lufga active:scale-95 duration-200 rounded-lg`}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`${period === 'weekly' ? 'text-secondary' : 'text-secondary/60'} border-secondary/60 border-2 hover:bg-secondary/20 py-3 px-5 font-lufga active:scale-95 duration-200 rounded-lg`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <div className='relative'>
            <Datepicker
              value={dateRange}
              onChange={(newValue: DateValueType) => setDateRange(newValue)}
              useRange={false}
              inputClassName={
                'relative transition-all duration-300 py-3 pl-4 pr-14 w-full border-2 border-secondary/60 rounded-lg bg-primary-light text-secondary/60 font-lufga placeholder-gray-400 disabled:cursor-not-allowed '
              }
              toggleClassName={
                'absolute right-0 h-full px-3 text-secondary/60 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed'
              }
              displayFormat='DD/MM/YY'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-2 h-full gap-4 mt-6'>
          <BorderCard title='TVL Composition'>
            <PolarAreaChart data={tvlList} />
          </BorderCard>
          <BorderCard title='Users Activity'>
            <PolarAreaChart data={usersActivityList} />
          </BorderCard>
          <BorderCard title='TVL'>
            <LineChart
              data={period === 'daily' ? dailyTVL : weeklyTVL}
              tip='TVL'
            />
          </BorderCard>
          <BorderCard title='Total Users'>
            <LineChart
              data={period === 'daily' ? dailyUsers : weeklyUsers}
              tip='Users'
            />
          </BorderCard>
          <BorderCard title='Total Deposits'>
            <LineChart
              data={period === 'daily' ? dailyDeposits : weeklyDeposits}
              tip='Deposits'
            />
          </BorderCard>
          <BorderCard title='Total Borrowed'>
            <LineChart
              data={period === 'daily' ? dailyBorrows : weeklyBorrows}
              tip='Borrows'
            />
          </BorderCard>
          <BorderCard title='APY'>
            <ColumnChart data={apyList} />
          </BorderCard>
          <BorderCard title='Utilization Rate'>
            <ColumnChart data={rateList} />
          </BorderCard>
        </div>
        <div className='mt-4'>
          <BorderCard title='Liquidations'>
            <LineChart
              data={period === 'daily' ? dailyLiquidation : weeklyLiquidation}
              xgrid={false}
              ygrid={true}
              tip='Liquidiations'
            />
          </BorderCard>
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-2 h-full gap-4 mt-4'>
          <BorderCard title='Largest Depositors'>
            <div className='flex justify-between mt-8 mb-3'>
              <p className='text-secondary font-lufga'>Address</p>
              <p className='text-secondary font-lufga'>Amount</p>
            </div>
            <div className='flex flex-col'>
              {depositors.map((item: LargestUsers, index) => (
                <div
                  key={index}
                  className='flex justify-between py-3 border-t-[1px] border-[#212325]'
                >
                  <p className='text-secondary text-opacity-70 font-lufga'>
                    {formatAddress(item.user)}
                  </p>
                  <p className='text-secondary font-lufga'>
                    ${formatNumber(item.totalUSD, 2)}
                  </p>
                </div>
              ))}
            </div>
          </BorderCard>
          <BorderCard title='Largest Borrowers'>
            <div className='flex justify-between mt-8 mb-3'>
              <p className='text-secondary font-lufga'>Address</p>
              <p className='text-secondary font-lufga'>Amount</p>
            </div>
            <div className='flex flex-col'>
              {borrowers.map((item: LargestUsers, index) => (
                <div
                  key={index}
                  className='flex justify-between py-3 border-t-[1px] border-[#212325]'
                >
                  <p className='text-secondary text-opacity-70 font-lufga'>
                    {formatAddress(item.user)}
                  </p>
                  <p className='text-secondary font-lufga'>
                    ${formatNumber(item.totalUSD, 2)}
                  </p>
                </div>
              ))}
            </div>
          </BorderCard>
        </div>
      </div>
    </>
  );
}

export default Analytics;
