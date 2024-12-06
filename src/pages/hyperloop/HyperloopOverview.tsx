import { useState } from 'react';
import Loop from '../../components/hyperloop/Loop';
import MyPositions from '../../components/hyperloop/MyPositions';


const typeButtons = [
  {
    id: "loop",
    title: "loop"
  },
  {
    id: "my-positions",
    title: "my positions"
  }
]
function HyperloopOverview() {

  const [activeType, setActiveType] = useState<string>('loop');

  return (
    <>
      <div className='w-full grid grid-cols-2 text-center'>
        {typeButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveType(button.id)}
          >
            <p
              className={`text-base font-lufga capitalize transition-colors duration-300 ease-in-out ${activeType === button.id ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
            >
              {button.title}
            </p>
            <hr
              className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${activeType === button.id ? 'text-white' : 'text-[#546764]'}`}
            />
          </button>
        ))}
      </div>
      {
        activeType === "loop" &&
        <Loop />
      }
      {
        activeType === "my-positions" &&
        <MyPositions />
      }
    </>
  );
}

export default HyperloopOverview;
