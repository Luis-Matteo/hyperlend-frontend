import React, { useState } from 'react';
import { useConfirm } from '../provider/ConfirmProvider';
import welcomeImage from '../assets/img/guide/welcome.svg';

const ConfirmModal: React.FC = () => {
  const { confirmed, preGuidedConfirm, gotoGuide, skipGuide, confirm } =
    useConfirm();

  const [read, setRead] = useState(false);
  const [agree, setAgree] = useState(false);

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
};

export default ConfirmModal;
