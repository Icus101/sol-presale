"use client";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");

interface WalletContextProviderProps {
  children: ReactNode;
  network: WalletAdapterNetwork;
}
const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
  network,
}) => {
  const [endpoint, setEndpoint] = useState<string>(
    "https://solana-devnet.g.alchemy.com/v2/DcUC5ugedhI5oeTvIK9cn7jgRlnVJKjn"
  );

  useEffect(() => {
    // Update the endpoint when the network changes
    const newEndpoint =
      network === WalletAdapterNetwork.Mainnet
        ? "https://api.metaplex.solana.com/" // Mainnet endpoint
        :  "https://solana-devnet.g.alchemy.com/v2/DcUC5ugedhI5oeTvIK9cn7jgRlnVJKjn"; // Devnet endpoint
    setEndpoint(newEndpoint);

    console.log(newEndpoint);
    
  }, [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );


 

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
