import { useState } from 'react';

import ProgressBar from '../common/PercentBar';
import MyChart from '../dashboard/Chart';

interface EarningsProps {
  toggleHistory: () => void;
}

const Earnings = ({ toggleHistory }: EarningsProps) => {
  const [day, setDay] = useState<number>(30);

  const days = [30, 14, 7];
  const data = [
    100000, 100358, 101006, 102529, 102295, 102060, 103640, 104407, 103938,
    104480, 104017, 103551, 103793, 101880, 100155, 99592, 98580, 98894, 97986,
    96574, 98039, 97813, 97881, 96456, 95912, 96023, 94872, 95247, 94647, 94355,
    93753, 95606, 95592, 94534, 95357, 94136, 94345, 92385, 91057, 91254, 91992,
    92164, 92048, 91747, 90269, 89549, 89088, 90145, 90489, 88726, 89050, 88665,
    87988, 88600, 89631, 90562, 89723, 89413, 89745, 90720, 90241, 90055, 88949,
    87753, 88565, 89922, 89850, 90853, 91215, 90570, 90931, 92469, 92433, 93998,
    91378, 92200, 92287, 91988, 92080, 90092, 89873, 90230, 91708, 91189, 90381,
    89879, 90795, 91123, 90593, 91107, 91204, 92172, 91470, 91143, 90751, 89287,
    89583, 89844, 89849, 89615, 88199, 87779, 87436, 86634, 86473, 86877, 88763,
    88937, 89195, 89120, 87202, 87175, 87235, 89699, 89506, 89808, 89773, 88604,
    89747, 90499, 91290, 90381, 91784, 90382, 90969, 93159, 92169, 91602, 91702,
    91198, 89648, 89716, 88654, 89128, 88208, 89758, 88975, 88653, 89466, 88235,
    88463, 89770, 88163, 88347, 88607, 89389, 88152, 86832, 87353, 87650, 87901,
    88247, 87567, 87800, 88093, 87378, 89244, 89718, 88527, 89183, 88209, 88996,
    90154, 89334, 90297, 90710, 91532, 93429,
  ];

  console.log(day);

  return (
    <>
      <div className='flex flex-col gap-5 w-full items-center'>
        <div className='flex gap-5 w-full '>
          <div className='flex flex-col gap-5 w-full'>
            <div className='bg-[#1F2A29] rounded-md p-2 flex justify-between items-end w-full'>
              <div className='px-2'>
                <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                  Total Points
                </p>
                <p className='text-secondary font-lufga text-xl font-black my-2'>
                  10,494.93
                </p>
              </div>
              {/* <button
                className='inline-block px-7 py-3 bg-secondary text-xs font-black rounded-lg'
                type='button'
              >
                Claim
              </button> */}
            </div>
            <div className='bg-[#1F2A29] rounded-md p-2 flex justify-between items-end'>
              <div className='px-2'>
                <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                  Referral Points
                </p>
                <p className='text-secondary font-lufga text-xl font-black my-2'>
                  104,494.93
                </p>
              </div>
            </div>
          </div>
          <div className='bg-[#1F2A29] rounded-md p-2 w-full'>
            <div className='px-2 w-full'>
              <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                Referral Tier
              </p>
              <p className='text-secondary font-lufga text-2xl font-black mt-2 mb-6'>
                Tier 1
              </p>
              <p className='text-secondary font-lufga text-opacity-40 text-xs font-black mb-3'>
                Tier Progress
              </p>
              <ProgressBar progress={60} className='h-[7px]' />
            </div>
          </div>
        </div>
        <div className='bg-[#1F2A29] rounded-md p-2 w-full'>
          <div className='px-2 flex justify-between items-center'>
            <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
              Referral Points History
            </p>
            <div className='flex gap-2'>
              {(days || []).map((item) => (
                <button
                  className='px-4 py-1 bg-[#081916] rounded-full'
                  key={item}
                  onClick={() => setDay(item)}
                >
                  <p className='text-[#797979] text-xs font-lufga'>{item}d</p>
                </button>
              ))}
            </div>
          </div>
          <div className='h-[120px]'>
            <MyChart data={data} />
          </div>
        </div>
        <div className='bg-[#1F2A29] rounded-md p-2 w-full flex justify-between items-center'>
          <p className='text-secondary font-lufga text-opacity-40 text-xs font-black px-2'>
            Referral History
          </p>
          <button
            className='px-8 py-3 bg-secondary bg-opacity-40 rounded-md mx-2 text-xs font-black'
            onClick={() => toggleHistory()}
          >
            View History
          </button>
        </div>
      </div>
    </>
  );
};

export default Earnings;
