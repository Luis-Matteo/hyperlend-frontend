import { useState, useEffect, useMemo } from 'react';
import Navbar from '../../../layouts/Navbar';
import CardItem from '../../../components/common/CardItem';
import { useParams } from 'react-router-dom';
import { useSwitchChain, useAccount, useBalance } from 'wagmi';
import ReactGA from 'react-ga4';
import { tokenDetailButton } from '../../../utils/constants/constants';
import {
  formatNumber,
  formatAddress,
  calculateApyIsolated
} from '../../../utils/functions';
import BorrowInfoChart from '../../../components/charts/BorrowInfoChart';
import InterestRateModelChart from '../../../components/charts/InterestRateModelChart';
import { TokenActionsProps } from '../../../utils/types';
import topRightArrowImage from '../../../assets/icons/top-right-arrow.svg';
import ShareImageModal from '../../../components/common/ShareImageModal';
import TokenActions from '../../../components/markets/TokenActions';
import Button from '../../../components/common/Button';

import {
  tokenNameMap,
  iconsMap,
  tokenDecimalsMap,
  networkChainId,
  tokenFullNameMap
} from '../../../utils/config';

import {
  useUserPositionsData,
  useUserAccountData,
} from '../../../utils/user/core/positions';

import { useUserTokenBalance } from '../../../utils/user/wallet';

import { useProtocolPairsData, preparePairData } from '../../../utils/protocol/isolated/pairs';
import { useAssetPrice } from '../../../utils/protocol/isolated/prices';

import { getTokenPrecision } from '../../../utils/user/core/functions/utils';

