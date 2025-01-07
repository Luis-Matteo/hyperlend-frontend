import { logo } from "@/assets"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

function EditNameModal({isOpen, setIsOpen} : {isOpen: boolean, setIsOpen: (open:boolean) => void}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[380px] md:max-w-max border-none px-0 bg-primary-light text-secondary">
            <div className="py-8 px-12 flex flex-col gap-y-4 items-center justify-center">
                <img src={logo}/>
                <h3 className="text-2xl font-semibold text-center">Enter Your HyperLend Name</h3>
                <p className="text-xs text-center">This name will be displayed for everyone to see on the leaderboard.</p>
                <Input className="text-center px-4 border-secondary/10 text-white placeholder:text-secondary/10 py-5" placeholder="Enter Name"/>
            </div>
            <div className="border-t border-secondary/10 py-8 px-12">
                <Button className="rounded-md py-5">Update Name</Button>
            </div>
        </DialogContent>
    </Dialog>
    )
}
export default EditNameModal