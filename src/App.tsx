import CoinbaseWalletCard from './components/connectorCards/CoinbaseWalletCard';
// import GnosisSafeCard from '../components/connectorCards/GnosisSafeCard';
import MetaMaskCard from './components/connectorCards/MetaMaskCard';
import NetworkCard from './components/connectorCards/NetworkCard';
// import WalletConnectCard from '../components/connectorCards/WalletConnectCard';
// import WalletConnectV2Card from '../components/connectorCards/WalletConnectV2Card';

import ProviderExample from './components/ProviderExample';

// import { useWeb3React } from '@web3-react/core';

function App() {
  console.log('node_env : ', import.meta.env.MODE); // vite enviroment variables
  // const test = useWeb3React(); // wallet connector, chainId, address, ... etc
  // console.log('useWeb3React : ', test);

  return (
    <>
      {/* <ProviderExample /> */}
      <div
        style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}
      >
        <MetaMaskCard />
        {/* <WalletConnectV2Card /> */}
        {/* <WalletConnectCard /> */}
        <CoinbaseWalletCard />
        <NetworkCard />
        {/* <GnosisSafeCard /> */}
      </div>
    </>
  );
}

export default App;
