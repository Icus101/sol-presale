// import { useProgram } from "../components/useProgram";
// import * as anchor from "@coral-xyz/anchor";
// import { WalletContextState } from "@solana/wallet-adapter-react";
// import { PublicKey,  } from "@solana/web3.js";

// export async function initialize() {
//   const { program, wallet, connection } = useProgram();

//   try {
//     if (program && wallet) {
//       const[presaleAccount, _sBump] = await PublicKey.findProgramAddress(
//         [Buffer.from("presale"), wallet.publicKey.toBuffer()],
//         program!.programId
//       );
//       await program.methods
//         .initialize() // Adjust values if needed
//         .accounts({
//           presale: presaleAccount,
//           admin: wallet.publicKey,
//           systemProgram: anchor.web3.SystemProgram.programId,
//           rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         })
//         .signers([]) // Important to include the presale Keypair
//         .rpc();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

import React from 'react'

const initialize = () => {
  return (
    <div>initialize</div>
  )
}

export default initialize
