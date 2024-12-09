import { useNavigate } from 'react-router-dom';
import Navbar from '../../layouts/Navbar';
import hypervaultIcon from '../../assets/icons/hypervault-icon.svg';
import hypervaultTopImage from '../../assets/img/hypervault-top-effect.svg';
import hypervaultBottomImage from '../../assets/img/hypervault-bottom-effect.svg';
import HypervaultControl from '../../components/hypervault/HypervaultControl';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { hypervaults } from '../../utils/mocks/hypervault';
import HypervaultCard from '../../components/hypervault/HypervaultCard';

function Hypervault() {

    const navigate = useNavigate();
    const [status, setStatus] = useState<string>('all');
    const [sort, setSort] = useState<'highest' | 'lowest'>('highest');
    const [searchText, setSearchText] = useState<string>('');

    const sortedHypervaults = useMemo(() =>
        [...hypervaults]
            .filter(vault => status === 'all' ? true : vault.slug === status)
            .sort((a, b) => {
                if (sort === 'highest') {
                    return b.tvl - a.tvl;
                }
                return a.tvl - b.tvl;
            }),
        [status, sort]
    );

    return (
        <>
            <div className='w-full'>
                <Navbar pageTitle="HyperVault" />
                <div className='w-full relative py-8'>
                    <div className='max-w-[580px] mx-auto flex flex-col gap-8 items-center justify-center'>
                        <motion.div
                            className='flex gap-11 items-center'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.img
                                className='w-28'
                                src={hypervaultIcon}
                                alt="HyperVault"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            />
                            <motion.p
                                className='font-lufga text-[80px] font-bold text-secondary'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                HyperVault
                            </motion.p>
                        </motion.div>
                        <motion.p
                            className='font-lufga text-center text-secondary'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Crypto investment on autopilot. Secure your wealth, earn more with automated hedging.
                        </motion.p>
                    </div>
                    <div className='absolute top-0 right-0'>
                        <img className='' src={hypervaultTopImage} alt="HyperVault" />
                    </div>
                    <div className='absolute bottom-0 left-0'>
                        <img className='' src={hypervaultBottomImage} alt="HyperVault" />
                    </div>
                </div>
                <HypervaultControl
                    status={status}
                    setStatus={setStatus}
                    sort={sort}
                    setSort={setSort}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
                <motion.div
                    key={sort}
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.3
                            }
                        }
                    }}
                >
                    {sortedHypervaults.map((item) => (
                        <motion.button
                            onClick={() => navigate(`/hypervault/${item.id}`)}
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <HypervaultCard {...item} />
                        </motion.button>
                    ))}
                </motion.div>
            </div >

        </>
    );
}

export default Hypervault;
