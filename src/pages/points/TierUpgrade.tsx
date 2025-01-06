import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { tiers, TierNames } from '@/utils/constants/tiers';
import { useState } from 'react';

function TierUpgrade({ newTier }: { newTier: TierNames }) {
  const [isOpen, setIsOpen] = useState(true);

  const {
    name: rankName,
    icon: rankIcon,
    color: rankColor,
    bg: rankBg,
  } = tiers[newTier];

  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='bg-primary text-secondary text-center flex flex-col justify-center gap-y-12 py-16 px-16 border-none h-screen md:h-auto'>
        <div className='absolute top-0 right-0'>
          <img src={rankBg} />
        </div>
        <div
          className='absolute top-0 left-0 '
          style={{
            transform: 'rotateY(180deg)',
          }}
        >
          <img src={rankBg} />
        </div>
        <div className='flex flex-col items-center  gap-y-2'>
          <img src={rankIcon} className='w-32 aspect-square' />
          <h2 className='text-sm font-medium'>Tier Upgrade</h2>
          <h3
            className={`text-5xl font-semibold `}
            style={{ color: rankColor }}
          >
            {rankName}
          </h3>
        </div>
        <p className='text-sm font-medium'>
          Well done! You’ve entered the{' '}
          <span className={``} style={{ color: rankColor }}>
            {rankName}
          </span>{' '}
          tier, the realm of top-tier players. Now, let’s see what’s next!
        </p>
        <Button
          className='rounded-md py-5'
          style={{
            background: `linear-gradient(to right, ${rankColor}, 90%, white)`,
          }}
          onClick={() => setIsOpen(false)}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export default TierUpgrade;
