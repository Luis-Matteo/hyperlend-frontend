import { TableCell, TableRow } from '@/components/ui/table';
import { IRank } from './Leaderboard';
import { Pencil } from 'lucide-react';
import { rankOne, rankThree, rankTwo } from '@/assets';

function LeaderboardRow({
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
    <TableRow className='border-gray-dark'>
      <TableCell className='w-fit md:w-1/5 font-medium text-left pl-4 md:pl-16'>
        <div className='flex items-center gap-x-2'>
          <span>{position}</span>
          {position === 1 ? (
            <img className='w-6 aspect-square' src={rankOne} />
          ) : position === 2 ? (
            <img className='w-6 aspect-square' src={rankTwo} />
          ) : position === 3 ? (
            <img className='w-6 aspect-square' src={rankThree} />
          ) : (
            ''
          )}
          {self && (
            <span className='border border-secondary bg-gray-dark text-xs font-medium px-2 py-1 rounded'>
              You
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className='w-fit md:w-1/5 font-medium text-center'>
        <div className='w-full flex items-center justify-center gap-x-2'>
          <p>{walletAddress}</p>
          {self && <EditButton />}
        </div>
      </TableCell>
      <TableCell className='w-fit md:w-1/5 font-medium text-center'>
        ${totalPortfolioSize}
      </TableCell>
      <TableCell className='w-fit md:w-1/5 font-medium text-center'>
        {points}
      </TableCell>
      <TableCell className='w-fit md:w-1/5 font-medium text-right pr-4 md:pr-16'>
        ${volume}
      </TableCell>
    </TableRow>
  );
}
export default LeaderboardRow;
