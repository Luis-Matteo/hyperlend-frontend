import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditNameModal from './EditNameModal';
import LeaderboardRow from './LeaderboardRow';
import LeaderboardRowMobile from './LeaderboardRowMobile';

export interface IRank {
  rank: number;
  walletAddress: string;
  totalPortfolioSize: number;
  points: number;
  volume: number;
  self?: boolean;
}

const defaultRanks: Array<IRank> = [
  {
    rank: 1,
    walletAddress: '0xebb6...2b89',
    totalPortfolioSize: 1_003_000_000,
    points: 2_100,
    volume: 2_000_000,
  },
  {
    rank: 3,
    walletAddress: '0xebb6...2b89',
    totalPortfolioSize: 1_003_000_000,
    points: 2_100,
    volume: 2_000_000,
  },
  {
    rank: 2,
    walletAddress: '0xebb6...2b89',
    totalPortfolioSize: 1_003_000_000,
    points: 2_100,
    volume: 2_000_000,
  },
  {
    rank: 5,
    walletAddress: '0xebb6...2b89',
    totalPortfolioSize: 1_003_000_000,
    points: 2_100,
    volume: 2_000_000,
  },
  {
    rank: 4,
    walletAddress: '0xebb6...2b89',
    totalPortfolioSize: 1_003_000_000,
    points: 2_100,
    volume: 2_000_000,
    self: true,
  },
];

function Leaderboard() {
  const [ranks, setRanks] = useState<Array<IRank>>([]);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  useEffect(() => {
    setRanks(() => {
      return defaultRanks.sort((a, b) => (a.rank > b.rank ? 1 : -1));
    });
  }, []);

  const selfRank = ranks.find((rank) => rank?.self);
  return (
    <div>
      <EditNameModal
        isOpen={isEditNameModalOpen}
        setIsOpen={setIsEditNameModalOpen}
      />

      <Card className='w-full bg-primary-light border-gray-dark border-[3px] p-0'>
        <div className=' bg-primary-light w-full h-20 rounded-t-lg flex items-center px-8'>
          <div className='relative w-full md:w-2/5'>
            <Search className='absolute left-8 top-1/2 -translate-y-1/2 text-secondary/10' />
            <Input
              className='py-4 w-full pl-16 placeholder:text-secondary/10 placeholder:font-medium text-white font-medium border-secondary/10 rounded-xl'
              placeholder='Search by wallet address'
            />
          </div>
        </div>
        <Table className='text-white hidden md:table'>
          <TableHeader className='w-full  h-12'>
            <TableRow className='h-full bg-gray-dark border-none'>
              <TableHead className='w-fit md:w-1/5 text-left font-semibold pl-4 md:pl-16'>
                Rank
              </TableHead>
              <TableHead className='w-fit md:w-1/5 text-center font-semibold'>
                Wallet Address
              </TableHead>
              <TableHead className='w-fit md:w-1/5 text-center font-semibold'>
                Total Portfolio Size
              </TableHead>
              <TableHead className='w-fit md:w-1/5 text-center font-semibold'>
                Points
              </TableHead>
              <TableHead className='w-fit md:w-1/5 text-right font-semibold pr-4 md:pr-16'>
                Volume
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='px-16'>
            {selfRank ? (
              <LeaderboardRow
                rank={selfRank}
                setIsEditNameModalOpen={setIsEditNameModalOpen}
              />
            ) : (
              ''
            )}
            {ranks
              .filter((rank) => !rank.self)
              .map((rank) => (
                <LeaderboardRow
                  rank={rank}
                  setIsEditNameModalOpen={setIsEditNameModalOpen}
                />
              ))}
          </TableBody>
        </Table>
        <div className='md:hidden text-secondary px-8 pb-8'>
          {selfRank ? (
            <LeaderboardRowMobile
              rank={selfRank}
              setIsEditNameModalOpen={setIsEditNameModalOpen}
            />
          ) : (
            ''
          )}
          {ranks
            .filter((rank) => !rank.self)
            .map((rank) => (
              <LeaderboardRowMobile
                rank={rank}
                setIsEditNameModalOpen={setIsEditNameModalOpen}
              />
            ))}
        </div>
      </Card>
    </div>
  );
}
export default Leaderboard;
