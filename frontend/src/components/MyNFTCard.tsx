import { FC } from "react";
import NFTCard, { NFTCardProps } from "./NFTCard";

interface MyNFTCardProps extends NFTCardProps {}

const MyNftCard: FC<MyNFTCardProps> = ({ tokenId, image, name }) => {
  return (
    <div>
      <NFTCard tokenId={tokenId} image={image} name={name} />
      <div>판매 등록 기능</div>
    </div>
  );
};

export default MyNftCard;
