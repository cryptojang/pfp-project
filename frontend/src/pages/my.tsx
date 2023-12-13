import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import MyNFTCard from "../components/MyNFTCard";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMintModal = () => {
    if (!account) return;
    setIsOpen(true);
  };

  const getMyNFTs = async () => {
    try {
      if (!mintNftContract || !account) return;

      //@ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          //@ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(Number(tokenId))
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) }); // 원래 tokenId로 이름 같아서 줄일 수 있는데, 형변환 해야 하므로 .
      }

      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  useEffect(() => {
    console.log(metadataArray);
  }, [metadataArray]);

  return (
    <>
      <div className=" grow">
        <div className=" text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className=" text-center py-8 ">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className=" p-8 grid grid-cols-2 gap-8">
          {metadataArray?.map((v, i) => (
            <MyNFTCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!} // undefined 에러 처리 위해 ! 붙여줌
            />
          ))}
        </ul>
      </div>
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;
