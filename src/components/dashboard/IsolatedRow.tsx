import { btcIcon, cryptoIcon } from '@/assets';
import { TableCell, TableRow } from '../ui/table';
import { IIsolatedPosition } from './Isolated';
import { formatUnit } from '@/utils/functions';

function IsolatedRow({ row }: { row: IIsolatedPosition }) {
  return (
    <TableRow className='border-gray-dark text-sm'>
      <TableCell className='pl-4 md:pl-8 text-sm'>
        <div className='flex items-center gap-x-2'>
          <img src={cryptoIcon} />
          {row.asset}
        </div>
      </TableCell>
      <TableCell className='text-center text-sm'>
        <div className='flex items-center gap-x-2'>
          <img src={btcIcon} />
          {row.collateral}
        </div>
      </TableCell>
      <TableCell className='text-center text-sm space-x-2'>
        <span>{formatUnit(row.suppliedAsset)}</span>
        <span className='text-gray'>($183.84)</span>
      </TableCell>
      <TableCell className='text-center text-sm text-green-500'>
        {row.supplyApr}%
      </TableCell>
      <TableCell className='text-center text-sm space-x-2'>
        <span>{formatUnit(row.borrowedAsset)}</span>
        <span className='text-gray'>($183.84)</span>
      </TableCell>
      <TableCell className='text-center text-sm space-x-2'>
        <span>{formatUnit(row.borrowApr)}</span>
        <span className='text-gray'>($183.84)</span>
      </TableCell>
      <TableCell className='pr-4 md:pr-8 text-right text-sm space-x-2'>
        <span>{formatUnit(row.collateralSupplied)}</span>
        <span className='text-gray'>($183.84)</span>
      </TableCell>
    </TableRow>
  );
}
export default IsolatedRow;
