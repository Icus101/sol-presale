import Image from "next/image";
import Deposit from "./components/Deposit";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <Header/>
      <Deposit/>
    
    </main>
  );
}
