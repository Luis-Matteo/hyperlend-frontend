import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useEffect } from 'react';
import refreshIcon from '../../assets/icons/refresh.svg';

import background from '../../assets/img/shareImg/background.jpeg';
import logoImage from '../../assets/img/shareImg/logo.svg';
import circleImage from '../../assets/img/shareImg/circle.svg';
import blackBgImage from '../../assets/img/shareImg/black-bg.svg';
import moneyEyesImage from '../../assets/img/shareImg/moneyEyes.svg';

import happyLendie from '../../assets/img/shareImg/cats/happy.png';
import standingLending from '../../assets/img/shareImg/cats/standing.svg';
import swagLendie from '../../assets/img/shareImg/cats/swag.svg';
import winkLendie from '../../assets/img/shareImg/cats/wink.svg';
import logo from '../../assets/icons/logo.svg'
import { tokenNameMap, iconsMap } from '../../utils/config';

import ToggleButton from './ToggleButton';
import CardItem from './CardItem';
import Button from './Button';

interface CanvasProps {
  backgroundImage: string;
  circularImage: string;
  username: string;
  symbol: string;
  apy: string;
  dailyEarnings: string;
  tokenIcon: string;
}

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
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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
      setCircularImage(defaultCircleImage); // Reset to default image
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
          <CardItem className='px-10 py-8'>
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
              <div className='px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2 items-center'>
                    <CanvasComponent
                      backgroundImage={background}
                      circularImage={circularImage}
                      username={name}
                      symbol={tokenNameMap[token]}
                      apy={apy}
                      dailyEarnings={dailyEarnings == '0' ? '0.000' : dailyEarnings}
                      tokenIcon={iconsMap[tokenNameMap[token]]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
            title='Share'
            onClick={() =>{}}/>
          </CardItem>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const CanvasComponent: React.FC<CanvasProps> = ({
  backgroundImage,
  circularImage,
  username,
  symbol,
  apy,
  dailyEarnings,
  tokenIcon,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let multiplier = 2;

    //measurements
    let profileImageRadius = 6 * multiplier;
    let profileImageTop = 32 * multiplier;
    let profileImageLeft = 34 * multiplier;

    let circleTop = 21.5 * multiplier;
    let circleLeft = 29.5 * multiplier;
    let circleSize = 21 * multiplier;

    let meetTextTop = 34 * multiplier;
    let meetTextLeft = 55 * multiplier;

    let symbolTop = 61 * multiplier;
    let symbolLeft = 43 * multiplier;

    let assetIconTop = 53 * multiplier;
    let assetIconLeft = 30 * multiplier;
    let assetIconSize = 10 * multiplier;

    let offsetLeft = symbol.length + 12;

    let dailyEarningsTop = 61 * multiplier;
    let dailyEarningsLeft = offsetLeft + 67 * multiplier;

    let dailyEarningsOffset = dailyEarnings.length - 3;

    let blackBgLeft = dailyEarningsOffset + offsetLeft + 58 * multiplier;
    let blackBgTop = 23 * multiplier;
    let blackBgHeight = 70 * multiplier;
    let blackBgLength = offsetLeft + dailyEarningsOffset + 46 * multiplier;

    let apyTop = 108 * multiplier;
    let apyLeft = 29 * multiplier;

    let yieldsTop = 130 * multiplier;
    let yieldsLeft = 30 * multiplier;

    let linkTop = 142 * multiplier;
    let linkLeft = 30 * multiplier;

    let logoTop = 163 * multiplier;
    let logoLeft = 30 * multiplier;

    let logoImgWidth = 71 * multiplier;
    let logoImgHeight = 14 * multiplier;

    let lendieTop = -20 * multiplier;
    let lendieLeft = 147 * multiplier;
    let lendieHeight = 220 * multiplier;
    let lendieWidth = 228 * multiplier;

    const width = 353 * multiplier;
    const height = 198 * multiplier;

    canvas.width = width;
    canvas.height = height;

    const loadImages = async () => {
      const backgroundImg = new Image();
      const circularImg = new Image();
      const logoImg = new Image();
      const assetImg = new Image();
      const lendieImg = new Image();
      const circleImg = new Image();
      const blackImg = new Image();

      backgroundImg.onload = () => {
        ctx.drawImage(backgroundImg, 0, 0, width, height);

        lendieImg.src = moneyEyesImage;
        ctx.drawImage(
          lendieImg,
          lendieLeft,
          lendieTop,
          lendieWidth,
          lendieHeight,
        );

        circleImg.src = circleImage;
        ctx.drawImage(circleImg, circleLeft, circleTop, circleSize, circleSize);

        blackImg.src = blackBgImage;
        ctx.drawImage(
          blackImg,
          blackBgLeft,
          blackBgTop,
          blackBgLength,
          blackBgHeight,
        );

        logoImg.src = logoImage;
        ctx.drawImage(logoImg, logoLeft, logoTop, logoImgWidth, logoImgHeight);

        assetImg.src = tokenIcon;
        ctx.drawImage(
          assetImg,
          assetIconLeft,
          assetIconTop,
          assetIconSize,
          assetIconSize,
        );

        circularImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            profileImageLeft + profileImageRadius,
            profileImageTop,
            profileImageRadius,
            0,
            Math.PI * 2,
          );
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            circularImg,
            profileImageLeft,
            profileImageTop - profileImageRadius,
            profileImageRadius * 2,
            profileImageRadius * 2,
          );
          ctx.restore();
        };

        ctx.fillStyle = '#000';
        ctx.font = `300 ${7 * multiplier}px lufga`;
        ctx.fillText(`Meet ${username}`, meetTextLeft, meetTextTop);

        ctx.fillStyle = '#000';
        ctx.font = `400 ${8 * multiplier}px lufga`;
        ctx.fillText(symbol, symbolLeft, symbolTop);

        ctx.fillStyle = '#CAEAE5';
        ctx.font = `500 ${8 * multiplier}px lufga`;
        ctx.fillText(
          `$${dailyEarnings}/day`,
          dailyEarningsLeft,
          dailyEarningsTop + 0,
        );

        ctx.fillStyle = '#000';
        ctx.font = `900 ${40 * multiplier}px nexa`;
        ctx.fillText(`${apy}%`, apyLeft, apyTop);

        ctx.fillStyle = '#000';
        ctx.font = `400 ${5 * multiplier}px lufga`;
        ctx.fillText(
          `Unlock purrwerful yields through our lending protocol.`,
          yieldsLeft,
          yieldsTop,
        );

        ctx.fillStyle = '#000';
        ctx.font = `800 ${8 * multiplier}px lufga`;
        ctx.fillText(`hyperlend.finance`, linkLeft, linkTop);

        circularImg.onerror = () => {
          console.log('error');
        };

        circularImg.src = circularImage;
      };

      backgroundImg.src = backgroundImage;
    };

    loadImages();
  }, [backgroundImage, circularImage, dailyEarnings, apy, logoImage]);

  return <canvas ref={canvasRef} style={{ border: '1px solid #000' }} />;
};

export default ShareImageModal;
