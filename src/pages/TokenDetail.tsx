import { useState, useEffect } from 'react';
import Navbar from '../layouts/Navbar';
import CardItem from '../components/common/CardItem';
import { useParams } from 'react-router-dom';
import { useSwitchChain, useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import ReactGA from 'react-ga4';

import { formatNumber, decodeConfig } from '../utils/functions';
import BorrowInfoChart from '../components/charts/BorrowInfoChart';
import InterestRateModelChart from '../components/charts/InterestRateModelChart';
import { TokenActionsProps } from '../utils/interfaces';

import {
    tokenNameMap,
    iconsMap, tokenDecimalsMap,
    liqMap, ltvMap, liqPenaltyMap,
    networkChainId
} from '../utils/tokens';

import {
  useUserPositionsData
} from '../utils/userState';

import {
    useProtocolReservesData,
    useProtocolAssetReserveData,
    useProtocolPriceData,
    useProtocolInterestRate
} from '../utils/protocolState';
import TokenActions from '../components/markets/TokenActions';

function TokenDetail() {
    let { token } = useParams();
    token = token || ""

    ReactGA.send({ hitType: "pageview", page: "/token-details", title: token });

    const { switchChain } = useSwitchChain()
    const account = useAccount()

    useEffect(() => {
        if (account.isConnected && account.chainId != networkChainId) {
            switchChain({ chainId: networkChainId });
        }
    }, [account])

    const normalizeDecimalsAmount = (x: number) => {
      return Number(x) / Math.pow(10, tokenDecimalsMap[token])
    }

    const { data: userWalletBalance } = useReadContract(
      account.isConnected && account.address ?
        {
          abi: erc20Abi,
          address: token,
          functionName: 'balanceOf',
          args: [account.address],
        } as any : undefined
    );

    const { reserveDataMap } = useProtocolReservesData();
    const { priceDataMap } = useProtocolPriceData()
    const { interestRateDataMap } = useProtocolInterestRate()
    const protocolAssetReserveData = useProtocolAssetReserveData(token);
    const [activeButton, setActiveButton] = useState(1);
    
    const userPositionsData = useUserPositionsData(account.isConnected, account.address);
    const supplied = userPositionsData.supplied.find(e => e.underlyingAsset == token)
    const borrowed = userPositionsData.borrowed.find(e => e.underlyingAsset == token)

    const [actionData, setActionData] = useState<TokenActionsProps>({
        availableAmountTitle: "Suppliable",
        availableAmount: normalizeDecimalsAmount(Number(userWalletBalance)),
        totalApy: interestRateDataMap[token].supply,
        percentBtn: 100,
        protocolBalanceTitle: `Supplied balance (${tokenNameMap[token]})`,
        protocolBalance: (supplied?.balance || 0),
        dailyEarning: (supplied?.value || 0) * (interestRateDataMap[token].supply / 100) / 365,
        btnTitle: "Supply",
        token: token,
        isCollateralEnabled: supplied?.isCollateralEnabled || false
    });

    useEffect(() => {
      handleButtonClick(activeButton)
    }, [userWalletBalance])

    const handleButtonClick = (button: number) => {
        setActiveButton(button);

        const tokenPrice = (Number(priceDataMap[token]) / Math.pow(10, 8))
        const borrowLiquidity = Number(protocolAssetReserveData.totalAToken - protocolAssetReserveData.totalVariableDebt) / Math.pow(10, tokenDecimalsMap[token])
        switch (button) {
            case 1:
                setActionData({
                    availableAmountTitle: "Suppliable",
                    availableAmount: normalizeDecimalsAmount(Number(userWalletBalance)),
                    totalApy: interestRateDataMap[token].supply,
                    percentBtn: 100,
                    protocolBalanceTitle: `Supplied balance (${tokenNameMap[token]})`,
                    protocolBalance: (supplied?.balance || 0),
                    dailyEarning: (supplied?.value || 0) * (interestRateDataMap[token].supply / 100) / 365,
                    btnTitle: "Supply",
                    token: token,
                    isCollateralEnabled: supplied?.isCollateralEnabled || false
                });
                break;
            case 2:
                setActionData({
                    availableAmountTitle: "Withdrawable",
                    availableAmount: /*(supplied?.balance || 0) > userPositionsData.totalBorrowLimit / tokenPrice ? userPositionsData.totalBorrowLimit / tokenPrice : */(supplied?.balance || 0), //TODO fix this to account for borrow limit correctly
                    totalApy: interestRateDataMap[token].supply,
                    percentBtn: 100,
                    protocolBalanceTitle: `Supplied balance (${tokenNameMap[token]})`,
                    protocolBalance: (supplied?.balance || 0),
                    dailyEarning: (supplied?.value || 0) * (interestRateDataMap[token].supply / 100) / 365,
                    btnTitle: "Withdraw",
                    token: token,
                    isCollateralEnabled: false
                });
                break;
            case 3:
                setActionData({
                  availableAmountTitle: "Borrowable",
                  availableAmount: borrowLiquidity < userPositionsData.totalBorrowLimit / tokenPrice ? borrowLiquidity : userPositionsData.totalBorrowLimit / tokenPrice,
                  totalApy: interestRateDataMap[token].borrow,
                  percentBtn: 100,
                  protocolBalanceTitle: `Total borrowed (${tokenNameMap[token]})`,
                  protocolBalance: (borrowed?.balance || 0),
                  dailyEarning: -1 * (borrowed?.value || 0) * (interestRateDataMap[token].borrow / 100) / 365,
                  btnTitle: "Borrow",
                  token: token,
                  isCollateralEnabled: false
                });
                break;
            case 4:
                setActionData({
                  availableAmountTitle: "Repayable",
                  availableAmount: (borrowed?.balance || 0) > normalizeDecimalsAmount(Number(userWalletBalance)) ? normalizeDecimalsAmount(Number(userWalletBalance)) : (borrowed?.balance || 0),
                  totalApy: interestRateDataMap[token].borrow,
                  percentBtn: 100,
                  protocolBalanceTitle: `Total borrowed (${tokenNameMap[token]})`,
                  protocolBalance: (borrowed?.balance || 0),
                  dailyEarning: -1 * (borrowed?.value || 0) * (interestRateDataMap[token].borrow / 100) / 365,
                  btnTitle: "Repay",
                  token: token,
                  isCollateralEnabled: false
                });
                break;
            default:
                break;
        }
    };

    const buttons = [
        { id: 1, label: 'Supply' },
        { id: 2, label: 'Withdraw' },
        { id: 3, label: 'Borrow' },
        { id: 4, label: 'Repay' }
    ];

    const tokenPrice = Number(priceDataMap[token]) / Math.pow(10, 8)
    const totalSuppliedTokens = Number(protocolAssetReserveData.totalAToken) / Math.pow(10, tokenDecimalsMap[token])
    const totalBorrowedTokens = Number(protocolAssetReserveData.totalVariableDebt) / Math.pow(10, tokenDecimalsMap[token])
    const totalLiquidityToken = totalSuppliedTokens - totalBorrowedTokens;
    const configuration = decodeConfig(reserveDataMap[token].configuration.data)

    const supplies = [
        {
            name: 'Reserves',
            value: formatNumber(totalLiquidityToken, 4)
        },
        {
            name: 'Price',
            value: `$${formatNumber(tokenPrice, 2)}`
        },
        {
            name: 'Liquidity',
            value: `$${formatNumber(totalLiquidityToken * tokenPrice, 2)}`
        },
        {
            name: 'Utilization rate',
            value: `${formatNumber((totalBorrowedTokens / totalSuppliedTokens) * 100, 2)}%`
        }
    ]

    const supplyInfos = [
        {
            name: `Total supply (${tokenNameMap[token]})`,
            value: `${formatNumber(totalSuppliedTokens, 2)}`
        },
        {
            name: 'Total supply (USD)',
            value: `$${formatNumber(totalSuppliedTokens * tokenPrice, 2)}`
        },
        {
            name: 'APY',
            value: `${formatNumber(interestRateDataMap[token].supply, 2)}%`
        },
        {
            name: 'LTV',
            value: `${ltvMap[token] * 100}%`
        }
    ]

    const borrowInfos = [
        {
            name: `Total borrrow (${tokenNameMap[token]})`,
            value: `${formatNumber(totalBorrowedTokens, 2)}`
        },
        {
            name: 'Total borrrow (USD)',
            value: `$${formatNumber(totalBorrowedTokens * tokenPrice, 2)}`
        },
        {
            name: 'APY',
            value: `${formatNumber(interestRateDataMap[token].borrow, 2)}%`
        },
        {
            name: 'Liquidation Threshold',
            value: `${liqMap[token] * 100}%`
        },
        {
            name: 'Liquidation Penalty',
            value: `${liqPenaltyMap[token] * 100}%`
        }
    ]

    const marketDetails = [
        {
            name: "Token contract",
            link: `https://arbiscan.io/token/${token}`,
            value: token
        },
        {
            name: 'Supply cap',
            value: `${formatNumber(configuration.supplyCap, 2)} ${tokenNameMap[token]}`
        },
        {
            name: 'Supply cap reached',
            value: `${formatNumber(totalSuppliedTokens / configuration.supplyCap * 100, 2)}%`
        },
        {
            name: 'Borrow cap',
            value: `${configuration.borrowCap > 0 ? formatNumber(configuration.borrowCap, 2) : "∞"} ${tokenNameMap[token]}`
        },
        {
            name: 'Borrow cap reached',
            value: `${configuration.borrowCap > 0 ? formatNumber(totalBorrowedTokens / configuration.borrowCap * 100, 2) : 0}%`
        },
        {
            name: 'Collateral factor',
            value: `${formatNumber(configuration.ltv / 100, 4)}%`
        },
        {
            name: 'Reserve factor',
            value: `${formatNumber(configuration.reserveFactor / 100, 4)}%`
        }
    ]

    return (
        <div className="w-full">
            <Navbar pageTitle={tokenNameMap[token]} pageIcon={iconsMap[tokenNameMap[token]]} />
            <CardItem className="p-12 my-6">
                <div className="flex gap-20">
                    {(supplies || []).map((supply, index) => (
                        <div className="font-lufga" key={index}>
                            <p className="text-xs pb-4 text-[#E1E1E1]">{supply.name}</p>
                            <p className="text-3xl text-white">{supply.value}</p>
                        </div>
                    ))}
                </div>
            </CardItem>
            <div className="flex gap-8">
                <div className="w-2/3">
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Supply Info</p>
                            <ul className="flex gap-4 items-center">
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">30D</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">6M</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">1Y</p>
                                </button>
                            </ul>
                        </div>
                        <div className='flex items-center mt-8 mb-8'>
                            <span className="w-2 h-2 bg-[#2DC24E] rounded-full mr-2"></span>
                            <p className="text-xs text-[#797979] font-lufga">Supply APY</p>
                        </div>
                        <div className="flex gap-12">
                            {(supplyInfos || []).map((supplyInfo, index) => (
                                <div className="font-lufga" key={index}>
                                    <p className="text-[9px] pb-2 text-[#E1E1E1]">{supplyInfo.name}</p>
                                    <p className="text-2xl text-white">{supplyInfo.value}</p>
                                </div>
                            ))}
                        </div>
                        <BorrowInfoChart type="supply" token={token} />
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Borrow Info</p>
                            <ul className="flex gap-4 items-center">
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">30D</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">6M</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">1Y</p>
                                </button>
                            </ul>
                        </div>
                        <div className='flex items-center mt-8 mb-8'>
                            <span className="w-2 h-2 bg-[#302DC2] rounded-full mr-2"></span>
                            <p className="text-xs text-[#797979] font-lufga">Borrow API</p>
                        </div>
                        <div className="flex gap-12">
                            {(borrowInfos || []).map((borrowInfo, index) => (
                                <div className="font-lufga" key={index}>
                                    <p className="text-[9px] pb-2 text-[#E1E1E1]">{borrowInfo.name}</p>
                                    <p className="text-2xl text-white">{borrowInfo.value}</p>
                                </div>
                            ))}
                        </div>
                        <BorrowInfoChart type="borrow" token={token} />
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Interest Rate Model</p>
                            <ul className="flex gap-4 items-center">
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#302DC2] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Utilization rate</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#f10750] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Borrow APY</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#38b2ac] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Supply APY</p>
                                </div>
                            </ul>
                        </div>
                        <InterestRateModelChart token={token} currentUtilization={(totalBorrowedTokens / totalSuppliedTokens) * 100} />
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-[#797979] text-xl font-lufga">Market Details</p>
                        </div>
                        {(marketDetails || []).map((marketDetail, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center">
                                    <p className="text-base text-lufga text-[#CAEAE5B2]">{marketDetail.name}</p>
                                    {
                                        marketDetail.link
                                            ? <a href={marketDetail.link} target="_blank"><p className="text-base text-lufga text-[#CAEAE5]">{marketDetail.value}</p></a>
                                            : <p className="text-base text-lufga text-[#CAEAE5]">{marketDetail.value}</p>
                                    }
                                </div>
                                <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
                            </div>
                        ))}
                    </CardItem>
                </div>
                <div className="w-1/3">
                    <CardItem className="p-8 mb-6 font-lufga">
                        <div className="w-full grid grid-cols-4 text-center">
                            {buttons.map((button) => (
                                <button key={button.id} onClick={() => handleButtonClick(button.id)}>
                                    <p className={`text-base transition-colors duration-300 ease-in-out ${activeButton === button.id ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}>{button.label}</p>
                                    <hr
                                        className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${activeButton === button.id ? 'text-white' : 'text-[#546764]'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <TokenActions
                            {...actionData} />
                    </CardItem>
                </div>
            </div>
        </div>
    )
}

export default TokenDetail;