function TokenDetail() {
  const { pairAddress = '' } = useParams();
  ReactGA.send({ hitType: 'pageview', page: '/token-details-isolated', title: pairAddress });

  const [collateralAmount, setCollateralAmount] = useState(0);
  const [collateral, setCollateral] = useState('add');
  const [shareImageModalStatus, setShareImageModalStatus] =
    useState<boolean>(false);

  const availableAmount = 9481;

  const toggleModal = () => {
    setShareImageModalStatus(!shareImageModalStatus);
  };

  const [activeButton, setActiveButton] = useState(1);

  const { switchChain } = useSwitchChain();
  const { address, chainId, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [isConnected, chainId]);

  //get info for this pair
  const pairs = useProtocolPairsData(pairAddress);

  // Extract all oracle addresses from pairs
  const oracleAddresses = useMemo(() => {
    if (!pairs || !pairs.pairsDataMap) return [];
    return Object.keys(pairs.pairsDataMap).flatMap((pair) => [
      pairs.pairsDataMap[pair as string].exchangeRate.chainlinkAssetAddress,
      pairs.pairsDataMap[pair as string].exchangeRate
        .chainlinkCollateralAddress,
    ]);
  }, [pairs]);
  const { priceDataMap } = useAssetPrice(oracleAddresses);

  const market = preparePairData(pairs.pairsDataMap[pairAddress], priceDataMap);

  //refetch on update
  const { data: userWalletTokenBalance } = useUserTokenBalance(
    isConnected,
    market.asset,
    address,
  );
  const { data: userEthBalance } = useBalance({
    address: address,
  });
  const { userAccountData } = useUserAccountData(address);

  const userPositionsData = useUserPositionsData(isConnected, address);

  function handleDataFromActions(data: any) {
    console.log(data);
  }

  const getAvailableAmount: any = (actionType: string) => {
    // return calculateAvailableBalance(
    //   token,
    //   userPositionsData,
    //   userAccountData,
    //   priceDataMap,
    //   protocolAssetReserveData,
    //   reserveDataMap,
    //   userEthBalance,
    //   userWalletTokenBalance,
    //   actionType,
    // );
    return 0;
  };

  const interestRateDataMap = {
    supply: 0,
    borrow: 0
  }

  const getDailyEarnings: any = (actionType: string) => {
    if (actionType == 'supply' || actionType == 'withdraw') {
      return (
        ((market.totalAssetsUsd || 0) * (interestRateDataMap.supply / 100)) /
        365
      );
    }

    if (actionType == 'borrow' || actionType == 'repay') {
      return (
        (-1 *
          (market.totalBorrowedUsd || 0) *
          (interestRateDataMap.borrow / 100)) /
        365
      );
    }
  };

  const supplied = {
    balance: 0
  }
  const borrowed = {
    balance: 0
  }

  const [actionData, setActionData] = useState<TokenActionsProps>({
    availableAmountTitle: 'Suppliable',
    availableAmount: getAvailableAmount('supply'),
    totalApy: interestRateDataMap.supply,
    percentBtn: 100,
    protocolBalanceTitle: `Supplied balance (${market.assetName})`,
    protocolBalance: supplied?.balance || 0,
    dailyEarning: getDailyEarnings('supply'),
    btnTitle: 'Supply',
    token: market.asset,
    isCollateralEnabled: false,
    handleDataFromActions: handleDataFromActions,
  });

  useEffect(() => {
    handleButtonClick(activeButton);
  }, [userWalletTokenBalance, userEthBalance, userPositionsData]);

  const handleCollateral = () => {
    if (collateral === 'add') {
      console.log('add collateral');
    } else if (collateral === 'remove') {
      console.log('remove collateral');
    } else {
      console.log('no collateral');
    }
  }

  const handleButtonClick = (button: number) => {
    setActiveButton(button);

    let newActionData: any;
    switch (button) {
      case 1:
        newActionData = {
          availableAmountTitle: 'Suppliable',
          availableAmount: getAvailableAmount('supply'),
          totalApy: interestRateDataMap.supply,
          percentBtn: 100,
          protocolBalanceTitle: `Supplied balance (${market.assetName})`,
          protocolBalance: supplied?.balance || 0,
          dailyEarning: getDailyEarnings('supply'),
          btnTitle: 'Supply',
          token: market.asset,
          isCollateralEnabled: false,
          handleDataFromActions: handleDataFromActions,
        };
        break;
      case 2:
        newActionData = {
          availableAmountTitle: 'Withdrawable',
          availableAmount: getAvailableAmount('withdraw'),
          totalApy: interestRateDataMap.supply,
          percentBtn: 100,
          protocolBalanceTitle: `Supplied balance (${market.assetName})`,
          protocolBalance: supplied?.balance || 0,
          dailyEarning: getDailyEarnings('withdraw'),
          btnTitle: 'Withdraw',
          token:  market.asset,
          isCollateralEnabled: false, //not used
          handleDataFromActions: handleDataFromActions,
        };
        break;
      case 3:
        newActionData = {
          availableAmountTitle: 'Borrowable',
          availableAmount: getAvailableAmount('borrow'),
          totalApy: interestRateDataMap.borrow,
          percentBtn: 100,
          protocolBalanceTitle: `Total borrowed (${market.assetName})`,
          protocolBalance: borrowed?.balance || 0,
          dailyEarning: getDailyEarnings('borrow'),
          btnTitle: 'Borrow',
          token: market.asset,
          isCollateralEnabled: false, //not used
          handleDataFromActions: handleDataFromActions,
        };
        break;
      case 4:
        newActionData = {
          availableAmountTitle: 'Repayable',
          availableAmount: getAvailableAmount('repay'),
          totalApy: interestRateDataMap.borrow,
          percentBtn: 100,
          protocolBalanceTitle: `Total borrowed (${market.assetName})`,
          protocolBalance: borrowed?.balance || 0,
          dailyEarning: getDailyEarnings('repay'),
          btnTitle: 'Repay',
          token: market.asset,
          isCollateralEnabled: false,
          handleDataFromActions: handleDataFromActions,
        };
        break;
      default:
        break;
    }

    if (JSON.stringify(actionData) !== JSON.stringify(newActionData)) {
      setActionData(newActionData); //prevent Maximum update depth exceeded errors
    }
  };

  const tokenPrice = Number(assetPriceUsd) / Math.pow(10, 8);
  const totalSuppliedTokens = Number(market.totalAssets)
  const totalBorrowedTokens =Number(market.totalBorrowed)
  const totalLiquidityToken = totalSuppliedTokens - totalBorrowedTokens;
  const configuration = {
    supplyCap: 0,
    borrowCap: 0
  }

  const supplies = [
    {
      name: 'Reserves',
      value: formatNumber(totalLiquidityToken, 4),
    },
    [
      {
        name: 'Asset Price',
        value: `Asset Price`,
      },
      {
        name: 'Collateral Price',
        value: `Collateral Price`,
      },
    ],
    {
      name: 'Liquidity',
      value: `$${formatNumber(totalLiquidityToken * tokenPrice, 2)}`,
    },
    {
      name: 'Utilization rate',
      value: `${formatNumber((totalBorrowedTokens / totalSuppliedTokens) * 100, 2)}%`,
    },
  ];

  const supplyInfos = [
    {
      name: `Total supply (${market.assetName})`,
      value: `${formatNumber(totalSuppliedTokens, 2)}`,
    },
    {
      name: 'Total supply (USD)',
      value: `$${formatNumber(totalSuppliedTokens * tokenPrice, 2)}`,
    },
    {
      name: 'APY',
      value: `${formatNumber(interestRateDataMap.supply, 2)}%`,
    },
    {
      name: 'LTV',
      value: `${market.ltv}%`,
    },
  ];

  const borrowInfos = [
    {
      name: `Total borrrow (${market.assetName})`,
      value: `${formatNumber(totalBorrowedTokens, 2)}`,
    },
    {
      name: 'Total borrrow (USD)',
      value: `$${formatNumber(totalBorrowedTokens * tokenPrice, 2)}`,
    },
    {
      name: 'APY',
      value: `${formatNumber(interestRateDataMap.borrow, 2)}%`,
    },
    {
      name: 'Liquidation Threshold',
      value: `${market.ltv * 100}%`,
    },
    {
      name: 'Liquidation Penalty',
      value: `${market.liquidationPenalty * 100}%`,
    },
  ];

  const marketDetails = [
    {
      name: 'Token contract',
      link: `https://testnet.purrsec.com/address/${market.asset}`,
      value: market.asset,
    },
    {
      name: 'Asset oracle',
      link: `https://testnet.purrsec.com/address/${pair.exchangeRate.oracle}`,
      value: pair.exchangeRate.oracle,
    },
    {
      name: 'Supply cap',
      value: `${formatNumber(configuration.supplyCap, 2)} ${market.assetName}`,
    },
    {
      name: 'Supply cap reached',
      value: `${formatNumber((totalSuppliedTokens / configuration.supplyCap) * 100, 2)}%`,
    },
    {
      name: 'Borrow cap',
      value: `${configuration.borrowCap > 0 ? formatNumber(configuration.borrowCap, 2) : '∞'} ${market.assetName}`,
    },
    {
      name: 'Borrow cap reached',
      value: `${configuration.borrowCap > 0 ? formatNumber((totalBorrowedTokens / configuration.borrowCap) * 100, 2) : 0}%`,
    },
    {
      name: 'Collateral factor',
      value: `${formatNumber(market.ltv / 100, 4)}%`,
    },
    {
      name: 'Reserve factor',
      value: `${formatNumber(pair.interestRate.feeToProtocolRate / 100, 4)}%`,
    },
  ];

  return (
    <div className='w-full'>
      <Navbar
        pageTitle={`${market.assetSymbol} / ${market.collateralSymbol}`}
        pageIcon={
          <div className='flex -space-x-3'>
            <img src={market.assetIcon} height='30px' width='30px' alt='' />
            <img src={market.collateralIcon} height='30px' width='30px' alt='' />
          </div>
        }
        back={true}
      />
      <CardItem className='p-4 lg:p-12 my-6 hidden lg:block overflow-hidden'>
        <div className='flex gap-16 items-center w-full overflow-auto'>
          {(supplies || []).map((supply, index) => (
            <div className='font-lufga' key={index}>
              <p className={`text-xs pb-4 text-[#E1E1E1]`}>{supply.name}</p>
              <p className='text-2xl text-white whitespace-nowrap'>{supply.value}</p>
            </div>
          ))}
        </div>
      </CardItem>
      <div className='lg:hidden my-8 grid grid-cols-1 md:grid-cols-2 gap-3'>
        {(supplies || []).map((supply, index) => (
          <CardItem
            className='px-[32px] py-[22px] flex flex-col gap-2'
            key={index}
          >
            <p className='text-xs font-light font-lufga text-[#E1E1E1] italic'>
              {supply.name}
            </p>
            <p className='text-3xl font-medium font-lufga text-white'>
              {supply.value}
            </p>
          </CardItem>
        ))}
      </div>
      <div className='flex flex-col-reverse lg:flex-row lg:gap-8 w-full'>
        <div className='flex-grow w-auto overflow-x-auto'>
          <CardItem className='p-4 lg:p-8 mb-6'>
            <div className='flex justify-between items-center'>
              <p className='text-[#797979] text-xl font-lufga'>Supply Info</p>
              <ul className='flex gap-4 items-center'>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>30D</p>
                </button>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>6M</p>
                </button>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>1Y</p>
                </button>
              </ul>
            </div>
            <div className='flex items-center mt-8 mb-8'>
              <span className='w-2 h-2 bg-[#2DC24E] rounded-full mr-2'></span>
              <p className='text-xs text-[#797979] font-lufga'>Supply APY</p>
            </div>
            <div className='flex justify-between gap-8 md:gap-12 w-full overflow-auto'>
              {(supplyInfos || []).map((supplyInfo, index) => (
                <div className='font-lufga' key={index}>
                  <p className='text-[9px] pb-2 text-[#E1E1E1] whitespace-nowrap'>
                    {supplyInfo.name}
                  </p>
                  <p className='text-2xl text-white'>{supplyInfo.value}</p>
                </div>
              ))}
            </div>
            <BorrowInfoChart type='supply' token={pairAddress} />
          </CardItem>
          <CardItem className='p-4 lg:p-8 mb-6'>
            <div className='flex justify-between items-center'>
              <p className='text-[#797979] text-xl font-lufga'>Borrow Info</p>
              <ul className='flex gap-4 items-center'>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>30D</p>
                </button>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>6M</p>
                </button>
                <button className='px-4 py-1.5 bg-[#081916] rounded-full'>
                  <p className='text-[#797979] text-sm font-lufga'>1Y</p>
                </button>
              </ul>
            </div>
            <div className='flex items-center mt-8 mb-8'>
              <span className='w-2 h-2 bg-[#302DC2] rounded-full mr-2'></span>
              <p className='text-xs text-[#797979] font-lufga'>Borrow APY</p>
            </div>
            <div className='flex justify-between gap-8 md:gap-12 w-full overflow-auto'>
              {(borrowInfos || []).map((borrowInfo, index) => (
                <div className='font-lufga' key={index}>
                  <p className='text-[9px] pb-2 text-[#E1E1E1] whitespace-nowrap'>
                    {borrowInfo.name}
                  </p>
                  <p className='text-2xl text-white'>{borrowInfo.value}</p>
                </div>
              ))}
            </div>
            <BorrowInfoChart type='borrow' token={pairAddress} />
          </CardItem>
          <CardItem className='p-4 lg:p-8 mb-6'>
            <div className='flex justify-between items-center flex-wrap'>
              <p className='text-[#797979] text-xl font-lufga'>
                Interest Rate Model
              </p>
              <ul className='flex gap-4 items-center'>
                <div className='flex gap-2 items-center'>
                  <span className='w-2 h-2 bg-[#302DC2] rounded-full'></span>
                  <p className='text-xs text-[#797979]'>Utilization rate</p>
                </div>
                <div className='flex gap-2 items-center'>
                  <span className='w-2 h-2 bg-[#f10750] rounded-full'></span>
                  <p className='text-xs text-[#797979]'>Borrow APY</p>
                </div>
                <div className='flex gap-2 items-center'>
                  <span className='w-2 h-2 bg-[#38b2ac] rounded-full'></span>
                  <p className='text-xs text-[#797979]'>Supply APY</p>
                </div>
              </ul>
            </div>
            <InterestRateModelChart
              token={pairAddress}
              currentUtilization={
                (totalBorrowedTokens / totalSuppliedTokens) * 100
              }
            />
          </CardItem>
          <CardItem className='p-4 lg:p-8 mb-6'>
            <div className='flex justify-between items-center mb-8'>
              <p className='text-[#797979] text-xl font-lufga'>
                Market Details
              </p>
            </div>
            {(marketDetails || []).map((item, index) => (
              <div key={index}>
                <div className='flex justify-between items-center'>
                  <p className='text-base font-lufga text-[#CAEAE5B2]'>
                    {item.name}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className=''
                    >
                      <p className='block sm:hidden lg:block xl:hidden text-base font-lufga text-[#CAEAE5] hover:text-gray-light'>
                        {formatAddress(item.value)}
                      </p>
                      <p className='hidden sm:block lg:hidden xl:block text-base font-lufga text-[#CAEAE5] hover:text-gray-light'>
                        {item.value}
                      </p>
                    </a>
                  ) : (
                    <p className='text-base font-lufga text-[#CAEAE5] '>
                      {item.value}
                    </p>
                  )}
                </div>
                <hr className='mt-4 mb-4 text-[#212325] border-t-[0.25px]' />
              </div>
            ))}
          </CardItem>
        </div>
        <div className='w-full lg:w-1/3 lg:min-w-[360px]'>
          <div className='sticky top-0 '>
            <CardItem className='p-4 lg:p-8 font-lufga'>
              <div className='w-full grid grid-cols-4 text-center'>
                {tokenDetailButton.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleButtonClick(button.id)}
                  >
                    <p
                      className={`text-base capitalize transition-colors duration-300 ease-in-out ${activeButton === button.id ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
                    >
                      {button.label}
                    </p>
                    <hr
                      className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${activeButton === button.id ? 'text-white' : 'text-[#546764]'}`}
                    />
                  </button>
                ))}
              </div>
              <TokenActions {...actionData} />
            </CardItem>
            {
              isolated && (
                <CardItem className='p-4 lg:p-8 mt-4'>
                  <div className='w-full grid grid-cols-2 text-center'>
                    <button
                      onClick={() => setCollateral('add')}
                    >
                      <p
                        className={`text-base font-lufga capitalize transition-colors duration-300 ease-in-out ${collateral === 'add' ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
                      >
                        Add collateral
                      </p>
                      <hr
                        className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${collateral === 'add' ? 'text-white' : 'text-[#546764]'}`}
                      />
                    </button>
                    <button
                      onClick={() => setCollateral('remove')}
                    >
                      <p
                        className={`text-base font-lufga capitalize transition-colors duration-300 ease-in-out ${collateral === 'remove' ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
                      >
                        Remove collateral
                      </p>
                      <hr
                        className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${collateral === 'remove' ? 'text-white' : 'text-[#546764]'}`}
                      />
                    </button>
                  </div>
                  <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
                    <div className='flex gap-3 items-center p-3'>
                      <img
                        src={iconsMap[tokenNameMap[market.collateralName]]}
                        height={'30px'}
                        width={'30px'}
                        alt='coinIcon'
                      />
                      <p className='text-base text-[#CAEAE566] w-[120px]'>
                        <input
                          type='number'
                          className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left min-w-[120px]'
                          value={collateralAmount}
                          onChange={(e) => {
                            setCollateralAmount(
                              Number(e.target.value) >= availableAmount
                                ? availableAmount
                                : Number(e.target.value),
                            );
                          }}
                          style={{
                            background: 'transparent',
                            outline: 'none',
                            boxShadow: 'none',
                            width: 'auto',
                            minWidth: '50px',
                          }}
                        />
                      </p>
                    </div>
                    <div className='bg-[#081916] px-4 py-3 rounded'>
                      <button
                        className='text-base text-[#CAEAE566]'
                        onClick={() => {
                          setCollateralAmount(availableAmount);
                        }}
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div className='flex justify-between items-center'>
                      <p className='text-base font-lufga text-[#4B5E5B]'>
                        Suppliable amount
                      </p>
                      <p className='text-base font-lufga text-[#CAEAE5]'>
                        {formatNumber(
                          Number(availableAmount),
                          getTokenPrecision(market.collateral, priceDataMap),
                          true,
                        )} {market.collateralName}
                      </p>
                    </div>
                  </div>
                  <Button
                    title={`${collateral} collateral`}
                    variant='secondary'
                    onClick={handleCollateral}
                  />
                </CardItem>
              )}
            <button
              className='flex gap-4 items-center px-4 py-2 my-4 mx-auto'
              onClick={() => setShareImageModalStatus(true)}
            >
              <p className='font-lufga text-[#797979]'>Share</p>
              <img className='' src={topRightArrowImage} />
            </button>
          </div>
        </div>
      </div>
      {
        shareImageModalStatus && (
          <ShareImageModal
            token={market.collateralName}
            apy={formatNumber(actionData?.totalApy, 3)}
            dailyEarnings={formatNumber(actionData?.dailyEarning, 3)}
            onClose={toggleModal}
          />
        )
      }
    </div >
  );
}

export default TokenDetail;
