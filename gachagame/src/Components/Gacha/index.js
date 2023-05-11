import React, { useEffect, useState } from "react";
import Moralis from "moralis";
import { CONTRACT_ADDRESS, transformOfferData, SEPOLIA_NETWORK } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
import './Gacha.css'
import NO_IMAGE_URL from "../../Utils/no_image.jpg";
const { ethers } = require("ethers")

const Gacha = () => {
    const [offerId, setOfferId] = useState([]);
    const [NFT, setNFT] = useState(null);
    const [NFTImage, setNFTImage] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);
    const [showGachaOptions, setShowGachaOptions] = useState(true);

    // display alternative image when image is not found
    const handleError = (e) => {
        e.target.src = NO_IMAGE_URL; // ここに代替イメージのURLを指定
    };


    const handleGacha = async () => {
        // Call selectRandomNFT function from the smart contract
        try {
            if (maxPrice <= 0) {
                alert("Please enter more than 0 ETH");
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gachaContract = new ethers.Contract(CONTRACT_ADDRESS, gachaNFT.abi, signer);
            const weiPrice = ethers.utils.parseEther(maxPrice.toString());
            const selectedOfferId = await gachaContract.selectRandomNFT(weiPrice);
            const offer = await gachaContract.getOffer(selectedOfferId);
            const offerData = transformOfferData(offer);
            setOfferId(selectedOfferId);
            setNFT(offerData);

            // Fetch image using MoralisAPI
            const response = await Moralis.EvmApi.nft.getMultipleNFTs({
                chain: SEPOLIA_NETWORK,
                tokens: [
                    {
                        tokenAddress: offerData.nftContract,
                        tokenId: offerData.tokenId
                    }
                ],
                normalizeMetadata: true,
                mediaItems: false
            });
            if (response.length > 1) return;
            setNFTImage(response.toJSON()[0].normalized_metadata.image);
            setShowGachaOptions(false);
        } catch (error) {
            console.log(error);
            alert("Please enter more ETH");
        }
    };

    const handleConfirm = async () => {
        // Call purchase function from the smart contract
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gachaContract = new ethers.Contract(CONTRACT_ADDRESS, gachaNFT.abi, signer);
            const weiPrice = ethers.utils.parseEther(maxPrice.toString());
            await gachaContract.purchase(offerId, weiPrice, { value: weiPrice });
            console.log("Purchase successful");
        } catch (error) {
            console.log(error);
        }
        setNFT(null);
        setNFTImage("");
        setShowGachaOptions(true);

    };

    const handleReject = () => {
        setNFT(null);
        setNFTImage("");
        setShowGachaOptions(true);
    };



    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Gacha Gacha</p>
            </div>
            {showGachaOptions ? (
                <div>
                    <label htmlFor="price">Price: </label>
                    <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <label htmlFor="symbol"> ETH</label>
                    <div className="gacha-btn-container">
                        <button className="gacha-btn" onClick={handleGacha}>Gacha</button>
                    </div>
                </div>
            ) : (
                <>
                    <img src={NFTImage} alt="Selected NFT" onError={handleError} />
                    <button className="gacha-btn" onClick={handleConfirm}>Confirm</button>
                    <button className="gacha-btn" onClick={handleReject}>Reject</button>
                </>
            )}
        </div>
    );

}

export default Gacha;