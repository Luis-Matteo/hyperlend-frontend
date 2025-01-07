import { FC } from 'react';
import { ModalType } from '../../utils/types';
import { Card } from '../ui/card';
import { Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import IsolatedRow from './IsolatedRow';

interface IsolatedPositionsProps {
  setModalToken: React.Dispatch<React.SetStateAction<string>>;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  userPositions: any;
}

export interface IIsolatedPosition {
  asset: string;
  collateral: string;
  suppliedAsset: number;
  supplyApr: number;
  borrowedAsset: number;
  borrowApr: number;
  collateralSupplied: number;
}

const isolatedPositions: Array<IIsolatedPosition> = [
  {
    asset: 'stHYPE',
    collateral: 'MBTC',
    suppliedAsset: 138930,
    supplyApr: 2.41,
    borrowedAsset: 138930,
    borrowApr: 138930,
    collateralSupplied: 138930,
  },
  {
    asset: 'stHYPE',
    collateral: 'MBTC',
    suppliedAsset: 138930,
    supplyApr: 2.41,
    borrowedAsset: 138930,
    borrowApr: 138930,
    collateralSupplied: 138930,
  },
  {
    asset: 'stHYPE',
    collateral: 'MBTC',
    suppliedAsset: 138930,
    supplyApr: 2.41,
    borrowedAsset: 138930,
    borrowApr: 138930,
    collateralSupplied: 138930,
  },
];

const InfoTooltip = ({
  title,
  left,
  right,
}: {
  title: string;
  left?: boolean;
  right?: boolean;
}) => (
  <div
    className='w-full flex items-center gap-x-1'
    style={{
      justifyContent: left ? 'start' : right ? 'end' : 'center',
    }}
  >
    <span className='text-sm'>{title}</span>
    <Info size={12} className='' />
  </div>
);

const Isolated: FC<IsolatedPositionsProps> = (
  {
    // setModalToken,
    // setModalStatus,
    // setModalType,
  },
) => {
  return (
    <div className='flex justify-center items-center font-lufga'>
      <Card className='w-full bg-primary-light border-gray-dark border-[3px] p-0'>
        <div className=' bg-primary-light w-full h-20 rounded-t-lg flex items-center px-8'>
          <h3 className='relative text-white font-medium text-xl md:text-4xl'>
            Isolated Pools
          </h3>
        </div>
        <Table className='text-white min-w-[1080px]'>
          <TableHeader className='w-full  h-12'>
            <TableRow className='h-full bg-gray-dark border-none'>
              <TableHead className='w-fit md:w-1/7 text-left font-medium pl-4 md:pl-8'>
                <InfoTooltip title='Asset' left={true} />
              </TableHead>
              <TableHead className='w-fit md:w-1/7 text-center font-medium'>
                <InfoTooltip title='Collateral' />
              </TableHead>
              <TableHead className='w-fit md:w-1/7 text-center font-medium'>
                <InfoTooltip title='Supplied Asset' />
              </TableHead>
              <TableHead className='w-fit md:w-1/7 text-center font-medium'>
                <InfoTooltip title='Supply APR' />
              </TableHead>
              <TableHead className='w-fit md:w-1/7 text-center font-medium'>
                <InfoTooltip title='Borrowed Asset' />
              </TableHead>
              <TableHead className='w-fit md:w-1/7  text-center font-medium'>
                <InfoTooltip title='Borrow APR' />
              </TableHead>
              <TableHead className='w-fit md:w-1/7  text-right font-medium pr-4 md:pr-8'>
                <InfoTooltip title='Collateral Supplied' right={true} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=''>
            {isolatedPositions.map((isolatedPosition) => (
              <IsolatedRow row={isolatedPosition} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Isolated;
