import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Contract, ContractAbi, Web3 } from "web3";
import { useSDK } from "@metamask/sdk-react";

import Header from "./Header";
import minNftAbi from "../abis/mintNftAbi.json";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
}

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();
  const [mintNftContract, setMintNfContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNfContract(
      new web3.eth.Contract(
        minNftAbi,
        "0x623fBc4878425C3c3895C91832078C355433ab61"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract }} />
    </div>
  );
};

export default Layout;
