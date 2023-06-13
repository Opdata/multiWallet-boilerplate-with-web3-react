import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
// import { GnosisSafe } from '@web3-react/gnosis-safe';
import type { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
// import { WalletConnect } from '@web3-react/walletconnect';
// import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { useCallback, useEffect, useState } from 'react';

import { CHAINS, getAddChainParameters } from '../chains';

function ChainSelect({
  activeChainId,
  switchChain,
  chainIds,
}: {
  activeChainId: number;
  switchChain: (chainId: number) => void;
  chainIds: number[];
}) {
  return (
    <select
      value={activeChainId}
      onChange={(event) => {
        switchChain(Number(event.target.value));
      }}
      disabled={switchChain === undefined}
    >
      <option hidden disabled selected={activeChainId === undefined}>
        Select chain
      </option>
      <option value={-1} selected={activeChainId === -1}>
        Default
      </option>
      {chainIds.map((chainId) => (
        <option
          key={chainId}
          value={chainId}
          selected={chainId === activeChainId}
        >
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  );
}

export function ConnectWithSelect({
  connector,
  activeChainId,
  chainIds = Object.keys(CHAINS).map(Number),
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector:
    | MetaMask
    // | WalletConnect
    // | WalletConnectV2
    | CoinbaseWallet
    | Network;
  // | GnosisSafe;
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>;
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[];
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
}) {
  const [desiredChainId, setDesiredChainId] = useState<any>(undefined);

  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId);
    }
  }, [desiredChainId, activeChainId]);

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId);

      try {
        if (
          // If we're already connected to the desired chain, return
          desiredChainId === activeChainId ||
          // If they want to connect to the default chain and we're already connected, return
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          setError(undefined);
          return;
        }

        if (desiredChainId === -1) {
          await connector.activate();
        } else if (
          //   connector instanceof WalletConnectV2 ||
          //   connector instanceof WalletConnect ||
          connector instanceof Network
        ) {
          await connector.activate(desiredChainId);
        } else {
          await connector.activate(getAddChainParameters(desiredChainId));
        }

        setError(undefined);
      } catch (error: any) {
        setError(error);
      }
    },
    [connector, activeChainId, setError]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ChainSelect
        activeChainId={desiredChainId}
        switchChain={switchChain}
        chainIds={chainIds as number[]}
      />
      <div style={{ marginBottom: '1rem' }} />
      {isActive ? (
        error ? (
          <button onClick={() => switchChain(desiredChainId)}>
            Try again?
          </button>
        ) : (
          <button
            onClick={() => {
              if (connector?.deactivate) {
                void connector.deactivate();
              } else {
                void connector.resetState();
              }
              setDesiredChainId(undefined);
            }}
          >
            Disconnect
          </button>
        )
      ) : (
        <button
          onClick={() => switchChain(desiredChainId)}
          disabled={isActivating || !desiredChainId}
        >
          {error ? 'Try again?' : 'Connect'}
        </button>
      )}
    </div>
  );
}

// TODO: 배포 환경 값에 맞춘 에러처리를 해주어야함
// TODO: Select 지우고 커넥트 누르면 자동으로 해당 체인 id의 망을 연결할 것
// 기존 Card를 Connect Wallet 클릭했을 때 의 컴포넌트로 사용하면 되고, 우선 위 사항분리 시킨 후 하면 될듯
