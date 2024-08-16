const Factor = () => {
    const dots = Array.from({ length: 25 }); // Adjust the number of dots
  
    return (
      <div className="relative border-2 shadow-custom border-[#252525] w-72 h-72 rounded-full bg-transparent">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full flex justify-center items-center">
          {dots.map((_, index) => {
            const angle = (index / dots.length) * 180 - 90; // Half circle angle calculation
            const rotation = `rotate(${angle}deg)`;
            // Calculate opacity for background
            const middleIndex = Math.floor(dots.length * 0.66);
            const opacity =
              index < middleIndex
                ? (index / middleIndex) * 0.8 // Fade from 0 to 0.8
                : 1; // Fade from 0.8 to 0
  
            let color;
  
            if (index < 9) color = `rgba(255, 2555, 2555, ${opacity * 1.8})`;
            else if (index < 17)
              color = `rgba(220, 38, 38, ${opacity})`; // Apply dynamic opacity
            else color = "bg-[#282829]";
    
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
          <span className="text-white font-bold text-3xl">1.2</span>
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
  