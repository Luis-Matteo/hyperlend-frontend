import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { defineChain } from 'viem';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  name: 'Hyperlend',
  description: 'Hyperlend',
  url: 'https://hyperlend.com',
  icons: ['https://www.hyperlend.finance/assets/logo-text-BcZCnvTH.svg'],
};

const hyperEvmTestnet = defineChain({
  id: 998,
  name: 'HyperEVM Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://api.hyperliquid-testnet.xyz/evm',
        'https://hyperliquid.lgns.xyz',
        'https://rpc-testnet.hyperlend.finance/evm',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM testnet explorer',
      url: 'https://testnet.purrsec.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5285829,
    },
  },
});

// const chains = [hyperEvmTestnet];
// const enableInjected = true as const;
// export const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   enableInjected,
// });

export const wagmiAdapter = new WagmiAdapter({
  networks: [hyperEvmTestnet],
  projectId,
});

// 3. Create modal
// createWeb3Modal({
//   metadata,
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true,
//   themeVariables: {
//     '--w3m-accent': '#CAEAE5',
//   },
// });

createAppKit({
  adapters: [wagmiAdapter],
  networks: [hyperEvmTestnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
