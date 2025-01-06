import { bronzeIcon, logoTrans} from '@/assets'
import { Card } from '@/components/ui/card'
import { ArrowUpIcon } from 'lucide-react'

function PointTiers() {
  return (
    <Card className='row-start-1 col-start-1 col-span-5 md:col-span-3 bg-gray-dark border-bronze/75 border-[3px] min-h-40 px-8 py-4 flex flex-col gap-y-4 md:gap-y-0  md:flex-row items-center'>
      {/* <CardContent className='w-full h-full  flex items-end'> */}
        <div className='w-full h-16 flex-1 flex justify-around '>
          <img className='w-16 h-16 aspect-square' src={logoTrans} alt='' width="100%" height="100%" />
          <div className=''>
            <h4 className='text-secondary'>Tier</h4>
            <div className='flex items-center gap-x-2'>
              <img className='w-8' src={bronzeIcon} alt='' width="100%" height="100%" />
              <p className='text-bronze text-lg'>Bronze</p>
            </div>
          </div>
        </div>
        <div className='min-h-16 w-full text-secondary flex-1 flex justify-around'> 
          <div className='flex flex-col gap-y-2'>
            <h4>Rank</h4>
            <div className='flex'>
              <p>1874</p>
              <span className='flex items-center'>
                {/* up arrow icon */}
                <ArrowUpIcon size={18} className=' text-green-500'/>
                <span className='text-xs text-green-500'>21</span>
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-y-2'>
            <h4>Total Points</h4>
            <p>
              785
            </p>
          </div>
        </div>
      {/* </CardContent> */}
    </Card>
  )
}

export default PointTiers