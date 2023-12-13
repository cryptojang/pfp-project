import { FC, Dispatch, SetStateAction } from "react";
import { OutletContext } from "./Layout";
import { useOutletContext } from "react-router-dom";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MintModal: FC<MintModalProps> = ({ setIsOpen }) => {
  const { mintNftContract, account } = useOutletContext<OutletContext>(); //context로 만들어서 my props 말고 바로 내려줄 수 잇음

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      const response = await mintNftContract.methods
        .mintNFT()
        .send({ from: account });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl">
        <div className="bg-pink-200 text-right mb-8">
          <button onClick={() => setIsOpen(false)}>x</button>
        </div>
        <div>이 NFT를 민팅하시겠습니까?</div>
        <div className="bg-blue-100 text-center mt-4">
          <button onClick={onClickMint}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default MintModal;
