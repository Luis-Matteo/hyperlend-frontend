import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import React, {  useEffect } from 'react';
import refreshIcon from '../../assets/icons/refresh.svg';

import happyLendie from '../../assets/img/share-img/cats/happy.png';
import standingLending from '../../assets/img/share-img/cats/standing.svg';
import swagLendie from '../../assets/img/share-img/cats/swag.svg';
import winkLendie from '../../assets/img/share-img/cats/wink.svg';
import logo from '../../assets/icons/logo.svg'

import ToggleButton from './ToggleButton';
import CardItem from './CardItem';
import Button from './Button';

import ShareImg from '../shareImg/ShareImg';
import { iconsMap, tokenNameMap } from '../../utils/config';

interface IShareImageModalProps {
  token: string;
  apy: string;
  dailyEarnings: string;
  onClose: () => void;
}

const getDefaultImage = (): string => {
  const array = [happyLendie, standingLending, swagLendie, winkLendie];
  return array[Math.floor(Math.random() * array.length)];
};

function ShareImageModal(
  {
    token,
    apy,
    dailyEarnings,
    onClose,
  }: IShareImageModalProps
) {
  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };


  console.log(token, apy, dailyEarnings)
  const defaultCircleImage = getDefaultImage();
  const [name, setName] = useState<string>('HyperLend user');
  const [fetchTwitterPhoto, setFetchTwitterPhoto] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [circularImage, setCircularImage] =
    useState<string>(defaultCircleImage);

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleRotate = () => {
    setRotationAngle((prevAngle) => prevAngle + 360);
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg('');
      }, 4000);
    }
  }, [errorMsg]);

  useEffect(() => {
    getTwitterImage();
  }, [fetchTwitterPhoto, rotationAngle]);

  const getTwitterImage = () => {
    if (fetchTwitterPhoto && name) {
      const imageURL = `https://unavatar.io/twitter/${name}`;
      setCircularImage(imageURL);
    } else {
      setCircularImage(defaultCircleImage);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClickOutside}
        className='fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm'
      >
        <motion.div
          initial={{ scale: 0, rotate: '12.5deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          exit={{ scale: 0, rotate: '0deg' }}
          className='shadow-4xl rounded-2xl'
        >
          <CardItem className='px-5 sm:px-10 py-8 max-h-[calc(100vh-50px)] overflow-auto'>
            <div className='flex flex-col justify-center items-center gap-5 text-center'>
              <div className='flex flex-col gap-3 justify-center items-center'>
                <div className=''>
                  <img className=''
                    src={logo} alt="logo" />
                </div>
                <p className='font-nexa font-black text-xl text-secondary'>
                  Share your position
                </p>
              </div>
              <div className='flex flex-col justify-center items-center gap-2'>
                <p className='font-lufga text-sm font-light text-secondary'>
                  X (Twitter) username{' '}
                </p>
                <input
                  autoFocus={true}
                  type='text'
                  className='form-control-plaintext text-center font-lufga text-xl text-secondary border-0 p-0 border-b-2 border-[#212325]'
                  value={name == 'HyperLend user' ? '' : name}
                  onChange={(e) => {
                    handleNameChange(e);
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
              <div className='flex justify-center items-center gap-4 text-white text-sm'>
                <p className=''>
                  Use X (Twitter) profile photo?
                </p>

                <ToggleButton
                  status={fetchTwitterPhoto}
                  setStatus={setFetchTwitterPhoto} />
                <motion.img
                  src={refreshIcon}
                  alt='refresh'
                  style={{ cursor: 'pointer' }}
                  onClick={handleRotate}
                  animate={{
                    rotate: rotationAngle,
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {errorMsg ? (
                <div className='flex justify-between mb-2'>
                  <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>
                    {errorMsg}
                  </p>
                </div>
              ) : (
                ''
              )}

              <div className='md:px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto'>
                  {
                    shareItems.map((item) => (
                      <ShareImg
                      catImage={item.catImage}
                      circularImage={circularImage}
                      username={name}
                      symbol={tokenNameMap[token]}
                      apy={apy}
                      dailyEarnings={dailyEarnings == '0' ? '0.000' : dailyEarnings}
                      tokenIcon={iconsMap[tokenNameMap[token]]}
                      />
                    ))
                  }
                </div>
              </div>
            </div>
            <Button
              title='Share'
              onClick={() => { }} />

          </CardItem>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


export default ShareImageModal;

const shareItems = [
  { catImage: "/src/assets/img/share-img/money-eyes.svg" },
  { catImage: "/src/assets/img/share-img/money-eyes.svg" },
  { catImage: "/src/assets/img/share-img/money-eyes.svg" },
  { catImage: "/src/assets/img/share-img/money-eyes.svg" },
];
