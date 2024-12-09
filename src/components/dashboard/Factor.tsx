import { formatNumber } from '../../utils/functions';

interface FactorProps {
  healthFactor: number;
}

const Factor = ({ healthFactor }: FactorProps) => {
  const length = 20;
  const size = 300;
  const dots = Array.from({ length: length }); // Adjust the number of dots
  const maxHf = 3;
  const hf = isNaN(healthFactor) ? 0 : healthFactor;

  return (
    <div
      className='bg-transparent overflow-hidden'
      style={{
        width: size,
        height: size - 80,
      }}
    >
      <div
        className='relative w-full h-full'
        style={{
          transform: 'translateY(40px)',
        }}
      >
        <div className=''>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center'>
            {dots.map((_, index) => {
              const angle =
                (index / dots.length) * (180 * (length / (length - 1))) - 90;
              const rotation = `rotate(${angle}deg)`;
              const hue = Math.floor(((index + 1) / dots.length) * 100); // 0 to 120 (red to green)
              let color = `hsla(1, ${hue}%, ${100 - (hue * (100 - 50)) / 100}%, 1)`;
              if (index > hf * (dots.length / maxHf)) color = `bg-[#282829]`;
              return (
                <div
                  key={index}
                  className={`absolute w-1 h-3 rounded-full ${color}`}
                  style={{
                    transform: `${rotation} translate(0, -${size - 210}px)`, // Adjust this value for spacing
                    backgroundColor: color, // Apply dynamic color
                  }}
                ></div>
              );
            })}
          </div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <span
              className={`font-bold text-3xl ${healthFactor > 1.3 ? 'text-white' : 'text-error'}`}
            >
              {isNaN(healthFactor) ? 0 : formatNumber(healthFactor, 2)}
            </span>
          </div>
          <div
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2B2B2B] shadow-[0px_0px_30px_#252B3B]'
            style={{
              width: size - 70,
              height: size - 70,
            }}
          />
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center'>
            {dots.map((_, index) => {
              const angle =
                (index / dots.length) * (180 * (length / (length - 1))) - 90;
              const rotation = `rotate(${angle}deg)`;
              const middleIndex = Math.floor(dots.length / 2);
              const opacity =
                index < middleIndex
                  ? ((index + 1) / middleIndex) * 0.8 // Fade from 0 to 0.8
                  : ((dots.length - index) / middleIndex) * 0.8; // Fade from 0.8 to 0
              return (
                <div
                  key={index}
                  className={`absolute w-3 h-3 rounded-full border border-[#CAEAE5]`}
                  style={{
                    transform: `${rotation} translate(0, -${size - 160}px)`, // Adjust this value for spacing
                    backgroundColor: `rgba(202, 234, 229, ${opacity})`, // Apply dynamic background opacity
                    borderColor: `rgba(202, 234, 229, ${opacity})`, // Apply dynamic opacity
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Factor;
