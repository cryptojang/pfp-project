import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NFTCard from "../components/NFTCard";

const GET_AMOUNT = 6; // 변수 한 번에 관리해야 할 때. 안 그러면 숫자 수정할 때 하나 빼먹기 쉬움

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0); //어디까지 조회했는지 수
  const [totalNFT, setTotalNFT] = useState<number>(0); //현재까지 발행된 전체 nft 수
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<OutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getNFTs();
      }
    });

    if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  const getTotalSupply = async () => {
    // 보통 이름 get 가져오기 set 저장하기로 명명
    try {
      if (!mintNftContract) return;

      const totalSupply = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalSupply));
      setTotalNFT(Number(totalSupply));
    } catch (error) {
      console.log(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            //@ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId }); // 원래 tokenId로 이름 같아서 줄일 수 있는데, 형변환 해야 하므로 .
        }
      }

      setSearchTokenId(searchTokenId - GET_AMOUNT);

      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNFTs();
  }, [totalNFT]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect(); // intersectionobserver가 비동기 영역이기 때문에 리액트단에서 컨트롤이 안 돼 수동으로 해제해야 함
  }, [metadataArray]);

  return (
    <>
      <div className="grow ">
        <ul className=" p-8 grid grid-cols-2 gap-8">
          {metadataArray?.map((v, i) => (
            <NFTCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!} // undefined 에러 처리 위해 ! 붙여줌
            />
          ))}
        </ul>
        <div ref={detectRef} className=" text-white py-4">
          Detecting Area
        </div>
      </div>
    </>
  );
};

export default Home;
