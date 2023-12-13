import { Contract, ContractAbi } from "web3";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
}

export interface NftMetadata {
  tokenId?: number; // 빼먹었을 때 이렇게 추가할 수 있겠다. ㅋㅋ
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}
