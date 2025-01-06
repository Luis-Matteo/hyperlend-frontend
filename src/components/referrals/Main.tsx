import { useState, useEffect, useRef } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import '../../assets/css/custom-styles.css';

import mountainImage from '../../assets/img/mountain.svg';
import { copyToClipboard } from '../../utils/functions';

const Main = () => {
  const { address, isConnected } = useAccount();
  const {
    data: signMessageData,
    error: signingError,
    signMessage,
    variables,
  } = useSignMessage();

  const defaultCustomCodeMessage = 'your custom code';

  const inputRef = useRef<HTMLInputElement>(null);
  const [isCopy, setIsCopy] = useState(false);
  const [link, setLink] = useState('');
  const [registrationProgress, setRegistrationProgress] = useState('');
  const [customCode, setCustomCode] = useState(defaultCustomCodeMessage);
  const [signature, setSignature] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Safely parse localStorage data
   */
  const parseLocalStorageSignature = () => {
    try {
      const storedSignatures = localStorage.getItem('referral-signature');
      return storedSignatures ? JSON.parse(storedSignatures) : {};
    } catch (err) {
      console.error('Error parsing localStorage signatures', err);
      return {};
    }
  };

  // If a signature is already stored for this address, fetch details from the server.
  useEffect(() => {
    if (!isConnected || !address) return;

    const refSignatures = parseLocalStorageSignature();
    if (!refSignatures[address]) return;

    setSignature(refSignatures[address]);
    setReferredBy(localStorage.getItem('referredBy') || 'null');

    setIsLoading(true); // begin loading
    fetch(
      `https://api.hyperlend.finance/referrals/get?address=${address}&signature=${refSignatures[address]}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          setErrorMsg(json.error);
          setRegistrationProgress('signingMessage');
        } else {
          if (json.data) {
            // user is already registered
            setLink(`${window.location.origin}/?ref=${json.data.code}`);
            setRegistrationProgress('completed');
          } else {
            // user is not registered yet
            setRegistrationProgress('customCode-input');
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching referral details:', error);
        setErrorMsg(error.message || 'An unexpected error occurred.');
        setRegistrationProgress('');
      })
      .finally(() => {
        setIsLoading(false); // done loading
      });
  }, [address, isConnected, signature]);

  // Once message is signed, store it to localStorage
  useEffect(() => {
    if (!address || !signMessageData) return;

    const refSignatures = parseLocalStorageSignature();
    refSignatures[address] = signMessageData;
    localStorage.setItem('referral-signature', JSON.stringify(refSignatures));
    setSignature(signMessageData);
  }, [signMessageData, variables?.message, address]);

  // Handle different registration steps
  useEffect(() => {
    if (!signature && registrationProgress === 'signingMessage') {
      requestSignature();
    } else if (registrationProgress === 'customCode-register') {
      registerCustomCode();
    }
  }, [registrationProgress]);

  // Auto-deselect the copy status
  useEffect(() => {
    if (isCopy) {
      const timer = setTimeout(() => setIsCopy(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopy]);

  // Auto-focus (and select) the input field when showing the custom code step
  useEffect(() => {
    if (registrationProgress === 'customCode-input' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [registrationProgress]);

  // Handle signing errors
  useEffect(() => {
    if (signingError) {
      setErrorMsg(signingError.message);
      setRegistrationProgress(''); // reset progress so user can connect again
    }
  }, [signingError]);

  // Clear error message after a few seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Keep referral link in localStorage for other uses
  useEffect(() => {
    if (link) {
      localStorage.setItem('referral-link', link);
    }
  }, [link]);

  // Request signature from user
  const requestSignature = () => {
    if (!address) {
      setRegistrationProgress('');
      return alert('Please connect your wallet to proceed');
    }
    const message = `hyperlend_registration_${address.toLowerCase()}`;
    signMessage({ message });
  };

  // Register a custom code on the server
  const registerCustomCode = () => {
    setIsLoading(true); // begin loading
    fetch(
      `https://api.hyperlend.finance/referrals/register?address=${address}&signature=${signature}&customCode=${customCode}&referredBy=${referredBy}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          setErrorMsg(json.error);
          setRegistrationProgress('customCode-input');
        } else {
          setLink(`${window.location.origin}/?ref=${json.data}`);
          setRegistrationProgress('completed');
        }
      })
      .catch((error) => {
        console.error('Error registering custom code:', error);
        setErrorMsg(error.message || 'An unexpected error occurred.');
        setRegistrationProgress('customCode-input');
      })
      .finally(() => {
        setIsLoading(false); // done loading
      });
  };

  // ---------------------------------- UI RENDERING ---------------------------------- //

  // Simple loading UI
  if (isLoading) {
    return (
      <div className='w-full text-center pt-10'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero / Banner Section */}
      <div className='relative h-56 w-full rounded-md px-7 py-5 pb-[15.25rem] md bg-secondary mb-10'>
        <div>
          <p className='font-black text-xl leading-8'>Refer Your Frens</p>
          <p className='font-light mt-3'>
            Access instant loans using your
            <br /> crypto holdings as collateral.
          </p>
        </div>
        <div className='absolute right-0 bottom-0' style={{ top: '110px' }}>
          <img src={mountainImage} alt='mountain' />
        </div>
      </div>

      {/* Error message, if any */}
      {errorMsg && (
        <div className='flex justify-center mb-2'>
          <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>
            {errorMsg === 'n.connector.getChainId is not a function'
              ? 'Please connect and unlock your wallet to create a referral link.'
              : errorMsg}
          </p>
        </div>
      )}

      {/* Main Content */}
      {link ? (
        // If user already has a referral link
        <div className='flex justify-between gap-2'>
          <p className='text-secondary py-2 px-5 bg-[#1F2A29] rounded-full w-full overflow-hidden text-ellipsis'>
            {link}
          </p>
          <button
            className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-full whitespace-nowrap transition-colors duration-300 ${
              isCopy ? 'text-success' : ''
            }`}
            onClick={() => {
              copyToClipboard(link);
              setIsCopy(true);
            }}
            type='button'
          >
            {isCopy ? 'Copied' : 'Copy Url'}
          </button>
        </div>
      ) : (
        // If user doesn't have a referral link yet
        <div className='flex flex-col items-center gap-2'>
          {/* 
             If user is in the 'customCode' step, show input for custom code.
             Otherwise, show the 'Connect' (signing message) button.
           */}
          {registrationProgress.includes('customCode') ? (
            <div className='flex justify-center gap-2'>
              <input
                ref={inputRef}
                autoFocus={true}
                maxLength={15}
                type='text'
                className='form-control-plaintext text-center font-lufga text-xl text-secondary border-0 p-0 border-b-2 border-[#212325]'
                value={customCode}
                onChange={(e) =>
                  setCustomCode(
                    e.target.value.replace(/\s+/g, '').toUpperCase(),
                  )
                }
                style={{
                  background: 'transparent',
                  outline: 'none',
                  boxShadow: 'none',
                  width: 'auto',
                  minWidth: '50px',
                }}
              />

              <button
                className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-md whitespace-nowrap transition-colors duration-300 ${
                  isCopy ? 'text-success' : ''
                }`}
                onClick={() => {
                  if (
                    customCode === defaultCustomCodeMessage ||
                    !customCode.trim()
                  ) {
                    const randomCode = (Math.random() + 1)
                      .toString(36)
                      .substring(2)
                      .toUpperCase();
                    setCustomCode(randomCode);
                  }
                  setRegistrationProgress('customCode-register');
                }}
                type='button'
              >
                {registrationProgress === 'customCode-register'
                  ? 'Registering...'
                  : 'Register'}
              </button>
            </div>
          ) : (
            <button
              className='py-4 w-[25%] bg-secondary text-xs font-black rounded-md whitespace-nowrap transition-colors active:scale-95 duration-200'
              onClick={() => setRegistrationProgress('signingMessage')}
              type='button'
            >
              {registrationProgress === 'signingMessage'
                ? 'Signing message...'
                : 'Connect'}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Main;
