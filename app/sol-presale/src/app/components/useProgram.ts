'use client'
import idl from "../../../public/idl.json"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";

const programId = new PublicKey("GHXCmkdfP6DjaFZM2QtUqWW3sFCzNooz5NfTMNToHbpw")

export const useProgram = () => {
    const [program, setProgram] = useState<Program<Idl>>();
    const wallet = useAnchorWallet();
    const { connection } = useConnection();


    useEffect(() => {
        const updateProgram = () => {
            if (wallet) {


                const provider = new AnchorProvider(connection, wallet, {
                });

                const program = new Program(idl as any, programId, provider);

                setProgram(program);
            } else {
                setProgram(undefined);
            }
        };
        updateProgram();
    }, [connection, wallet,]);



    return {
        program,
        wallet,
        connection,
    };
};