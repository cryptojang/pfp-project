import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NFTCard, { NFTCardProps } from "./NFTCard";

import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

interface SaleNftCardProps extends NFTCardProps {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard: FC<SaleNftCardProps> = ({
  tokenId,
  image,
  name,
  metadataArray,
  setMetadataArray,
}) => {
  const [registeredPrice, setRegisteredPrice] = useState<number>(0);

  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<OutletContext>();

  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        //@ts-expect-error
        .ownerOf(tokenId)
        .call();

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) {
        console.log("오류!");
        return;
      }

      console.log("로그인 했고 주인 아님");

      const response = await saleNftContract.methods
        //@ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registeredPrice, "ether"),
        });

      const temp = metadataArray.filter((v, i) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const getRegisteredPrice = async () => {
    try {
      //@ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegisteredPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;
    getRegisteredPrice();
  }, [saleNftContract]);

  return (
    <div>
      <NFTCard tokenId={tokenId} image={image} name={name} />
      <div>
        {registeredPrice} ETH <button onClick={onClickPurchase}>구매</button>
      </div>
    </div>
  );
};

export default SaleNftCard;
