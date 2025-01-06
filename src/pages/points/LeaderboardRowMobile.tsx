import { Pencil } from 'lucide-react';
import { IRank } from './Leaderboard';
import { rankOne, rankThree, rankTwo } from '@/assets';

function LeaderboardRowMobile({
  rank,
  setIsEditNameModalOpen,
}: {
  rank: IRank;
  setIsEditNameModalOpen: (open: boolean) => void;
}) {
  const EditButton = () => (
    <button
      onClick={() => setIsEditNameModalOpen(true)}
      className='p-2 border border-secondary rounded-md'
    >
      <Pencil className='' size={10} />
    </button>
  );
  const {
    rank: position,
    totalPortfolioSize,
    points,
    volume,
    walletAddress,
    self,
  } = rank;

  return (
    <div className='flex flex-col gap-y-4 border-b-[1px] border-secondary/10 py-2'>
      <div className='flex items-center gap-x-8'>
        <p>{walletAddress}</p>
        {self && (
          <div className='flex items-center gap-x-2'>
            <EditButton />
            <span className='border border-secondary bg-gray-dark text-xs font-medium px-2 py-1 rounded'>
              You
            </span>
          </div>
        )}
      </div>
      <div className='flex gap-x-32 sm:gap-x-64'>
        <div>
          <h3 className='text-sm'>Rank</h3>
          <div className='flex items-center gap-x-2'>
            <span className='font-semibold'>{position}</span>
            {position === 1 ? (
              <img className='w-6 aspect-square' src={rankOne} />
            ) : position === 2 ? (
              <img className='w-6 aspect-square' src={rankTwo} />
            ) : position === 3 ? (
              <img className='w-6 aspect-square' src={rankThree} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div>
          <h3 className='text-sm'>Total Portfolio Size</h3>
          <span className='font-semibold'>${totalPortfolioSize}</span>
        </div>
      </div>
      <div className='flex gap-x-32 sm:gap-x-64'>
        <div>
          <h3 className='text-sm'>Points</h3>
          <span className='font-semibold'>{points}</span>
        </div>
        <div>
          <h3 className='text-sm'>Volume</h3>
          <span className='font-semibold'>${volume}</span>
        </div>
      </div>
    </div>
  );
}
export default LeaderboardRowMobile;
