import React, { useState, useEffect } from 'react';

interface ConfirmModalProps {
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [read, setRead] = useState(false)
    const [agree, setAgree] = useState(false)

    return (
        <div className="fixed flex justify-center items-center top-0 left-0 w-full z-50 h-screen backdrop-blur-md p-2">
            <div className='bg-primary p-10 shadow-3xl rounded-lg'>
                <div className='flex flex-col gap-6 max-w-[345px]'>
                    <h3 className='text-secondary font-nexa font-black'>Disclaimer</h3>
                    <div className='flex flex-col gap-4'>
                        <p className='text-secondary text-sm font-nexa leading-4'>Please check the boxes below to confirm your agreement to the HyperLend Terms and Conditions:</p>
                        <button onClick={() => setRead((prev) => !prev)} className='text-secondary text-left font-nexa text-sm'>
                            <span className={`w-3 h-3 inline-flex items-center justify-center border-2 mr-2 ${read ? 'bg-secondary' : ''}`} />
                            <span className="">I have read and understood, and do hereby agree to be legally bound as a 'User' under the Terms, including all future amendments thereto. This agreement is irrevocable and will apply to all of my uses of the Site without me providing confirmation in each specific instance.</span>
                        </button>
                        <button onClick={() => setAgree((prev) => !prev)} className='text-secondary text-left font-nexa text-sm'>
                            <span className={`w-3 h-3 inline-flex items-center justify-center border-2 mr-2 ${agree ? 'bg-secondary' : ''}`} />
                            <span className="">I have read and understood, and do hereby agree to be legally bound as a 'User' under the Terms, including all future amendments thereto. This agreement is irrevocable and will apply to all of my uses of the Site without me providing confirmation in each specific instance.</span>
                        </button>
                    </div>
                    <button
                        type='button'
                        className={`w-full rounded-lg bg-secondary py-4 font-nexa ${!(read && agree) && 'opacity-60'}`}
                        onClick={onConfirm}
                        disabled={(read && agree) ? false : true}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
