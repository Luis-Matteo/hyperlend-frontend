import { useNavigate } from 'react-router-dom';
import notfoundImage from '../assets/img/not-found.svg';
import Button from '../components/common/Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className=''>
          <img className='' src={notfoundImage} alt='not found' />
        </div>
        <div className='text-center mt-4'>
          <p className='font-lufga text-3xl text-secondary'>Page not found</p>
          <p className='font-lufga text-secondary text-opacity-40 mt-2'>
            Congratulations! You are one of the elite who
            <br />
            manage to find our 404 page.
          </p>
        </div>
        <div className='max-w-[450px] w-full mt-6'>
          <Button
            title='Back to Dashboard'
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </>
  );
}

export default NotFound;
