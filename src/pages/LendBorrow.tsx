import { useState } from 'react';
import LendControl from '../components/lend-borrow/LendControl';
import CardItem from '../components/common/CardItem';
import { assets } from '../utils/mock';
import { formatNumber, formatUnit } from '../utils/functions';
import Navbar from '../layouts/Navbar';
import Modal from '../components/common/Modal';
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

function LendBorrow() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<string>('borrow');
  const [stable, setStable] = useState<boolean>(false);
  const [personal, setPersonal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const closeModal = () => setModalStatus(false);

  const { data } = useReadContract(
    isConnected && address
      ?
      {
        abi: erc20Abi,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        functionName: 'balanceOf',
        args: [address],
      } :
      undefined
  );

  // const result = useReadContract({
  //   abi: erc20Abi,
  //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //   functionName: 'totalSupply'
  // });

  return (
    <>
      <div className="w-full">
        <Navbar
          pageTitle="Lend & Borrow"
        />
        <LendControl
          status={status}
          setStatus={setStatus}
          stable={stable}
          setStable={setStable}
          personal={personal}
          setPersonal={setPersonal}
        />
        <CardItem
          className="py-6 px-7 flex-1"
        >
          <div className="max-h-[600px] overflow-auto">
            <p className="text-white font-lufga text-2xl pb-4">Open Positions {data?.valueOf().toString()}</p>
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
                  (assets || []).filter(item => item.status === status).map((item, key) => (
                    <div className=" grid grid-cols-6 items-center py-[14px] px-2.5 border-b-[1px] border-[#212325]" key={key}>
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
                      <button className="text-success font-lufga"
                        onClick={() => setModalStatus(true)}>
                        {
                          item.status === 'borrow'
                            ? 'Borrow'
                            : 'Lend'
                        }
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </CardItem>
      </div>
      {
        modalStatus &&
        <Modal 
        token={"0xdac17f958d2ee523a2206206994597c13d831ec7"}
        modalType={"supply"}
        onClose={closeModal} />
      }
    </>
  );
}

export default LendBorrow;
