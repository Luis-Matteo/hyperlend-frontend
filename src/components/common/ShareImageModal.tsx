import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { toPng } from 'html-to-image';
import Button from './Button';
import ToggleButton from './ToggleButton';
import CardItem from './CardItem';
import ShareImg from '../shareImg/ShareImg';
import { iconsMap, tokenNameMap } from '../../utils/config';

import refreshIcon from '../../assets/icons/refresh.svg';
import happyLendie from '../../assets/img/share-img/cats/happy.png';
import standingLending from '../../assets/img/share-img/cats/standing.svg';
import swagLendie from '../../assets/img/share-img/cats/swag.svg';
import winkLendie from '../../assets/img/share-img/cats/wink.svg';
import logo from '../../assets/icons/logo.svg';
import dollarcatImage from '../../assets/img/share-img/dollar-cat.svg';
import glasscatImage from '../../assets/img/share-img/glass-cat.svg';
import rabbitcatImage from '../../assets/img/share-img/rabbit-cat.svg';
import bottlecatImage from '../../assets/img/share-img/bottle-cat.svg';

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

function ShareImageModal({
  token,
  apy,
  dailyEarnings,
  onClose,
}: IShareImageModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected image index
  const [name, setName] = useState<string>('HyperLend user');
  const [fetchTwitterPhoto, setFetchTwitterPhoto] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [circularImage, setCircularImage] = useState<string>(getDefaultImage());
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]); // Create array of refs

  const handleNameChange = (e: any) => setName(e.target.value);

  const handleRotate = () => setRotationAngle((prevAngle) => prevAngle + 360);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => setErrorMsg(''), 4000);
    }
  }, [errorMsg]);

  useEffect(() => {
    getTwitterImage();
  }, [fetchTwitterPhoto, rotationAngle]);

  const getTwitterImage = () => {
    if (fetchTwitterPhoto && name) {
      setCircularImage(`https://api.hyperlend.finance/twitterImage/${name}`);
    } else {
      setCircularImage(getDefaultImage());
    }
  };

  const downloadImage = () => {
    const index = selectedIndex || 0;
    if (selectedIndex == null) setSelectedIndex(0);
    if (imageRefs.current[index] === null) return;

    toPng(imageRefs.current[index]!, { cacheBust: true })
      .then((dataUrl: any) => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err: any) => {
        console.error('Could not download image', err);
        alert(`Error downloading image: ${JSON.stringify(err)}`)
      });
  };

  const openTwitterShare = () => {
    const link =
      localStorage.getItem('referral-link') || window.location.origin;
    const text = `Join me and unlock powerful yields on ${link}`;
    const url = `https://x.com/intent/post?text=${text}`;
    const win = window.open(url, '_blank');
    win?.focus();
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
                <img src={logo} alt='logo' className='' />
                <p className='font-nexa font-black text-xl text-secondary'>
                  Share your position
                </p>
              </div>
              <div className='flex flex-col justify-center items-center gap-2'>
                <p className='font-lufga text-sm font-light text-secondary'>
                  X (Twitter) username{' '}
                </p>
                <input
                  autoFocus
                  type='text'
                  className='form-control-plaintext text-center font-lufga text-xl text-secondary border-0 p-0 border-b-2 border-[#212325]'
                  value={name === 'HyperLend user' ? '' : name}
                  onChange={handleNameChange}
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
                <p>Use X (Twitter) profile photo?</p>
                <ToggleButton
                  status={fetchTwitterPhoto}
                  setStatus={setFetchTwitterPhoto}
                />
                <motion.img
                  src={refreshIcon}
                  alt='refresh'
                  style={{ cursor: 'pointer' }}
                  onClick={handleRotate}
                  animate={{ rotate: rotationAngle }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </div>

              {errorMsg && (
                <div className='flex justify-between mb-2'>
                  <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>
                    {errorMsg}
                  </p>
                </div>
              )}

              <div className='md:px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto'>
                  {shareItems.map((item, index) => (
                    <div
                      key={item.catImage}
                      ref={(el) => (imageRefs.current[index] = el)} // Assign each image div a ref
                      onClick={() => setSelectedIndex(index)} // Set selected index
                      style={{
                        transform:
                          selectedIndex === index ? 'scale(0.95)' : 'scale(1)',
                        cursor: 'pointer',
                      }}
                    >
                      <ShareImg
                        catImage={item.catImage}
                        circularImage={circularImage}
                        username={name}
                        symbol={tokenNameMap[token]}
                        apy={apy}
                        dailyEarnings={
                          dailyEarnings === '0' ? '0.000' : dailyEarnings
                        }
                        tokenIcon={iconsMap[tokenNameMap[token]]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-4'>
              <Button title='Share' onClick={openTwitterShare} />
              <Button title='Download Image' onClick={downloadImage} />
            </div>
          </CardItem>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ShareImageModal;

const shareItems = [
  { catImage: dollarcatImage },
  { catImage: glasscatImage },
  { catImage: rabbitcatImage },
  { catImage: bottlecatImage },
];
