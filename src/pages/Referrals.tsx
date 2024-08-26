import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from 'react-redux';
import { toggleModalOpen } from '../store/sidebarSlice';
import logo from '../assets/icons/logo.svg';
import mountainImage from '../assets/img/mountain.svg';
import { copyToClipboard } from "../utils/functions";
import CardItem from "../components/common/CardItem";
import leftArrow from "../assets/icons/left-arrow.svg";
import ProgressBar from "../components/common/PercentBar";

function Referrals() {

  const [page, setPage] = useState<string>('refer');
  const [history, setHistory] = useState<boolean>(false);
  const [day, setDay] = useState<number>(30);
  const [isCopy, setIsCopy] = useState(false);
  const mockLink = 'https://hyperlend.finance/?ref=wagami';
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(toggleModalOpen())
  }
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 2000);
    }
  }, [isCopy]);

  const days = [30, 14, 7];
  console.log(day)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(handleClickOutside)}
        className="fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0, rotate: "12.5deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          exit={{ scale: 0, rotate: "0deg" }}
          className="px-10 py-8 bg-primary-light rounded-2xl shadow-4xl">
          <div className="flex flex-col justify-center items-center gap-3 mb-7">
            <img src={logo} alt="logo" />
            <p className="font-lufga text-xl font-black text-secondary">Refer & Earn</p>
          </div>
          <div className="px-14 py-8 bg-primary rounded-xl">
            {
              <>
                <button onClick={() => setPage('refer')}>
                  <p className={`text-xs font-lufga font-black transition-colors duration-300 ease-in-out ${page === 'refer' ? 'text-secondary' : 'text-secondary text-opacity-40 hover:text-white'}`}>Refer Frens</p>
                  <hr
                    className={`px-40 my-4 border transition-colors duration-300 ease-in-out ${page === 'refer' ? 'text-white' : 'text-[#546764]'}`}
                  />
                </button>
                <button onClick={() => setPage('earn')}>
                  <p className={`text-xs font-lufga font-black transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-secondary' : 'text-secondary text-opacity-40 hover:text-white'}`}>My Earnings</p>
                  <hr
                    className={`px-40 my-4 border transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-white' : 'text-[#546764]'}`}
                  />
                </button>
              </>
            }
            {
              page === "refer" ?
                <>
                  <div className="relative h-56 w-full rounded-md px-7 py-5 bg-secondary mb-10">
                    <div className="">
                      <p className="font-black text-xl leading-8">Refer Your Frens</p>
                      <p className="font-light mt-3">Access instant loans using your<br /> crypto holdings as collateral.</p>
                    </div>
                    <div className="absolute right-0 bottom-0">
                      <img src={mountainImage} alt="mountain" />
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p className="text-secondary py-2 px-5 bg-[#1F2A29] rounded-full w-full">
                      {mockLink}
                    </p>
                    <button
                      className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-full whitespace-nowrap transition-colors duration-300 ${isCopy ? "text-success" : ""}`}
                      onClick={() => { copyToClipboard(mockLink), setIsCopy(true) }}
                      type="button">
                      {
                        isCopy ? "Copied" : "Copy Url"
                      }
                    </button>
                  </div>
                </>
                :
                <>
                  {
                    !history ?
                      <div className="flex flex-col gap-5 w-full items-center">
                        <div className="flex gap-5 w-full ">
                          <div className="flex flex-col gap-5 w-full">
                            <CardItem
                              className="bg-[#1F2A29] rounded-md p-2 flex justify-between items-end w-full">
                              <div className="px-2">
                                <p className="text-secondary font-lufga text-opacity-40 text-xs font-black">Available Credit</p>
                                <p className="text-secondary font-lufga text-xl font-black my-2">$10,494.93</p>
                              </div>
                              <button className="inline-block px-7 py-3 bg-secondary text-xs font-black rounded-lg"
                                type="button"
                              >
                                Claim
                              </button>
                            </CardItem>
                            <CardItem
                              className="bg-[#1F2A29] rounded-md p-2 flex justify-between items-end">
                              <div className="px-2">
                                <p className="text-secondary font-lufga text-opacity-40 text-xs font-black">Lifetime Earnings</p>
                                <p className="text-secondary font-lufga text-xl font-black my-2">$104,494.93</p>
                              </div>
                            </CardItem>
                          </div>
                          <CardItem
                            className="bg-[#1F2A29] rounded-md p-2 w-full">
                            <div className="px-2 w-full">
                              <p className="text-secondary font-lufga text-opacity-40 text-xs font-black">Commission Tier</p>
                              <p className="text-secondary font-lufga text-2xl font-black mt-2 mb-6">Tier 1</p>
                              <p className="text-secondary font-lufga text-opacity-40 text-xs font-black mb-3">Commission Tier</p>
                              <ProgressBar
                                progress={60}
                                className="h-[7px]" />
                            </div>
                          </CardItem>
                        </div>
                        <CardItem
                          className="bg-[#1F2A29] rounded-md p-2 w-full">
                          <div className="px-2 flex justify-between items-center">
                            <p className="text-secondary font-lufga text-opacity-40 text-xs font-black">Referral Earnings</p>
                            <div className="flex gap-2">
                              {
                                (days || []).map((item) => (
                                  <button className="px-4 py-1 bg-[#081916] rounded-full" key={item}
                                    onClick={() => setDay(item)}>
                                    <p className="text-[#797979] text-xs font-lufga">{item}d</p>
                                  </button>
                                ))
                              }
                            </div>
                          </div>
                        </CardItem>
                        <CardItem
                          className="bg-[#1F2A29] rounded-md p-2 w-full flex justify-between items-center">
                          <p className="text-secondary font-lufga text-opacity-40 text-xs font-black px-2">Referral History</p>
                          <button className="px-8 py-3 bg-secondary bg-opacity-40 rounded-md mx-2 text-xs font-black"
                            onClick={() => setHistory(true)}>
                            View History
                          </button>
                        </CardItem>
                      </div>
                      :
                      <CardItem
                        className="bg-[#1F2A29] rounded-md px-6 py-5 w-full flex justify-between items-center">
                        <button className="flex gap-1 items-center"
                          onClick={() => setHistory(false)}>
                          <div className="">
                            <img src={leftArrow} alt="left" />
                          </div>
                          <p className="text-secondary font-lufga text-opacity-40 text-xs font-black px-2">Referral History</p>
                        </button>
                      </CardItem>
                  }
                </>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence >
  )
}

export default Referrals