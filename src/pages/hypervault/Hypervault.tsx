import { Outlet } from 'react-router-dom';
import Navbar from '../../layouts/Navbar';

function Hypervault() {

    return (
        <>
            <div className='w-full'>
                <Navbar
                    pageTitle={<span className='hidden lg:inline'>HyperVault</span>}
                />
                <Outlet />
            </div>
        </>
    );
}

export default Hypervault;
