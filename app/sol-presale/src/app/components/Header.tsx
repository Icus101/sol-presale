"use client";
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-[100%]">
      <div className=" max-w-[1024px] mx-auto">
        <div className=" flex justify-between sm:mx-0 mx-5  items-center py-[15px] ">
          <Link href='/'>
            <h1>LOGO</h1>
          </Link>
          <Link href='/initpage'>
            <h1 className="border bg-blue-900 p-[10px_12px] rounded-md text-white">INIT</h1>
          </Link>

         

          <div className="border-[1px] bg-[#020617] text-[#ffffff] text-center rounded-[4px]">
            <WalletMultiButton
              style={{ padding: "10px", lineHeight: "inherit" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
