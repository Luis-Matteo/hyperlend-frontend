import { getUserPoints } from '../../utils/user/points';
import { formatNumber } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';

function Status() {
  const userPoints = getUserPoints();

  return (
    <div className='flex gap-4 pr-3 blur-xs'>
      <p className='text-grey-light font-lufga p-3 border-2 rounded-full text-lg h-14 aspect-square border-secondary text-center'>
        {userPoints.level}
      </p>
      <div className='w-full'>
        <p className='text-grey-light font-lufga'>Level {userPoints.level}</p>
        <p className='font-lufga text-gray text-[14px]'>
          XP: {formatNumber(userPoints.totalPoints, 0)}
        </p>
        <div className='pt-2'>
          <ProgressBar progress={userPoints.progress} className='h-1.5' />
        </div>
      </div>
    </div>
  );
}

export default Status;
