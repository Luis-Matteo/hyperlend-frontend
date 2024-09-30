import { formatNumber } from "../../utils/functions";

interface FactorProps {
  healthFactor: number;
}

const Factor = ({ healthFactor }: FactorProps) => {
  const dots = Array.from({ length: 25 }); // Adjust the number of dots

  const maxHf = 3;
  const hf = isNaN(healthFactor) ? 0 : healthFactor;

  return (
    <div className="relative border-2 shadow-custom border-[#252525] w-72 h-72 rounded-full bg-transparent">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full flex justify-center items-center">
        {dots.map((_, index) => {
          const angle = (index / dots.length) * 180 - 90; // Half circle angle calculation
          const rotation = `rotate(${angle}deg)`;
          const maxOpacity = (hf / maxHf) * 100 + 40;
          const opacityRaw =
            hf > maxHf
              ? (index * (100 / dots.length)) / 100
              : (index * maxOpacity) / dots.length / 100;
          const opacity = Math.max(0.1, Math.min(opacityRaw, 1));

          // Calculate color
          const hue = Math.floor((index / dots.length) * 120); // 0 to 120 (red to green)
          let color = `hsla(${hue}, 100%, 50%, ${opacity})`;

          if (index > hf * (dots.length / maxHf)) color = `bg-[#282829]`;

          return (
            <div
              key={index}
              className={`absolute w-1 h-3  rounded-full ${color}`}
              style={{
                transform: `${rotation} translate(0, -99px)`, // Adjust this value for spacing
                backgroundColor: color, // Apply dynamic color
              }}
            ></div>
          );
        })}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-white font-bold text-3xl">
          {isNaN(healthFactor) ? 0 : formatNumber(healthFactor, 2)}
        </span>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full flex justify-center items-center">
        {/* Dots with gradient background opacity */}
        {dots.map((_, index) => {
          const angle = (index / dots.length) * 180 - 90; // Half circle angle calculation
          const rotation = `rotate(${angle}deg)`;

          // Calculate opacity for background
          const middleIndex = Math.floor(dots.length / 2);
          const opacity =
            index < middleIndex
              ? (index / middleIndex) * 0.8 // Fade from 0 to 0.8
              : ((dots.length - index) / middleIndex) * 0.8; // Fade from 0.8 to 0

          return (
            <div
              key={index}
              className={`absolute w-3 h-3 rounded-full border border-[#CAEAE5]`}
              style={{
                transform: `${rotation} translate(0, -179px)`, // Adjust this value for spacing
                backgroundColor: `rgba(202, 234, 229, ${opacity})`, // Apply dynamic background opacity
                borderColor: `rgba(202, 234, 229, ${opacity})`, // Apply dynamic opacity
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Factor;
