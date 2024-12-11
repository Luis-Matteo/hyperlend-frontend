import { useState, useEffect } from 'react';
import MarketControl from '../../components/markets/MarketControl';

import Navbar from '../../layouts/Navbar';
import Modal from '../../components/common/Modal';
import ReactGA from 'react-ga4';

import { ModalType } from '../../utils/types';
import CoreTable from './core/CoreTable';
import IsolatedTable from './isolated/IsolatedTable';

function MarketOverview() {
  ReactGA.send({ hitType: 'pageview', page: '/markets' });

  const [status, setStatus] = useState<string>('core');
  const [stable, setStable] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const closeModal = () => setModalStatus(false);

  const [modalType, setModalType] = useState<ModalType>('supply');
  const [selectedToken, setSelectedToken] = useState<string>('');

  useEffect(() => {
    if (location.pathname.match(/^\/markets\/isolated\/?$/)) {
      setStatus('isolated');
    }
  }, [location.pathname]);

  return (
    <>
      <div className='w-full'>
        <Navbar pageTitle='Markets' />
        <MarketControl
          status={status}
          setStatus={setStatus}
          stable={stable}
          setStable={setStable}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>
      {status === 'core' && (
        <CoreTable
          stable={stable}
          searchText={searchText}
          setModalStatus={setModalStatus}
          setModalType={setModalType}
          setSelectedToken={setSelectedToken}
        />
      )}
      {status === 'isolated' && (
        <IsolatedTable
          stable={stable}
          searchText={searchText}
          setModalStatus={setModalStatus}
          setModalType={setModalType}
          setSelectedToken={setSelectedToken}
        />
      )}
      {modalStatus && (
        <Modal
          token={selectedToken || ''}
          modalType={modalType}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default MarketOverview;
