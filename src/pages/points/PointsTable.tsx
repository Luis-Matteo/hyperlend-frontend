import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function PointsTable() {
  return (
    <Card className="row-start-1 col-start-1 col-span-5 md:col-span-3 bg-primary-light border-gray-dark border-[3px]">
        <Table className="text-white">
            <TableHeader className="w-full bg-gray-dark h-12">
                <TableRow className="h-full border-none">
                <TableHead className="min-w-52 md:min-w-fit w-fit md:w-1/3 text-left font-semibold pl-4 md:pl-16">Week</TableHead>
                <TableHead className="min-w-52 md:min-w-fit w-fit md:w-1/3 text-center font-semibold">Points</TableHead>
                <TableHead className="min-w-52 md:min-w-fit w-fit md:w-1/3 text-right font-semibold pr-4 md:pr-16">Referred Volume</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="px-16">
                <TableRow className="border-gray-dark">
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-left pl-4 md:pl-16">2.10, 2:00 - 15.11, 1:00</TableCell>
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-center">1.683</TableCell>
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-right pr-4 md:pr-16">$4,948,848</TableCell>
                </TableRow>
                <TableRow className="border-gray-dark">
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-left pl-4 md:pl-16">2.10, 2:00 - 15.11, 1:00</TableCell>
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-center">1.683</TableCell>
                <TableCell className="min-w-52 md:min-w-fit w-fit md:w-1/3 font-medium text-right pr-4 md:pr-16">$4,948,848</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Card>
  )
}
export default PointsTable