import { status } from '../../utils/mock';
import { formatNumber } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';

function Status() {
  return (
    <div className="flex gap-4 pr-3 blur-xs">
      <p className="text-grey-light font-lufga p-3 border-2 rounded-full text-lg h-14 aspect-square border-secondary text-center">
        {status.level}
      </p>
      <div className="w-full">
        <p className="text-grey-light font-lufga">
          Level
          {' '}
          {status.level}
        </p>
        <p className="font-lufga text-gray text-[14px]">
          XP:
          {' '}
          {formatNumber(status.xp, 0)}
        </p>
        <div className="pt-2">
          <ProgressBar progress={status.progress} className='h-1.5'/>
        </div>
      </div>
    </div>
  );
}

export default Status;
