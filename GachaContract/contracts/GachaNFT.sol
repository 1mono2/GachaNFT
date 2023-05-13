// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//OpenZeppelinが提供するヘルパー機能をインポートします。
//import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "hardhat/console.sol";

contract GachaNFT is ERC721Holder {
    using EnumerableSet for EnumerableSet.UintSet;

    struct Offer {
        address nftContract;
        address owner;
        uint256 tokenId;
        uint256 price;
    }

    EnumerableSet.UintSet private availableTokenIds;
    mapping(uint256 => Offer) public offers;

    constructor() {}

    function deposit(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price should be greater than 0");
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        uint256 offerId = _randomAtAddress(msg.sender, tokenId);
        offers[offerId] = Offer(nftContract, msg.sender, tokenId, price);
        availableTokenIds.add(offerId);
    }

    // msg.senderのアドレスとOwnerが一致する場合に、そのOffer structを返す関数
    function getOffersByOwner() external view returns (Offer[] memory) {
        Offer[] memory tempOffers = new Offer[](availableTokenIds.length());
        uint256 count;

        for (uint256 i = 0; i < availableTokenIds.length(); i++) {
            uint256 offerId = availableTokenIds.at(i);
            Offer storage currentOffer = offers[offerId];

            if (currentOffer.owner == msg.sender) {
                tempOffers[count] = currentOffer;
                count++;
            }
        }

        // Create a new memory array with the appropriate length and copy the relevant offers
        Offer[] memory userOffers = new Offer[](count);
        for (uint256 i = 0; i < count; i++) {
            userOffers[i] = tempOffers[i];
        }
        return userOffers;
    }

    // Withdraw関数を修正して、contract addressとTokenIDを引数に取る
    function withdraw(address nftContractAddress, uint256 tokenId) external {
        uint256 offerId = _randomAtAddress(msg.sender, tokenId);
        Offer memory offer = offers[offerId];
        require(
            offer.owner == msg.sender,
            "Only the owner can withdraw the offer."
        );
        require(
            offer.nftContract == nftContractAddress && offer.tokenId == tokenId,
            "Invalid NFT contract address or token ID."
        );

        IERC721(offer.nftContract).transferFrom(
            address(this),
            msg.sender,
            offer.tokenId
        );
        availableTokenIds.remove(offerId);
        delete offers[offerId];
    }

    function selectRandomNFT(uint256 maxPrice) external view returns (uint256) {
        require(availableTokenIds.length() > 0, "No NFTs available");

        // Filter offers based on maxPrice
        uint256[] memory filteredOffers = new uint256[](
            availableTokenIds.length()
        );
        uint256 count = 0;
        for (uint256 i = 0; i < availableTokenIds.length(); i++) {
            uint256 offerId = availableTokenIds.at(i);
            Offer memory currentOffer = offers[offerId];
            if (currentOffer.price <= maxPrice) {
                filteredOffers[count] = offerId;
                count++;
            }
        }

        require(count > 0, "No NFTs available within the specified maxPrice");

        // Select a random NFT from the filtered offers
        uint256 index = _random(count);
        uint256 selectedOfferId = filteredOffers[index];

        return selectedOfferId;
    }

    function getOffer(uint256 offerId) external view returns (Offer memory) {
        return offers[offerId];
    }

    function purchase(uint256 offerId, uint256 maxPrice) external payable {
        Offer memory offer = offers[offerId];
        require(offer.price <= msg.value, "Insufficient funds");
        require(maxPrice == msg.value, "Excess funds");
        address owner = offer.owner;
        payable(owner).transfer(maxPrice);
        IERC721(offer.nftContract).transferFrom(
            address(this),
            msg.sender,
            offer.tokenId
        );
        availableTokenIds.remove(offerId);
        delete offers[offerId];
    }

    function _random(uint256 max) private view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
        );
        return randomHash % max;
    }

    function _randomAtAddress(
        address addr,
        uint256 tokenId
    ) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(addr, tokenId)));
    }
}
