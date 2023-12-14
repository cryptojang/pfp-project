// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './MintNFT.sol';

contract SaleNFT {

    mapping(uint => uint) public nftPrices; // 앞 uint는 tokenId => 뒤에 uint 는 nft 가격. dictionary 만들어준다.
    uint[] public onSaleNFTs; //이건 배열 만든거임

    // 판매 등록
    function setForSaleNFT(address _mintNftAddress, uint _tokenId, uint _price) public {

        ERC721 mintNftContract = ERC721(_mintNftAddress); //MintNFT 타입임. 지금은 ERC721 타임으로 확장함. 다른 컨트랙트로 발행한 nft도 사용할 수 있게. 
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender == nftOwner, "Caller is not NFT owner."); // 1) 주인 확인
        require(_price > 0, "Price is zero or lower."); // 2) 가격 > 0 인지 확인
        require(nftPrices[_tokenId] == 0, "This NFT is already on sale."); // 3) 현재 판매 중 아니다 확인
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)), "NFT owner did not approve token."); // 4) transfer 권한 이전

        nftPrices[_tokenId] = _price; // nft에 가격 등록
        onSaleNFTs.push(_tokenId);  //판매 리스트 만듬

    }

    //구매 기능
    function purchaseNFT(address _mintNftAddress, uint _tokenId) public payable { 

        ERC721 mintNftContract = ERC721(_mintNftAddress); 
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender != nftOwner, "Call is NFT owner.");  //주인 구매 방지
        require(nftPrices[_tokenId] > 0, "This NFT not in sale."); //판매 중 확인
        require(nftPrices[_tokenId] <= msg.value); // 더 높이 살 수도 잇으니 < 포함. 경매 방식도 가능하겠지.

        payable(nftOwner).transfer(msg.value); //msg.value/2 해서 수수료 구현도 가능

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId);

        nftPrices[_tokenId] = 0;

        checkZeroPrice();
    
    }
    //판매된 상품 리스트에서 제거
    function checkZeroPrice() public {
        for(uint i = 0; i < onSaleNFTs.length; i++) {
            if(nftPrices[onSaleNFTs[i]] == 0)
            {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length - 1];
                onSaleNFTs.pop();
            }
        }
    }

    function getOnSaleNFTs() public view returns(uint[] memory) {
        return onSaleNFTs;
    }
}