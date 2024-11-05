import Lottie from 'lottie-react';

interface LottieAnimationProps {
    animationData: any
}
function LottieAnimation({ animationData }: LottieAnimationProps) {
    return (
        <Lottie className='text-[#EACACB]' animationData={animationData} loop={true} />
    );
};

export default LottieAnimation;
