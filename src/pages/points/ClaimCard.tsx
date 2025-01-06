import { claimCardBg } from "@/assets"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function ClaimCard() {
  return (
    <Card className="overflow-hidden row-start-2 md:row-start-1 col-start-1 md:col-start-4 col-span-5 md:col-span-2 px-4 py-4 bg-primary-light border-primary-hover border-[3px] flex items-center">
      <CardContent className="px-0 py-0  w-full h-full flex items-center justify-center gap-x-8">
        <div className=" text-secondary flex flex-col justify-center">
          <h3 className="font-semibold text-xl">Daily Drop</h3>
          <p className="text-sm font-normal">Unlock your daily points and rise through the ranks</p>
        </div>
        <div className="w-1/2 relative ">
          <div className="absolute w-fit h-fit -top-1 md:-top-4 -translate-y-1/4 right-0">
            <img src={claimCardBg} className="w-full h-full scale-[1.1] md:scale-[1.15]"/>
          </div>
          <Button className="!w-full min-h-10 shadow-bottom">
            Claim
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default ClaimCard