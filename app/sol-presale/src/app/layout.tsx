"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "./components/WalletContextProvider";
import { useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Icus",
  description: "Fund the cause",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  // Function to toggle between Devnet and Mainnet
  const toggleNetwork = () => {
    setNetwork((prevNetwork) =>
      prevNetwork === WalletAdapterNetwork.Devnet
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet
    );
  };

  return (
    <html lang="en">
      <body className={inter.className} id="idroot">
        {/* <div className="border-[1px] bg-[#020617] text-[#ffffff] text-center rounded-[4px]">
          <button className="p-4" onClick={toggleNetwork}>
            {network === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"}
          </button>
        </div> */}
        <WalletContextProvider network={network}>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
