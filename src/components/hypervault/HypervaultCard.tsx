import { formatNumber } from '../../utils/functions';
import { Hypervault } from '../../utils/interfaces';

const tagConfig = {
    'new': { textColor: 'text-[#2DC24E]', borderColor: 'border-[#2DC24E]', icon: './assets/img/tags/new.svg' },
    'hot': { textColor: 'text-[#C2BD2D]', borderColor: 'border-[#C2BD2D]', icon: './assets/img/tags/hot.svg' },
    'risk': { textColor: 'text-[#FF4245]', borderColor: 'border-[#FF4245]', icon: './assets/img/tags/risk.svg' }
};

function HypervaultCard({
    tag,
    assetSymbol,
    assetIcon,
    collateralSymbol,
    collateralIcon,
    apy,
    tvl,
    name,
    icon,
    title,
    content,
}: Hypervault) {

    const tagStyle = tagConfig[tag];

    return (
        <div className='w-full p-5 bg-gray-dark rounded-xl border-[1px] border-secondary hover:shadow-inner-3xl'>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center gap-2'>
                    <div className={`border-[1px] ${tagStyle.borderColor} flex items-center gap-2 py-2 px-3 rounded-full`}>
                        <img className='w-4 h-4' src={tagStyle.icon} alt={tag} />
                        <p className={`${tagStyle.textColor} text-xs font-nexa capitalize`}>{tag}</p>
                    </div>
                    <div className='flex -space-x-3'>
                        <img className='w-8 h-8' src={assetIcon} alt={assetSymbol} />
                        <img className='w-8 h-8' src={collateralIcon} alt={collateralSymbol} />
                    </div>
                </div>
                <div className='flex items-center gap-2 mt-6'>
                    <img src={icon} alt={name} />
                    <p className='text-xs text-white font-lufga'>{name}</p>
                </div>
                <p className='text-lg font-lufga text-white text-left'>{title}</p>
                <p className='text-xs font-lufga text-secondary text-left'>{content}</p>
                <div className='flex justify-center items-center gap-16'>
                    <div className='text-center'>
                        <p className='text-success font-lufga font-bold text-xl'>{apy}%</p>
                        <p className='text-secondary/60'>APY</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-white font-lufga font-bold text-xl'>${formatNumber(tvl, 2)}</p>
                        <p className='text-secondary/60'>TVL</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HypervaultCard;
