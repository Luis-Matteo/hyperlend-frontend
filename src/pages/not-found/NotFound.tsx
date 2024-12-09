import { useNavigate } from 'react-router-dom';
import notfoundImage from '../../assets/img/not-found.svg';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img className='' src={notfoundImage} alt='not found' />
        </motion.div>
        <motion.div
          className='text-center mt-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className='font-lufga text-3xl text-secondary'>Page not found</p>
          <p className='font-lufga text-secondary text-opacity-40 mt-2'>
            Congratulations! You are one of the elite who
            <br />
            manage to find our 404 page.
          </p>
        </motion.div>
        <motion.div
          className='max-w-[450px] w-full mt-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            title='Back to Dashboard'
            onClick={() => navigate('/dashboard')}
          />
        </motion.div>
      </div>
    </>
  );
}

export default NotFound;
