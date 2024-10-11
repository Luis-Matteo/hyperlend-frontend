import { useState } from 'react'
import { AnimatePresence, motion, progress } from 'framer-motion';
import React, { useRef, useEffect } from 'react';
import xmarkIcon from '../../assets/icons/xmark-icon.svg';

import background from '../../assets/img/shareImg/background.jpeg';
import circle from '../../assets/img/shareImg/circle.jpg';
import { tokenNameMap } from '../../utils/config';


interface CanvasProps {
  backgroundImage: string;
  circularImage: string;
  text: string;
}

interface IShareImageModalProps {
  token: string,
  apy: string,
  onClose: () => void;
}

function ShareImageModal({ token, apy, onClose }: IShareImageModalProps) {
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const [name, setName] = useState<string>('HyperLend user')

  const handleNameChange = (e: any) => {
    setName(e.target.value)
  }

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
          className='px-6 py-4 bg-primary-light rounded-2xl'
        >
          <div className='flex justify-between items-center mb-6'>
            <p className='font-lufga font-light text-[#797979]'>
              Share your position 
            </p>
            <button className='' onClick={onClose}>
              <img src={xmarkIcon} alt='close' />
            </button>
          </div>
          <div className='text-white'>
            You name: <input
              type='text'
              className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left'
              value={name == "HyperLend user" ? '' : name}
              onChange={(e) => {
                handleNameChange(e)
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
          <div className='px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4 mb-5'>
            <div className='flex justify-between items-center'>
              <div className='flex gap-2 items-center'>
              <CanvasComponent
                backgroundImage={background}
                circularImage={circle}
                text={`Meet ${name}!\nThey are earning ${apy}% APY\non ${tokenNameMap[token]}`}
              />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const CanvasComponent: React.FC<CanvasProps> = ({ backgroundImage, circularImage, text }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 400;
    const circleRadius = 70;
    const circleX = 40;
    const circleY = height / 2;

    canvas.width = width;
    canvas.height = height;

    const loadImages = async () => {
      const backgroundImg = new Image();
      const circularImg = new Image();

      backgroundImg.src = backgroundImage;
      circularImg.src = circularImage;

      backgroundImg.onload = () => {
        ctx.drawImage(backgroundImg, 0, 0, width, height);

        //draw twitter image
        circularImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(circleX + circleRadius, circleY, circleRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(circularImg, circleX, circleY - circleRadius, circleRadius * 2, circleRadius * 2);
          ctx.restore();

          //add text to the right of the circle
          ctx.fillStyle = '#000';
          ctx.font = '40px lufga';
          let lines = text.split("\n")
          for (let i in lines){
            ctx.fillText(lines[i], circleX + circleRadius * 2 + 10, circleY - 30 + (Number(i) * 40));
          }

          let joinThemLines = `\n\nJoin them at hyperlend.finance`.split("\n")
          ctx.font = '20px lufga';
          for (let i in joinThemLines){
            ctx.fillText(joinThemLines[i], circleX + circleRadius * 2 + 10, circleY - 30 + ((Number(lines.length) + Number(i)) * 40));
          }
        };
      };
    };

    loadImages();
  }, [backgroundImage, circularImage, text]);

  return <canvas ref={canvasRef} style={{ border: '1px solid #000' }} />;
};

export default ShareImageModal;
