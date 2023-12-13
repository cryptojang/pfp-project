import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import MintModal from "../components/MintModal";
import { OutletContext } from "../types";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMintModal = () => {
    if (!account) return;
    setIsOpen(true);
  };

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return (
    <>
      <div className="bg-green-200 grow">
        <div className="bg-purple-400 text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
      </div>
      {isOpen && <MintModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default My;
