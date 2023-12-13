import { FC, useState } from "react";
import { Link } from "react-router-dom";

interface MyNFTCardProps {
  image: string;
  name: string;
  tokenId: number;
}

const MyNFTCard: FC<MyNFTCardProps> = ({ image, name, tokenId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <>
      <Link to={`/detail/${tokenId}`}>
        <li
          className="relative"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <img src={image} alt={name} />
          <div className="font-semibold mt-1">{name}</div>

          {isHover && (
            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 "></div>
          )}
        </li>
      </Link>
    </>
  );
};

export default MyNFTCard;
