"use client";
import React, { useEffect, useState } from "react";
import { useProgram } from "./useProgram";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";

const Deposit = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { program, wallet, connection } = useProgram();
  const [presalefAccount, setPresalefAccount] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [presaleAccount, setPresaleAccount] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the presaleAccount public key from local storage when the component mounts
    const storedPresaleAccount = localStorage.getItem('presaleAccount');
    if (storedPresaleAccount) {
      setPresaleAccount(storedPresaleAccount);
    }
  }, []);

  const fetchPresaleAccount = async () => {
    try {
      if (program && wallet && presaleAccount) {
        console.log("fetching");

        const presaleAccountPubKey = new PublicKey(presaleAccount);
        console.log(presaleAccount.toString());

        const account = await program.account.presale.fetchNullable(
            presaleAccountPubKey
        );
        setPresalefAccount(account);
      }
    } catch (error) {
      console.error("Failed to fetch escrow account:", error);
    }
  };
  useEffect(() => {
    fetchPresaleAccount();
  }, [connection, program, wallet]);

  async function deposit() {
    console.log("clicked");

    try {
      if (program && wallet && presaleAccount) {
        setIsLoading(true);
        const presaleAccountPubKey = new PublicKey(presaleAccount);
        let tx = await program.methods
          .deposit(
            new anchor.BN(Number(inputValue) * anchor.web3.LAMPORTS_PER_SOL)
          )
          .accounts({
            presale: presaleAccountPubKey,
            sender: wallet.publicKey,
            admin: presalefAccount.admin, // Check AccountInfo
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([])
          .rpc();

        setTransactionId(tx);
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false); // Ensure loading state is false after operation completes or fails
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Determine the base URL for the Solana explorer based on the network
  const explorerBaseUrl = connection?.rpcEndpoint.includes("devnet")
    ? "https://explorer.solana.com/?cluster=devnet"
    : "https://explorer.solana.com";

  return (
    <div className="container grid place-content-center mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Deposit SOL</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="border border-gray-400 p-2 rounded"
      />
      <button
        onClick={deposit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Deposit
      </button>
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {isSuccess && transactionId && (
        <div className="mt-4">
          <a
            href={`${explorerBaseUrl}/tx/${transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Transaction on Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default Deposit;
