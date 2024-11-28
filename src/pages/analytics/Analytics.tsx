
import BorderCard from '../../components/analytics/BorderCard';
import ColumnChart from '../../components/analytics/ColumnChart';
import LineChart from '../../components/analytics/LineChart';
import PolarAreaChart from '../../components/analytics/PolarArea';
import Navbar from '../../layouts/Navbar';
import { apy, depositers, lineChartData, usersActivity } from '../../utils/constants/analytics';
import { tvlcomposition } from '../../utils/constants/analytics';
import { formatAddress, formatNumber } from '../../utils/functions';

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
                            data={lineChartData}
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
                                depositers.map((item, index) => (
                                    <div key={index} className='flex justify-between py-3 border-t-[1px] border-[#212325]'>
                                        <p className='text-secondary text-opacity-70 font-lufga'>{formatAddress(item.address)}</p>
                                        <p className='text-secondary font-lufga'>${formatNumber(item.amount, 2)}</p>
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
                                depositers.map((item, index) => (
                                    <div key={index} className='flex justify-between py-3 border-t-[1px] border-[#212325]'>
                                        <p className='text-secondary text-opacity-70 font-lufga'>{formatAddress(item.address)}</p>
                                        <p className='text-secondary font-lufga'>${formatNumber(item.amount, 2)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </BorderCard>
                </div>
            </div>

        </>
    );
}

export default Analytics;
