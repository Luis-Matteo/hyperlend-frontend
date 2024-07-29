import CardItem from '../components/CardItem';
import PageHeader from '../components/PageHeader';
import SetionTitle from '../components/SetionTitle';
import { formatNumber } from '../utils/functions';
import { openPositions, status } from '../utils/mock';
import graphMockImage from '../assets/img/graph-mock.svg';

function Dashboard() {
  return (
    <div className="flex flex-col">
      <PageHeader
        pageTitle="Dashboard"
      />
      <div className="pt-12 flex flex-col gap-4">
        <div className="flex gap-4 justify-between">
          <CardItem
            className="py-4 px-5 w-2/5"
          >
            <div className="">
              <SetionTitle
                title="Health Factor"
              />
            </div>
          </CardItem>
          <CardItem
            className="py-4 px-5 w-3/5"
          >
            <div className="">
              <SetionTitle
                title="Your Position"
              />
            </div>
          </CardItem>
        </div>
        <CardItem
          className="py-6 px-7"
        >

          <div className="flex gap-32 justify-between">
            <div className="flex flex-col gap-4">
              <SetionTitle
                title="Current Balance"
              />
              <p className="text-white text-[28px] font-medium font-lufga">
                $
                {formatNumber(status.currentBalance, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
                {`${status.currentPrice >= 0 ? '+' : '-'}`}
                $
                {formatNumber(Math.abs(status.currentPrice), 2)}
                {' '}
                (
                {`${status.pricePercent >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.pricePercent), 2)}
                %)
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <SetionTitle
                title="Total Points"
              />
              <p className="text-white text-[28px] font-medium font-lufga">
                $
                {formatNumber(status.totalPoints, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
                {`${status.currentPoints >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.currentPoints), 2)}
                {' '}
                (
                {`${status.pointsPercent >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.pointsPercent), 2)}
                %)
              </p>
            </div>
            <div className="">
              <img src={graphMockImage} alt="" />
            </div>
          </div>
        </CardItem>
        <CardItem
          className="py-6 px-7 flex-1"
        >
          <div className="max-h-[400px] overflow-auto">
            <p className="text-white font-lufga text-2xl pb-4">Open Positions</p>
            <div className="">
              <div className="py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325]">
                <div className="text-white font-lufga text-[11px]">Assets</div>
                <div className="text-white font-lufga text-[11px]">Position ID</div>
                <div className="text-white font-lufga text-[11px]">Value (USD)</div>
                <div className="text-white font-lufga text-[11px]">Tokens</div>
                <div className="text-white font-lufga text-[11px]">ARP</div>
                <div className="text-white font-lufga text-[11px]">Fees Earned</div>
              </div>
              <div>
                {
                  (openPositions || []).map((item) => (
                    <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325]" key={`position${item.positionId}`}>
                      <div className="text-white font-lufga">{item.assets}</div>
                      <div className="text-white font-lufga">
                        {item.positionId.slice(0, 8)}
                        ...
                      </div>
                      <div className="text-white font-lufga">{formatNumber(item.value, 2)}</div>
                      <div className="text-white font-lufga">{formatNumber(item.tokens, 4)}</div>
                      <div className="text-success font-lufga">
                        {formatNumber(item.arp, 2)}
                        %
                      </div>
                      <div className="text-success font-lufga">
                        {`${item.feesEarned >= 0 ? '+' : '-'}`}
                        $
                        {formatNumber(Math.abs(item.feesEarned), 4)}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </CardItem>
      </div>
    </div>
  );
}

export default Dashboard;
