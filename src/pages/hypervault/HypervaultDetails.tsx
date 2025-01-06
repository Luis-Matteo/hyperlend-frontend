import { useParams } from 'react-router-dom';
import { hypervaults, vaultTokenList } from '../../utils/mocks/hypervault';
import { motion } from 'framer-motion';
import CardItem from '../../components/common/CardItem';
import { containerVariants, cardVariants } from '../../utils/constants/effects';
import BorrowInfoChart from '../../components/charts/BorrowInfoChart';
import { formatNumber } from '../../utils/functions';
import { useState } from 'react';
import TabButton from '../../components/common/TabButton';
import downArrowIcon from '../../assets/icons/down-arrow.svg';
import ProgressBar from '../../components/common/PercentBar';
import Button from '../../components/common/Button';

function HypervaultDetails() {
  const { vaultId = '' } = useParams();
  const vault = hypervaults.find((vault) => vault.id === Number(vaultId));
  const [activeButton, setActiveButton] = useState<'deposit' | 'withdraw'>(
    'deposit',
  );
  const [deposit, setDeposit] = useState<number>(0);
  const [selectedDepositToken, setSelectedDepositToken] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState<boolean>(false);
  const [leverage, setLeverage] = useState<number>(0);
  const availableLeverage = 1505;
  const [progress, setProgress] = useState<number>(0);
  const handleProgessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
    setLeverage((availableLeverage * Number(e.target.value)) / 100);
  };
  console.log(leverage);
  if (!vault) return <div>Vault not found</div>;

  const vaultInfos = [
    {
      name: 'Total value locked',
      value: `$${formatNumber(vault.tvl, 2)}`,
    },
    {
      name: 'APY',
      value: `${formatNumber(vault.apy, 2)}%`,
    },
  ];

  const feeTransparency = [
    {
      name: 'Entry',
      value: `${vault.apy}%`,
    },
    {
      name: 'Early Withdraw',
      value: `${vault.apy}%`,
    },
    {
      name: 'Performance',
      value: `${vault.apy}%`,
    },
    {
      name: 'Managment',
      value: `${vault.apy}%`,
    },
  ];
  return (
    <div className='w-full mt-7'>
      <div className='border-[1px] border-secondary rounded-2xl px-8 py-6 shadow-inner-2xl'>
        <div className='flex gap-7 flex-col lg:flex-row lg:items-center'>
          <div className='flex -space-x-6 lg:-space-x-10'>
            <img
              src={vault.assetIcon}
              alt={vault.assetSymbol}
              className='w-12 h-12 lg:w-20 lg:h-20 rounded-full'
            />
            <img
              src={vault.collateralIcon}
              alt={vault.collateralSymbol}
              className='w-12 h-12 lg:w-20 lg:h-20 rounded-full'
            />
          </div>
          <div className='flex flex-col gap-2 max-w-[560px]'>
            <p className='text-white font-bold text-3xl font-lufga'>
              {vault.title}
            </p>
            <p className='text-secondary text-xs font-lufga'>{vault.content}</p>
          </div>
        </div>
      </div>
      <motion.div
        className='mt-5 flex flex-col-reverse lg:flex-row lg:gap-8 w-full'
        variants={containerVariants}
      >
        <div className='flex-grow flex flex-col gap-5 w-auto overflow-x-auto'>
          <motion.div variants={cardVariants}>
            <CardItem className='p-8 shadow-inner-2xl rounded-2xl'>
              <div className='flex justify-between items-center'>
                <p className='text-secondary font-lufga'>Performance</p>
              </div>
              <div className='flex items-center mt-8 mb-8'>
                <span className='w-2 h-2 bg-[#2DB1C2] rounded-full mr-2' />
                <p className='text-xs text-[#797979] font-lufga'>Vault</p>
              </div>
              <div className='flex justify-between gap-4 md:justify-start flex-wrap md:gap-12'>
                {(vaultInfos || []).map((vaultInfo, index) => (
                  <div className='font-lufga' key={index}>
                    <p className='text-[9px] pb-2 text-[#E1E1E1] whitespace-nowrap'>
                      {vaultInfo.name}
                    </p>
                    <p className='text-2xl text-white'>{vaultInfo.value}</p>
                  </div>
                ))}
              </div>
              <BorrowInfoChart
                token={vault.assetSymbol}
                type='supply'
                isIsolated={false}
              />
            </CardItem>
          </motion.div>
          <motion.div variants={cardVariants}>
            <CardItem className='px-10 py-11 shadow-inner-2xl rounded-2xl'>
              <div className='flex justify-between items-center'>
                <p className='text-secondary font-lufga'>APY Breakdown</p>
              </div>
              <div className='flex justify-between items-center mt-8'>
                <p className='text-secondary font-lufga'>Total fee</p>
                <p className='text-secondary font-lufga'>{vault.apy}%</p>
              </div>
              <div className='px-8 py-5 bg-secondary/10 rounded-2xl flex justify-between items-center mt-4'>
                <p className='text-secondary font-lufga'>Total fee</p>
                <p className='text-secondary font-lufga'>{vault.apy}%</p>
              </div>
              <div className='px-8 py-5 bg-secondary/10 rounded-2xl flex justify-between items-center mt-4'>
                <p className='text-secondary font-lufga'>Total fee</p>
                <p className='text-secondary font-lufga'>{vault.apy}%</p>
              </div>
            </CardItem>
          </motion.div>
          <motion.div variants={cardVariants}>
            <CardItem className='px-10 py-11 shadow-inner-2xl rounded-2xl'>
              <div className='flex justify-between items-center'>
                <p className='text-secondary font-lufga'>How it works</p>
              </div>
              <img
                className='w-full hidden sm:block'
                src='/assets/img/hypervault/info.svg'
                alt='info'
              />
              <img
                className='w-full sm:hidden max-w-[280px] mx-auto'
                src='/assets/img/hypervault/info-mobile.svg'
                alt='info'
              />
            </CardItem>
          </motion.div>
          <motion.div variants={cardVariants}>
            <div className='flex flex-col md:flex-row gap-5'>
              <CardItem className='px-10 py-11 shadow-inner-2xl rounded-2xl'>
                <div className='flex justify-between items-center'>
                  <p className='text-secondary font-lufga'>Vault Allocation</p>
                </div>
                <div className='mt-8'>
                  <div className='flex items-center gap-2 py-1'>
                    <img
                      src={vault.assetIcon}
                      alt={vault.assetSymbol}
                      className='w-5 h-5'
                    />
                    <div className='flex justify-between items-center gap-2 flex-grow'>
                      <p className='text-secondary font-lufga'>
                        {vault.assetSymbol}
                      </p>
                      <p className='text-secondary font-lufga px-3 py-1 bg-secondary/10 rounded-full border-[1px] border-secondary'>
                        {vault.apy}%
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 py-1'>
                    <img
                      src={vault.collateralIcon}
                      alt={vault.collateralSymbol}
                      className='w-5 h-5'
                    />
                    <div className='flex justify-between items-center gap-2 flex-grow'>
                      <p className='text-secondary font-lufga'>
                        {vault.collateralSymbol}
                      </p>
                      <p className='text-secondary font-lufga px-3 py-1 bg-secondary/10 rounded-full border-[1px] border-secondary'>
                        {vault.apy}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardItem>
              <CardItem className='flex-grow px-9 py-8 shadow-inner-2xl rounded-2xl  overflow-x-auto '>
                <div className='flex justify-between items-center'>
                  <p className='text-secondary font-lufga'>Fee Transparency</p>
                </div>
                <div className='grid lg:flex grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full'>
                  {feeTransparency.map((fee, index) => (
                    <div className='text-center whitespace-nowrap' key={index}>
                      <p className='text-success font-lufga'>{fee.value}</p>
                      <p className='text-secondary/40 font-lufga'>{fee.name}</p>
                    </div>
                  ))}
                </div>
              </CardItem>
            </div>
          </motion.div>
          <motion.div variants={cardVariants}>
            <CardItem className='px-10 py-11 shadow-inner-2xl rounded-2xl'>
              <div className='flex justify-between items-center'>
                <p className='text-secondary font-lufga'>Withdraw</p>
              </div>
              <p className='text-secondary font-lufga mt-8'>
                Upon utilization of user funds in spot and perpetual trading on
                DEX, there is a necessary period for withdrawing funds from our
                vendor.
                <br /> <br />
                The withdrawal process from Harmonix is straightforward and
                adaptable. Users have the option to initiate a withdrawal
                request on the website at their convenience. Once your request
                is received, we will promptly trigger the withdrawal of funds
                from the vendor. This process may take several minutes or hours.
                After the funds have been successfully withdrawn from the vendor
                and transferred back to the vault, users can then claim their
                funds from the Harmonix website.
              </p>
            </CardItem>
          </motion.div>
        </div>
        <motion.div
          className='w-full lg:w-1/3 lg:min-w-[360px]'
          variants={cardVariants}
        >
          <div className='sticky top-0 '>
            <CardItem className='p-4 lg:p-8 font-lufga'>
              <div className='w-full grid grid-cols-2 text-center'>
                <TabButton
                  isActive={activeButton === 'deposit'}
                  activeButton={'deposit'}
                  label='Deposit'
                  setActiveButton={setActiveButton}
                />
                <TabButton
                  isActive={activeButton === 'withdraw'}
                  activeButton={'withdraw'}
                  label='Withdraw'
                  setActiveButton={setActiveButton}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
                  <div className='flex gap-3 items-center p-3 w-[100px]'>
                    <input
                      type='number'
                      className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left '
                      value={deposit}
                      step={0.01}
                      min={0}
                      onChange={(e) => {
                        setDeposit(Number(e.target.value));
                      }}
                      style={{
                        background: 'transparent',
                        outline: 'none',
                        boxShadow: 'none',
                        width: 'auto',
                        minWidth: '50px',
                      }}
                    />
                  </div>
                  <div className='relative w-[140px] bg-[#081916] rounded-lg'>
                    <button
                      className='w-full flex justify-between items-center px-2 sm:px-4 text-base h-[54px] rounded-lg text-[#CAEAE566]'
                      onClick={() => setDepositOpen((prev) => !prev)}
                    >
                      {selectedDepositToken ? (
                        <div className='flex gap-4 items-center'>
                          <img
                            className='w-6 h-6 '
                            src={selectedDepositToken.icon}
                          />
                          <p className='text-secondary font-lufga'>
                            {selectedDepositToken.title}
                          </p>
                        </div>
                      ) : (
                        <div className='flex justify-center items-center gap-4'>
                          <p className='text-secondary font-lufga'>Select</p>
                        </div>
                      )}
                      <img
                        className={`w-6 transition-all duration-300 ${depositOpen ? 'rotate-180' : ''}`}
                        src={downArrowIcon}
                        alt='downArrow'
                      />
                    </button>
                    {depositOpen && (
                      <div
                        className={`absolute w-full z-10 left-0 top-[54px] bg-[#0D1414] py-3 rounded-md ${depositOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                      >
                        {vaultTokenList.map((item, index) => (
                          <button
                            className='flex gap-2 px-5 w-full py-1.5 bg-[#0D1414] hover:bg-[#1b332f]'
                            key={`depositToken${index}`}
                            onClick={() => {
                              setSelectedDepositToken(item);
                              setDepositOpen(false);
                            }}
                          >
                            <img className='w-6 h-6 ' src={item.icon} />
                            <p className='text-secondary font-lufga'>
                              {item.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className='relative my-10 '>
                  <div className='flex justify-between items-center'>
                    <p className='font-lufga text-[#797979]'>Balance:</p>
                    <p className='font-lufga text-[#797979]'>
                      MAX:{' '}
                      <span className='text-secondary'>
                        {availableLeverage}
                      </span>
                    </p>
                  </div>
                  <div className='relative my-2 '>
                    <ProgressBar
                      progress={progress}
                      control={true}
                      className='h-1.5'
                    />
                    <input
                      type='range'
                      min='0'
                      max='100'
                      value={progress}
                      onChange={handleProgessChange}
                      className='w-full top-0 left-0 absolute opacity-0 cursor-pointer'
                    />
                  </div>
                </div>
                <div className='relative my-10 '>
                  <div className='flex justify-between items-center'>
                    <p className='font-lufga text-[#797979]'>You Receive</p>
                    <p className='font-lufga text-[#797979]'>
                      MAX:{' '}
                      <span className='text-secondary'>
                        {availableLeverage}
                      </span>
                    </p>
                  </div>
                  <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
                    <div className='flex gap-3 items-center p-3 w-[100px]'>
                      <input
                        type='number'
                        className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left '
                        value={deposit}
                        step={0.01}
                        min={0}
                        onChange={(e) => {
                          setDeposit(Number(e.target.value));
                        }}
                        style={{
                          background: 'transparent',
                          outline: 'none',
                          boxShadow: 'none',
                          width: 'auto',
                          minWidth: '50px',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='flex justify-between items-center'>
                    <p className='text-base font-lufga text-[#797979]'>
                      Price per share
                    </p>
                    <p className='text-base font-lufga text-secondary'>
                      1thUSD = 1.0984USDC
                    </p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-base font-lufga text-[#797979]'>
                      Minimum Deposit Amount
                    </p>
                    <p className='text-base font-lufga text-secondary'>$20</p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-base font-lufga text-[#797979]'>
                      Daily earnings
                    </p>
                    <p className='text-base font-lufga text-success'>0.73</p>
                  </div>
                </div>
                <Button title='Approve' />
              </motion.div>
            </CardItem>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HypervaultDetails;
