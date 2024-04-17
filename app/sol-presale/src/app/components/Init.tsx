"use client";
import React, { useEffect, useState } from "react";
import { useProgram } from "../components/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";

const Init = () => {
  const { program, wallet, connection } = useProgram();
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine the base URL for the Solana explorer based on the network
  const explorerBaseUrl = connection?.rpcEndpoint.includes("devnet")
    ? "https://explorer.solana.com/?cluster=devnet"
    : "https://explorer.solana.com";

  async function initialize() {
    try {
      if (program && wallet) {
        setIsLoading(true);
        const [presaleAccount, _sBump] = await PublicKey.findProgramAddressSync(
          [Buffer.from("presale"), wallet.publicKey.toBuffer()],
          program!.programId
        );

        console.log(presaleAccount.toString());

        const tx = await program.methods
          .initialize() // Adjust values if needed
          .accounts({
            presale: presaleAccount,
            admin: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([])
          // Important to include the presale Keypair
          .rpc();

        setTransactionId(tx);
        setIsSuccess(true);
        // Store the presaleAccount public key in local storage
        localStorage.setItem("presaleAccount", presaleAccount.toString());
      }
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  // Optionally, fetch the presaleAccount public key from local storage when the component mounts
  useEffect(() => {
    const storedPresaleAccount = localStorage.getItem("presaleAccount");
    if (storedPresaleAccount) {
      console.log("Presale Account from Local Storage:", storedPresaleAccount);
    }
  }, []);

  return (
    <div className="h-screen grid place-content-center">
      <p>SOL Will be deposited to the account that sign the init transaction</p>
      <button className="p-[10px_15px] border bg-blue-300" onClick={initialize}>
        Init
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

export default Init;
