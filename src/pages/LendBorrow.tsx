import LendControl from '../components/LendControl';
import PageHeader from '../components/PageHeader';
import CardItem from '../components/CardItem';
import { assets } from '../utils/mock';
import { formatNumber, formatUnit } from '../utils/functions';

function LendBorrow() {
  return (
    <div className="w-full">
      <PageHeader
        pageTitle="Lend & Borrow"
      />
      <LendControl />
      <CardItem
        className="py-6 px-7 flex-1"
      >
        <div className="max-h-[600px] overflow-auto">
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
                (assets || []).map((item) => (
                  <div className=" grid grid-cols-6 items-center py-[14px] px-2.5 border-b-[1px] border-[#212325]">
                    <div className="text-white font-lufga">{item.assets}</div>
                    <div className="text-white font-lufga">
                      <p className="">
                        {formatUnit(item.totalSupplied)}
                      </p>
                      <p className="">
                        {formatUnit(item.totalSupplied * 3)}
                      </p>
                    </div>
                    <div className="text-white font-lufga">{formatNumber(item.supplyApy, 2)}</div>
                    <div className="text-white font-lufga">
                      <p className="">
                        {formatUnit(item.totalBorrowed)}
                      </p>
                      <p className="">
                        {formatUnit(item.totalBorrowed * 873)}
                      </p>
                    </div>
                    <div className="text-success font-lufga">
                      {formatNumber(item.variable, 2)}
                      %
                    </div>
                    <div className="text-success font-lufga">
                      {
                        item.status === 'borrow'
                          ? 'Borrow'
                          : 'Lend'
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </CardItem>
    </div>
  );
}

export default LendBorrow;
