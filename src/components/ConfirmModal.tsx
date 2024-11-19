import React, { useState } from 'react';
import { useConfirm } from '../provider/ConfirmProvider';
import healthFactorImage from '../assets/img/guide/health-factor.svg';
import collateralImage from '../assets/img/guide/collateral.svg';
import statusViewImage from '../assets/img/guide/status-view.svg';
import suppliedImage from '../assets/img/guide/supplied.svg';
import borrowedImage from '../assets/img/guide/borrowed.svg';
import welcomeImage from '../assets/img/guide/welcome.svg';

const ConfirmModal: React.FC = () => {
  const {
    confirmed,
    guided,
    preGuidedConfirm,
    gotoGuide,
    skipGuide,
    confirm,
    nextStep,
    closeGuide,
  } = useConfirm();

  const [read, setRead] = useState(false);
  const [agree, setAgree] = useState(false);

  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const [isSecondImageLoaded, setIsSecondImageLoaded] = useState(false);
  const [isThirdImageLoaded, setIsThirdImageLoaded] = useState(false);
  const [isFourImageLoaded, setIsFourImageLoaded] = useState(false);

  if (!confirmed) {
    return (
      <div className='fixed flex justify-center items-center top-0 left-0 w-full z-50 h-screen backdrop-blur-md p-2'>
        <div className='bg-primary p-10 shadow-3xl rounded-lg'>
          <div className='flex flex-col gap-6 max-w-[345px]'>
            <h3 className='text-secondary font-nexa font-black'>Disclaimer</h3>
            <div className='flex flex-col gap-4'>
              <p className='text-secondary text-sm font-nexa leading-4'>
                Please check the boxes below to confirm your agreement to the
                HyperLend Terms and Conditions:
              </p>
              <button
                onClick={() => setRead((prev) => !prev)}
                className='text-secondary text-left font-nexa text-sm'
              >
                <span
                  className={`w-3 h-3 inline-flex items-center justify-center border-2 mr-2 ${read ? 'bg-secondary' : ''}`}
                />
                <span className=''>
                  I have read and understood, and do hereby agree to be legally
                  bound as a 'User' under the Terms, including all future
                  amendments thereto. This agreement is irrevocable and will
                  apply to all of my uses of the Site without me providing
                  confirmation in each specific instance.
                </span>
              </button>
              <button
                onClick={() => setAgree((prev) => !prev)}
                className='text-secondary text-left font-nexa text-sm'
              >
                <span
                  className={`w-3 h-3 inline-flex items-center justify-center border-2 mr-2 ${agree ? 'bg-secondary' : ''}`}
                />
                <span className=''>
                  {' '}
                  I acknowledge and agree that the Site solely provides
                  information about data on the applicable blockchains. I accept
                  that the Site operators have no custody over my funds, ability
                  or duty to transact on my behalf, or power to reverse my
                  transactions. The Site operators do not endorse or provide any
                  warranty with respect to any tokens.
                </span>
              </button>
            </div>
            <button
              type='button'
              className={`w-full rounded-lg bg-secondary py-4 font-nexa ${!(read && agree) && 'opacity-60'}`}
              onClick={confirm}
              disabled={read && agree ? false : true}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!preGuidedConfirm) {
    return (
      <div className='hidden xl:flex fixed justify-center items-center top-0 left-0 w-full z-50 h-screen backdrop-blur-md p-2'>
        <div className='bg-primary px-11 pt-20 pb-10 shadow-3xl rounded-lg'>
          <div className='flex flex-col items-center gap-12 max-w-[345px]'>
            <img className='' src={welcomeImage} alt='welcome' />
            <div className='text-center'>
              <h3 className='text-secondary font-nexa font-black'>
                Welcome to HyperLend!
              </h3>
              <p className='text-secondary text-sm font-nexa leading-4'>
                Would you like a quick tour to get familiar with the features
                and make the most out of your experience?
              </p>
            </div>
            <div className='flex justify-center gap-12 mt-3'>
              <button
                onClick={skipGuide}
                className='text-secondary text-opacity-30 font-lufga'
              >
                Skip for Now
              </button>
              <button
                onClick={gotoGuide}
                className='text-secondary text-opacity-50 font-lufga'
              >
                Take a Quick Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    guided > 0 && (
      <div className='hidden xl:block fixed top-0 left-0 w-full z-50 h-screen backdrop-blur-md p-2'>
        {guided === 1 && (
          <div className='mt-[134px] ml-[302px] '>
            <div
              className={`${isFirstImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-[478px] text-center`}
            >
              <img
                className='w-[478px]'
                src={healthFactorImage}
                alt='guide'
                loading='lazy'
                onLoad={() => setIsFirstImageLoaded(true)}
              />
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
              <div className='bg-primary px-4 py-3 inline-block relative -top-4 rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Check Your Health Factor
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Keep this high to reduce liquidation risk.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {guided === 2 && (
          <div className='flex justify-end'>
            <div
              className={`${isSecondImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full flex justify-end items-start mr-[64px] mt-[120px]`}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block relative -top-4 rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Deposit Collateral
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  The assets you've provided as collateral to secure your loans
                  on the platform.
                </p>
                <p className='font-lufga text-[13px] text-secondary mt-3'>
                  Borrow
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  The assets you've borrowed using your deposited collateral.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
              <div className='flex items-center relative z-10 mt-24 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='h-0.5 w-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
              <img
                className='w-[calc(100%-820px)]'
                src={collateralImage}
                alt='guide'
                loading='lazy'
                onLoad={() => setIsSecondImageLoaded(true)}
              />
            </div>
          </div>
        )}
        {guided === 3 && (
          <div className='ml-[302px] mt-[260px]'>
            <div
              className={`${isThirdImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full flex flex-col justify-center items-center`}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Monitor Your Net Worth
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Track your balance and APY changes over time.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
              <img
                className='w-[calc(100%-60px)] relative -top-4 mr-[64px]'
                src={statusViewImage}
                alt='guide'
                loading='lazy'
                onLoad={() => setIsThirdImageLoaded(true)}
              />
            </div>
          </div>
        )}
        {guided === 4 && (
          <div className='ml-[302px] mt-[472px] mr-[64px]'>
            <div
              className={`${isFourImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300  w-full flex flex-col justify-center items-center`}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Monitor Your Net Worth
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Track your balance and APY changes over time.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary font-lufga'
                  >
                    Complete
                  </button>
                </div>
              </div>
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
              <div className='w-[calc(100%-28px)] flex justify-between gap-6 relative -top-4 '>
                <img
                  className='w-full'
                  src={suppliedImage}
                  alt='guide'
                  loading='lazy'
                  onLoad={() => setIsFourImageLoaded(true)}
                />
                <img
                  className='w-full'
                  src={borrowedImage}
                  alt='guide'
                  loading='lazy'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ConfirmModal;
