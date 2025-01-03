import {
  //useState,
  useEffect,
  useRef,
} from 'react';
import { useAccount } from 'wagmi';
import ReactGA from 'react-ga4';
import CardItem from '../common/CardItem';
import { formatNumber, formatUnit } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../provider/ConfirmProvider';
import { motion } from 'framer-motion';
import CustomIcon from '../common/CustomIcon';
import { borrowArrowIcon, supplyIcon } from '../../assets';
import {
  borrowPositionTableTitlesMobile,
  supplyPositionTableTitlesMobile,
} from '../../utils/constants/constants';
import PositionsTableTitles from './PositionsTableTitles';

import { useUserPositionsData } from '../../utils/user/core/positions';

function PositionsMobile() {
  ReactGA.send({ hitType: 'pageview', page: '/dashboard' });

  const navigate = useNavigate();
  const { guided } = useConfirm();

  const { isConnected, address } = useAccount();
  const userPositions = useUserPositionsData(isConnected, address);

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // const [divDimensions, setDivDimensions] = useState<
  //   { width: number; height: number }[]
  // >([
  //   { width: 0, height: 0 },
  //   { width: 0, height: 0 },
  //   { width: 0, height: 0 },
  //   { width: 0, height: 0 },
  // ]);

  // Update widths and heights
  const updateDimensions = () => {
    // const newDimensions = divRefs.map((ref) => ({
    //   width: ref.current?.offsetWidth || 0,
    //   height: ref.current?.offsetHeight || 0,
    // }));
    //setDivDimensions(newDimensions);
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
          className={`lg:flex lg:flex-col xl:flex-row gap-5 justify-between ${guided > 0 && guided !== 4 ? 'lg:blur-[8px]' : ''}`}
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
              <div className='text-center'>
                <div className='py-3 px-2 grid grid-cols-3 border-y-[1px] bg-[#050F0D] border-[#212325]'>
                  {supplyPositionTableTitlesMobile?.map((item) => (
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
                      className='w-full grid grid-cols-3 py-[14px] px-2.5 justify-start border-b-[1px] border-[#071311] items-center bg-[#111E1C] hover:bg-primary-hover'
                      key={item.id}
                      onClick={() =>
                        navigate(`/markets/${item.underlyingAsset}`)
                      }
                    >
                      <div className='text-white font-lufga flex gap-1 justify-center items-center'>
                        <img
                          className='w-4 sm:w-6 lg:w-4 xl:w-6'
                          src={item.icon}
                          alt=''
                        />
                        <p className='text-xs sm:text-base lg:text-xs xl:text-base'>
                          {item.assetName}
                        </p>
                      </div>

                      <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                        ${formatUnit(item.value, 2)}
                      </div>
                      <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                        {formatNumber(item.apr, 2)}%
                      </div>
                    </button>
                    // </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardItem>
          <CardItem className='pt-4 h-auto lg:pt-6 flex-1 mb-4 lg:mb-0'>
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
                <div className='py-3 px-2 grid grid-cols-3 border-y-[1px] bg-[#050F0D] border-[#212325]'>
                  {borrowPositionTableTitlesMobile?.map((item) => (
                    <PositionsTableTitles
                      title={item.title}
                      key={item.id}
                      titleStyles='text-xs font-medium text-[#FFFFFF] font-lufga'
                    />
                  ))}
                </div>
                <div className='h-[100%] pb-10 bg-primary-hover rounded-b-2xl'>
                  {(userPositions.borrowed || []).map((item: any) => (
                    <button
                      className='w-full grid grid-cols-3 py-[14px] px-2.5 justify-start border-b-[1px] border-[#071311] items-center bg-[#111E1C] hover:bg-primary-hover'
                      key={item.id}
                      onClick={() =>
                        navigate(`/markets/${item.underlyingAsset}`)
                      }
                    >
                      <div className='text-white font-lufga flex gap-1 justify-center items-center'>
                        <img
                          className='w-4 sm:w-6 lg:w-4 xl:w-6'
                          src={item.icon}
                          alt=''
                        />
                        <p className='text-xs sm:text-base lg:text-xs xl:text-base'>
                          {item.assetName}
                        </p>
                      </div>

                      <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                        ${formatUnit(item.value, 2)}
                      </div>
                      <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                        {formatNumber(item.apr, 2)}%
                      </div>
                    </button>
                    // </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardItem>
        </motion.div>
      </motion.div>
    </>
  );
}

export default PositionsMobile;
