import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolPresale } from "../target/types/sol_presale";
import { assert } from 'chai';
import { PublicKey,  } from "@solana/web3.js";

describe("sol-presale", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolPresale as Program<SolPresale>;
  let presale;
  let admin

  it("Is initialized!", async () => {
    // Add your test here.
    // Keypair for the admin account 
    admin = anchor.web3.Keypair.generate();

    // Create a presale account (will need to airdrop some SOL for rent exemption)
    // presale = anchor.web3.Keypair.generate();
    // Signature to ensure the transaction is paid for by the admin
    const signature = await program.provider.connection.requestAirdrop(admin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(signature);

    const[presale, _sBump] = await PublicKey.findProgramAddress(
      [Buffer.from("presale"), admin.publicKey.toBuffer()],
      program!.programId
    );

    // Call the initialize function
    await program.methods
    .initialize() // Adjust values if needed
      .accounts({
        presale: presale,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin]) // Important to include the presale Keypair
      .rpc();

    // Fetch the updated presale account state 
    const presaleAccount = await program.account.presale.fetch(presale);

    // Assertions
    assert.isTrue(presaleAccount.initialized);
    assert.isTrue(presaleAccount.presaleActive); // Check if presale_active is also set
   
    // ... add more assertions for other fields 



  });

  it('Should allow deposits', async () => {

    const buyer = anchor.web3.Keypair.generate();

    // Airdrop some SOL to the buyer for the deposit
    const signature = await program.provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(signature);

    // Get the initial SOL balance of the presale account
    const initialPresaleBalance = await program.provider.connection.getBalance(presale.publicKey);

    // Make the deposit
    await program.methods
      .deposit(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        presale: presale.publicKey,
        sender: buyer.publicKey,
        admin: admin.publicKey, // Check AccountInfo
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    // Get updated balances
    const newPresaleBalance = await program.provider.connection.getBalance(presale.publicKey);
    const buyerBalance = await program.provider.connection.getBalance(buyer.publicKey);

    // Assertions
    assert.equal(newPresaleBalance - initialPresaleBalance, 1 * anchor.web3.LAMPORTS_PER_SOL);
    // assert.isBelow(buyerBalance, initialPresaleBalance - 1 * anchor.web3.LAMPORTS_PER_SOL); // Account for transaction fees
  });

  it('Admin should be able to withdraw SOL', async () => {

    const initialAdminBalance = await program.provider.connection.getBalance(admin.publicKey);
    const initialPresaleBalance = await program.provider.connection.getBalance(presale.publicKey);

    // Perform withdrawal
    await program.methods
      .withdrawSol()
      .accounts({
        presale: presale.publicKey,
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    // Get updated balances
    const newAdminBalance = await program.provider.connection.getBalance(admin.publicKey);
    const newPresaleBalance = await program.provider.connection.getBalance(presale.publicKey);
    console.log(newPresaleBalance);
    

    // Assertions
    assert.isAbove(newAdminBalance, initialAdminBalance);
    assert.equal(newPresaleBalance, 0);
  });

});
