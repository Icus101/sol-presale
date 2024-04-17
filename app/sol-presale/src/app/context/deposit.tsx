// import { useProgram } from "../components/useProgram";
// import * as anchor from "@coral-xyz/anchor";
// import { WalletContextState } from "@solana/wallet-adapter-react";
// import { LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
// import { useEffect, useState } from "react";

// export async function deposit() {
//   const { program, wallet, connection } = useProgram();

//   const [presalefAccount, setPresalefAccount] = useState<any>(null);

//   const fetchPresaleAccount = async () => {
//     try {
//       if (program && wallet) {
//         console.log("fetching");

//         const [presaleAccount, _sBump] = await PublicKey.findProgramAddress(
//           [Buffer.from("presale"), wallet.publicKey.toBuffer()],
//           program!.programId
//         );

//         const account = await program.account.escrowAccount.fetchNullable(
//           new PublicKey(presaleAccount)
//         );
//         setPresalefAccount(account);
//       }
//     } catch (error) {
//       console.error("Failed to fetch escrow account:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPresaleAccount();
//     console.log("fetched");
//   }, []);

//   try {
//     if (program && wallet) {
//       const [presaleAccount, _sBump] = await PublicKey.findProgramAddress(
//         [Buffer.from("presale"), wallet.publicKey.toBuffer()],
//         program!.programId
//       );
//       await program.methods
//         .deposit(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
//         .accounts({
//           presale: presaleAccount,
//           sender: wallet.publicKey,
//           admin: presalefAccount.admin, // Check AccountInfo
//           systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .signers([])
//         .rpc();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// const buyToken = async () => {
//     console.log("--------------");
//     try {
//       if (program && wallet) {
//         userTokenAddress = await getAssociatedTokenAddress(
//           mintA,
//           wallet.publicKey
//         );
//         let userAccount = await connection.getAccountInfo(userTokenAddress);
//         if (userAccount == null) {
//           const createATAIX1 = await createAssociatedTokenAccountInstruction(
//             wallet.publicKey, // payer
//             userTokenAddress, // ata
//             wallet.publicKey, // owner
//             mintA // mint
//           );
//           transaction.add(createATAIX1);
//           let txid = await sendTransaction(transaction, connection);
//           console.log("txid", txid);
//         }
//         console.log("user T Wallet:", userTokenAddress.toString());

//         // Perform the purchase transaction
//         const solInBN = new anchor.BN(
//           parseFloat(inputValue!) * Math.pow(10, 9)
//         );
//         console.log("solBN:", solInBN.toString());

//         // Additional checks for SPL token balances
//         const presaleTokenAccount = await connection.getTokenAccountBalance(
//           new PublicKey(process.env.NEXT_PUBLIC_PRESALE_TOKEN_WALLET!)
//         );
//         console.log(
//           "Presale Token Balance after purchase: " +
//             presaleTokenAccount.value.uiAmount
//         );

//         // Perform the purchase transaction
//         const result = await program.methods
//           .purchaseTokens(solInBN)
//           .accounts({
//             presale: new PublicKey(process.env.NEXT_PUBLIC_PRESALE_ACCOUNT!),
//             owner: wallet.publicKey,
//             buyerTokenAccount: userTokenAddress,
//             presaleTokenWallet: new PublicKey(
//               process.env.NEXT_PUBLIC_PRESALE_TOKEN_WALLET!
//             ),
//             tokenProgram: TOKEN_PROGRAM_ID,
//             poolAuthority: new PublicKey(
//               process.env.NEXT_PUBLIC_PRESALE_AUTHORITY!
//             ),
//             admin: new PublicKey(process.env.NEXT_PUBLIC_KEY!),
//             systemProgram: anchor.web3.SystemProgram.programId,
//             mint0: mintA,
//           })
//           .signers([])
//           .rpc();

//         console.log("result work:", result);
//         // Additional checks for SPL token balances
//         const presaleTokenAccounts = await connection.getTokenAccountBalance(
//           new PublicKey(process.env.NEXT_PUBLIC_PRESALE_ACCOUNT!)
//         );
//         const buyerTokenAccount = await connection.getTokenAccountBalance(
//           userTokenAddress
//         );

//         console.log(
//           "Presale Token Balance after purchase: " + presaleTokenAccount
//         );
//         console.log("Buyer Token Balance after purchase: " + buyerTokenAccount);

//         // Wait for the transaction to be confirmed
//         await connection.confirmTransaction(result);
//       }
//     } catch (error) {}
//   };

import React from 'react'

const deposit = () => {
  return (
    <div>deposit</div>
  )
}

export default deposit
