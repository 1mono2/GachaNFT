const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0xa805343EB8143F14D3B1014F5D772e881B015c20";
const SEPOLIA_NETWORK = "11155111";
const GOERLI_NETWORK = "5";
const transformOfferData = (offerData) => {
    return {
        nftContract: offerData.nftContract,
        owner: offerData.owner,
        price: ethers.utils.formatUnits(offerData.price.toString(), "ether"),
        tokenId: offerData.tokenId.toNumber()
    };
};
export { CONTRACT_ADDRESS, SEPOLIA_NETWORK, transformOfferData };