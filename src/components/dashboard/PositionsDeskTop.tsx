import { useState, useEffect, useRef, FC } from 'react';
import CardItem from '../common/CardItem';
import { formatNumber } from '../../utils/functions';
import { ModalType } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomIcon from '../common/CustomIcon';
import { borrowArrowIcon, collateralIcon, supplyIcon } from '../../assets';
import {
  borrowPositionTableTitles,
  supplyPositionTableTitles,
} from '../../utils/constants/constants';
import PositionsTableTitles from './PositionsTableTitles';

interface PositionsProps {
  setModalToken: React.Dispatch<React.SetStateAction<string>>;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  userPositions: any;
  sendToggleCollateralTx: (asset: string, isEnabled: boolean) => any;
}

const PositionsDeskTop: FC<PositionsProps> = ({
  setModalToken,
  setModalStatus,
  setModalType,
  userPositions,
  sendToggleCollateralTx,
}) => {
  const navigate = useNavigate();

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [divDimensions, setDivDimensions] = useState<
    { width: number; height: number }[]
  >([
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
  ]);
  console.log(divDimensions);
  // Update widths and heights
  const updateDimensions = () => {
    const newDimensions = divRefs.map((ref) => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetHeight || 0,
    }));
    setDivDimensions(newDimensions);
  };

  useEffect(() => {
    // Update the dimensions immediately when the component mounts
    updateDimensions();

    // Add resize event listener to update dimensions during window resizing
    window.addEventListener('resize', updateDimensions);

    // Clean up event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col'
      >
        <motion.div
          ref={divRefs[3]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`lg:flex lg:flex-col xl:flex-row gap-5 justify-between`}
        >
          <CardItem className='pt-4 h-auto lg:pt-6 flex-1 mb-4 lg:mb-0'>
            <div className=''>
              <div className='flex justify-start align-middle items-center gap-4 py-4 px-7'>
                <CustomIcon
                  mainDivStyles='rounded-full border border-1 border-[#CAEAE51A] bg-[#CAEAE50D] px-3 py-2'
                  iconImage={supplyIcon}
                  width='7px'
                  height='10px'
                />
                <p className='text-[#CAEAE5] font-lufga text-2xl'>
                  You Supplied
                </p>
              </div>
              <div className='text-center h-[100%]'>
                <div className='py-3 px-2 grid grid-cols-6 border-y-[1px] bg-[#050F0D] border-[#212325]'>
                  {supplyPositionTableTitles?.map((item) => (
                    <PositionsTableTitles
                      title={item.title}
                      key={item.id}
                      titleStyles='text-xs font-medium text-[#FFFFFF] font-lufga'
                    />
                  ))}
                </div>
                <div className='h-[100%] pb-10 bg-primary-hover rounded-b-2xl'>
                  {(userPositions.supplied || []).map((item: any) => (
                    <button
                      className='w-full grid grid-cols-6 py-[14px] px-2 justify-start border-b-[1px] border-[#071311] items-center bg-[#111E1C] hover:bg-primary-hover'
                      key={item.id}
                      onClick={() =>
                        navigate(`/markets/${item.underlyingAsset}`)
                      }
                    >
                      <div className='text-white font-lufga flex gap-1 justify-center items-center '>
                        <img className='' src={item.icon} alt='' />

                        <p className='text-xs sm:text-base lg:text-xs xl:text-xs'>
                          {item.assetName}
                        </p>
                      </div>
                      <span className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-xs'>
                        {formatNumber(item.balance, 2)}K
                      </span>
                      <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-xs'>
                        ${formatNumber(item.value, 2)}K
                      </div>
                      <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-xs'>
                        {formatNumber(item.apr, 2)}%
                      </div>
                      <div
                        className={`text-xs sm:text-base lg:text-xs xl:text-xs ${item.isCollateralEnabled ? 'text-success font-lufga' : 'text-secondary font-lufga'}`}
                      >
                        <button
                          onClick={() => {
                            sendToggleCollateralTx(
                              item.underlyingAsset,
                              item.isCollateralEnabled,
                            );
                          }}
                        >
                          {item.isCollateralEnabled ? (
                            <img src={collateralIcon} />
                          ) : (
                            '─'
                          )}
                        </button>
                      </div>
                      <button
                        className='w-full py-2 bg-[#CAEAE5] font-lufga rounded-md font-bold text-xs hover:bg-[#CAEAE5]/80 hidden md:block lg:block xl:block'
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalStatus(true);
                          setModalToken(item.underlyingAsset);
                          setModalType('supply');
                        }}
                      >
                        Supply
                      </button>
                    </button>
                    // </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardItem>
          <CardItem className='pt-4 h-auto lg:pt-6   flex-1 mb-4 lg:mb-0'>
            <div className=''>
              <div className='flex justify-start align-middle items-center gap-4 py-4 px-7'>
                <CustomIcon
                  mainDivStyles='rounded-full border border-1 border-[#CAEAE51A] bg-[#FF00040D] px-3 py-2'
                  iconImage={borrowArrowIcon}
                  width='5px'
                  height='10px'
                />
                <p className='text-[#CAEAE5] font-lufga text-2xl'>
                  You Borrowed
                </p>
              </div>
              <div className='text-center'>
                <div className='py-3 px-2 grid grid-cols-6 border-y-[1px] bg-[#050F0D] border-[#212325]'>
                  {borrowPositionTableTitles?.map((item) => (
                    <PositionsTableTitles
                      title={item.title}
                      key={item.id}
                      titleStyles='text-xs font-medium text-[#FFFFFF] font-lufga'
                      infoItemStyles='border-1 border-[#050F0D]'
                    />
                  ))}
                </div>
                <div className='h-[100%] pb-10 bg-primary-hover rounded-b-2xl'>
                  {(userPositions.borrowed || []).map(
                    (item: any, index: any) => (
                      <button
                        className='w-full grid grid-cols-6 py-[14px] px-2 justify-start border-b-[1px] border-[#071311] items-center bg-[#111E1C] hover:bg-primary-hover'
                        key={index}
                        onClick={() =>
                          navigate(`/markets/${item.underlyingAsset}`)
                        }
                      >
                        <div className='text-white font-lufga flex gap-1 justify-center items-center'>
                          <img className='' src={item.icon} alt='' />
                          <p className='text-xs sm:text-base lg:text-xs xl:text-xs'>
                            {item.assetName}
                          </p>
                        </div>
                        <div
                          className={`text-white font-lufga  text-center  text-xs sm:text-base lg:text-xs xl:text-xs ${item.title === 'Balance' && 'hidden md:block lg:block xl:block'}`}
                        >
                          {formatNumber(item.balance, 2)}K
                        </div>
                        <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-xs'>
                          ${formatNumber(item.value, 2)}K
                        </div>
                        <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-xs'>
                          {formatNumber(item.apr, 2)}%
                        </div>
                        <div
                          className={`text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-xs ${item.pool === 'Pool' && 'hidden md:block lg:block xl:block'}`}
                        >
                          {item.pool}
                        </div>
                        <button
                          className='w-full py-2 bg-[#CAEAE5] font-lufga rounded-md font-bold text-xs hover:bg-[#CAEAE5]/80 hidden md:block lg:block xl:block'
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalStatus(true);
                            setModalToken(item.underlyingAsset);
                            setModalType('repay');
                          }}
                        >
                          Repay
                        </button>
                      </button>
                      // </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardItem>
        </motion.div>
      </motion.div>
    </>
  );
};

export default PositionsDeskTop;
