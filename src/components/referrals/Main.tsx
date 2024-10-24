import { useState, useEffect, useRef } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import mountainImage from '../../assets/img/mountain.svg';
import { copyToClipboard } from '../../utils/functions';

const Main = () => {
  const { address, isConnected } = useAccount();
  const { data: signMessageData, error: signingError, signMessage, variables } = useSignMessage()

  const defaultCustomCodeMessage = 'your custom code'

  const inputRef = useRef<HTMLInputElement>(null);
  const [isCopy, setIsCopy] = useState(false);
  const [link, setLink] = useState<string>("")
  const [registrationProgress, setRegistrationProgress] = useState<string>("")
  const [customCode, setCustomCode] = useState(defaultCustomCodeMessage)
  const [signature, setSignature] = useState("")
  const [referredBy, setReferredBy] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  //registration state steps: "" -> signingMessage -> customCode-input -> customCode-register -> completed

  //if signature is aready stored for this address, fetch details
  useEffect(() => {
    if (!isConnected || !address) return;

    let refSignatures = JSON.parse(localStorage.getItem('referral-signature') || "{}")
    if (!refSignatures[address]) return;
    setSignature(refSignatures[address]);
    setReferredBy(localStorage.getItem("referredBy") || "null")

    fetch(
      `https://api.hyperlend.finance/referrals/get?address=${address}&signature=${refSignatures[address]}`
    )
    .then((response) => response.json())
    .then((json) => {
      if (!json.error) {
        if (json.data) setLink(`${window.location.origin}/?ref=${json.data.code}`);
        else setRegistrationProgress("customCode-input") //user is not registered yet
      } else {
        setErrorMsg(json.error)
        setRegistrationProgress("signingMessage")
      }
    })
    .catch((error) => {
      console.log(error)
      setErrorMsg(error)
      setRegistrationProgress("signingMessage")
    });
  }, [signature])

  //once message is signed, store it to localstorage
  useEffect(() => {
    if (!address) return;

    if (signMessageData){
      let refSignatures = JSON.parse(localStorage.getItem('referral-signature') || "{}")
      refSignatures[address] = signMessageData
      localStorage.setItem('referral-signature', JSON.stringify(refSignatures))
      setSignature(signMessageData)
    }
  }, [signMessageData, variables?.message])

  //registration steps
  useEffect(() => {
    if (!signature && registrationProgress == "signingMessage"){
      requestSignature();
    }

    if (registrationProgress == "customCode-register"){
      registerCustomCode() //send to server
    }
  }, [registrationProgress])

  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 2000);
    }
  }, [isCopy]);

  useEffect(() => {
    //autoselect default code during registration
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [registrationProgress])

  useEffect(() => {
    if (signingError){
      setErrorMsg(signingError.message)
      setRegistrationProgress("") //reset progress
    } 
  }, [signingError])

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
    }
  }, [errorMsg]);

  const requestSignature = () => {
    if (!address) return alert("missing address");
    const message = `hyperlend_registration_${address.toLowerCase()}`
    signMessage({ message })
  }

  const registerCustomCode = () => {
    fetch(
      `https://api.hyperlend.finance/referrals/register?address=${address}&signature=${signature}&customCode=${customCode}&referredBy=${referredBy}`,
    )
    .then((response) => response.json())
    .then((json) => {
      if (!json.error){
        setLink(`${window.location.origin}/?ref=${json.data}`);
        setRegistrationProgress("completed")
      } else {
        setErrorMsg(json.error)
        setRegistrationProgress("customCode-input")
      }
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg(error)
      setRegistrationProgress("customCode-input")
    });
  }

  return (
    <>
      <div className='relative h-56 w-full rounded-md px-7 py-5 bg-secondary mb-10'>
        <div className=''>
          <p className='font-black text-xl leading-8'>
            Refer Your Frens
          </p>
          <p className='font-light mt-3'>
            Access instant loans using your
            <br /> crypto holdings as collateral.
          </p>
        </div>
        <div className='absolute right-0 bottom-0'>
          <img src={mountainImage} alt='mountain' />
        </div>
      </div>
      {
        link ? (
          <>
            <div className='flex justify-between gap-2'>
              <p className='text-secondary py-2 px-5 bg-[#1F2A29] rounded-full w-full'>
                {link}
              </p>
              <button
                className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-full whitespace-nowrap transition-colors duration-300 ${isCopy ? 'text-success' : ''}`}
                onClick={() => {
                  copyToClipboard(link), setIsCopy(true);
                }}
                type='button'
              >
                {isCopy ? 'Copied' : 'Copy Url'}
              </button>
            </div>
          </>
        ) : (
          <>
            {
              errorMsg ? (
                <div className='flex justify-between mb-2'>
                  <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>{errorMsg}</p>
                </div>
              ) : ""
            }
            <div className='flex justify-center gap-2'>
              {
                registrationProgress.includes("customCode") ? (
                  <>
                    <input
                      ref={inputRef} 
                      autoFocus={true}
                      maxLength={15}
                      type='text'
                      className='form-control-plaintext text-center font-lufga text-xl text-secondary border-0 p-0 border-b-2 border-[#212325]'
                      value={customCode}
                      onChange={(e) => {
                        setCustomCode(e.target.value.replace(/\s+/g, '').toUpperCase())
                      }}
                      style={{
                        background: 'transparent',
                        outline: 'none',
                        boxShadow: 'none',
                        width: 'auto',
                        minWidth: '50px',
                      }}
                    />
                    
                    <button
                      className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-md whitespace-nowrap transition-colors duration-300 ${isCopy ? 'text-success' : ''}`}
                      onClick={() => {
                        if (customCode == defaultCustomCodeMessage || !customCode){
                          const randomCode = ((Math.random() + 1).toString(36).substring(2)).toUpperCase();
                          setCustomCode(randomCode)
                        }
                        setRegistrationProgress("customCode-register")
                      }}
                      type='button'
                    >
                      {registrationProgress == "customCode-register" ? "Registering..." : "Register"}
                    </button>
                  </>
                ) : (
                  <button
                    className={`py-4 w-[25%] bg-secondary text-xs font-black rounded-md whitespace-nowrap transition-colors active:scale-95 duration-200`}
                    onClick={() => {
                      setRegistrationProgress("signingMessage")
                    }}
                    type='button'
                  >
                    {registrationProgress == "signingMessage" ? "Signing message..." : "Connect"}
                  </button>
                )
              }
            </div>
          </>
        )
      }
    </>
  )
}

export default Main;
