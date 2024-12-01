import ethIcon from '../../assets/icons/coins/eth-icon.svg';
import wbtcIcon from '../../assets/icons/coins/wbtc-icon.svg';
import { formatNumber } from '../../utils/functions';


const pairs = [
    {
        id: 1,
        token1: {
            icon: ethIcon,
            name: "stHYPE",
        },
        token2: {
            icon: wbtcIcon,
            name: "MBTC",
        },
        apy: 41.84,
        value: 1987892173,
    },
    {
        id: 2,
        token1: {
            icon: ethIcon,
            name: "stHYPE",
        },
        token2: {
            icon: wbtcIcon,
            name: "MBTC",
        },
        apy: 41.84,
        value: 1987892173,
    },
]
function MyPositions() {

    return (
        <>
            <div className='mt-4 flex justify-between items-center'>
                <p className='text-secondary text-opacity-40 text-sm font-lufga'>Pairs</p>
                <p className='text-secondary text-opacity-40 text-sm font-lufga'>Position Value</p>
            </div>
            <div className='flex flex-col max-h-[400px] overflow-auto'>
                {
                    pairs.map((item) => (
                        <button className='flex justify-between items-center py-3 border-b-[1px] border-[#212325] hover:bg-secondary/10' key={item.id}>
                            <div className='flex gap-2 items-center'>
                                <div className='flex -space-x-3'>
                                    <img className='w-10 h-10 object-cover rounded-full' src={item.token1.icon} alt="token" />
                                    <img className='w-10 h-10 object-cover rounded-full' src={item.token2.icon} alt="token" />
                                </div>
                                <div className='text-left'>
                                    <p className='text-secondary font-lufga'>{item.token1.name}/{item.token2.name}</p>
                                    <p className='text-success font-lufga'>APY: {item.apy}</p>
                                </div>
                            </div>
                            <p className='text-secondary font-lufga'>{formatNumber(item.value, 2)}</p>
                        </button>
                    ))
                }
            </div>
        </>
    );
}

export default MyPositions;
