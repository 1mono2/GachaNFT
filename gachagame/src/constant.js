const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0x5c156dBdAcFe756D1c28f9DA4d9927f5fbdaA92e";
const SEPOLIA_NETWORK = "11155111";
const GOERLI_NETWORK = "5";
const transformOfferData = (offerData) => {
    return {
        nftContract: offerData.nftContract,
        owner: offerData.owner,
        tokenId: offerData.tokenId.toNumber(),
        price: ethers.utils.formatUnits(offerData.price.toString(), "ether"),
    };
};
const MORALIS_API_KEY = "zb4sYWpTvVBbIoMHiuoAh4ejbEJgtwoAcRqWwVbrnY1NSgMIg6GBWrCS89ATvBQE";
export { CONTRACT_ADDRESS, SEPOLIA_NETWORK, GOERLI_NETWORK, transformOfferData, MORALIS_API_KEY };