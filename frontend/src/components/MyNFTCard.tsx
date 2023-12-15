import { FC, FormEvent, useEffect, useState } from "react";
import NFTCard, { NFTCardProps } from "./NFTCard";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

interface MyNFTCardProps extends NFTCardProps {
  saleStatus: boolean;
}

const MyNftCard: FC<MyNFTCardProps> = ({
  tokenId,
  image,
  name,
  saleStatus,
}) => {
  const [price, setPrice] = useState<string>(""); //인풋으로 들어오니까. 나중에 형 변환해서 사용하면됨.
  const [registeredPrice, setRegisteredPrice] = useState<number>(0);

  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>();

  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      const response = await saleNftContract.methods
        .setForSaleNFT(
          //@ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegisteredPrice(+price);
      setPrice("");
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
      {registeredPrice ? (
        <div>{registeredPrice} ETH</div>
      ) : (
        saleStatus && (
          <form onSubmit={onSubmitForSale}>
            <input
              type="text"
              className="border-2 mr-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></input>
            <input type="submit" value="등록"></input>
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;
