import { bronzeBg, bronzeIcon, logo } from "@/assets"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function RankImage() {
  return (
    <Card className="row-start-2 md:row-start-1 col-start-1 md:col-start-4 col-span-5 md:col-span-2  bg-primary border-bronze p-2">
        <CardContent className="relative p-0 pt-4 bg-primary flex flex-col items-center gap-y-6">
            <div className="absolute top-0 right-0">
            <img src={bronzeBg}/>
            </div>
            <div className="absolute top-0 left-0 " style={{
                transform: "rotateY(180deg)"
            }}>
            <img src={bronzeBg}/>
            </div>
            <div className="flex items-center gap-x-2">
                <img className='w-6' src={logo} alt='' width="100%" height="100%" />
                <h3 className="text-secondary font-semibold">HyperLend</h3>
            </div>
            <div className="border-2 border-bronze w-max rounded-full p-4">
                <img className='w-14' src={bronzeIcon} alt='' width="100%" height="100%" />
            </div>

            <div className="text-white text-center">
                <p className="text-secondary text-2xl font-semibold">1874</p>
                <p className="text-sm">Total Points</p>
            </div>

            <div className="max-w-40">
                <p className="text-white text-sm text-center">Achived rank <span className="text-secondary">837</span> and chilling at <span className="text-bronze">Bronze</span> tier</p>
            </div>
            <div className="w-full">
                <Button className="w-full rounded-t-none min-h-12"> 
                    Download Image
                </Button>
            </div>

        </CardContent>
    </Card>
  )
}
export default RankImage