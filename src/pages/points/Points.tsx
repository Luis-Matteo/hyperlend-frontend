import PointTiers from "./PointTiers"
import Navbar from "@/layouts/Navbar"
import ClaimCard from "./ClaimCard"
import RankImage from "./RankImage"
import PointsTable from "./PointsTable"
import Leaderboard from "./Leaderboard"
import TierUpgrade from "./TierUpgrade"

function Points() {
  return (
    <main className="font-lufga space-y-8">
      <Navbar pageTitle='Points' />

      {/* <div className="flex flex-col gap-y-8 md:gap-y-0 md:flex-row md:gap-x-8"> */}
      <TierUpgrade newTier="elite"/>
      <div className="grid grid-cols-5 gap-x-8 gap-y-8">
        <PointTiers />
        <ClaimCard />
      </div>
      {/* <div className="flex flex-col gap-y-8 md:gap-y-0 md:flex-row md:gap-x-8"> */}
      <div className="grid grid-cols-5 gap-x-8 gap-y-8">
        <PointsTable />
        <RankImage />
      </div>
      <div>
        <Leaderboard />
      </div>
    </main>
  )
}

export default Points