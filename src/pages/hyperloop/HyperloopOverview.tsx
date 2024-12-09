import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loop from '../../components/hyperloop/Loop';
import MyPositions from '../../components/hyperloop/MyPositions';

const typeButtons = [
  {
    id: 'loop',
    title: 'loop',
  },
  {
    id: 'my-positions',
    title: 'my positions',
  },
];
function HyperloopOverview() {
  const [activeType, setActiveType] = useState<string>('loop');

  return (
    <>
      <div className='w-full grid grid-cols-2 text-center'>
        {typeButtons.map((button) => (

          <motion.button
            key={button.id}
            onClick={() => setActiveType(button.id)}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
          >
            <p
              className={`text-base font-lufga capitalize transition-colors duration-300 ease-in-out ${activeType === button.id ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
            >
              {button.title}
            </p>
            <hr
              className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${activeType === button.id ? 'text-white' : 'text-[#546764]'}`}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeType === "loop" && (
          <Loop />
        )}
        {activeType === "my-positions" && (
          <MyPositions />
        )}
      </AnimatePresence>
    </>
  );
}

export default HyperloopOverview;
