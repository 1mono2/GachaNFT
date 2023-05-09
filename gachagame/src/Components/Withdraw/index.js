import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { CONTRACT_ADDRESS, transformOfferData, SEPOLIA_NETWORK } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
import './Withdraw.css'
import NO_IMAGE_URL from "../../Utils/no_image.jpg";

const Withdraw = () => {
    const [NFTs, setNFTs] = useState([]);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [images, setImages] = useState([]);

    // display alternative image when image is not found
    const handleError = (e) => {
        e.target.src = NO_IMAGE_URL; // ここに代替イメージのURLを指定
    };

    // Get NFT by owner from the contract
    useEffect(() => {
        const getOffersByOwner = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, gachaNFT.abi, signer);
            const userAddress = await signer.getAddress();
            const rawOffers = await contract.getOffersByOwner({ from: userAddress });

            const transformedOffers = rawOffers.map(transformOfferData);
            setNFTs(transformedOffers);
        };

        getOffersByOwner();
    }, []);

    // fetch images using Moralis when NFTs change
    useEffect(() => {
        const fetchImages = async () => {
            const tokens = NFTs.map((nft) => ({
                "tokenAddress": nft.nftContract,
                "tokenId": nft.tokenId,
            }));


            try {

                const response = await Moralis.EvmApi.nft.getMultipleNFTs({
                    "chain": SEPOLIA_NETWORK,
                    "tokens": tokens,
                    "normalizeMetadata": true,
                    "mediaItems": false
                });
                if (response.length === 0) return;
                const imageUrls = response.toJSON().map((nft) => nft.normalized_metadata.image);
                setImages(imageUrls);
            } catch (e) {
                console.error(e);
            }
        };

        if (NFTs.length > 0) {
            fetchImages();
        }
    }, [NFTs]);


    const handleTokenSelect = (nft) => {
        setSelectedNFT(nft);
    };

    const handleWithdraw = async () => {
        if (selectedNFT === null) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, gachaNFT.abi, signer);
        await contract.withdraw(selectedNFT.nftContract, selectedNFT.tokenId);
    };

    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Withdraw your NFTs</p>
            </div>
            <div className="nft-list">
                {NFTs.map((nft, index) => (
                    <div
                        key={index}
                        className={`nft-item ${selectedNFT && selectedNFT.tokenId === nft.tokenId ? "selected" : ""}`}
                        onClick={() => handleTokenSelect(nft)}
                    >
                        <img src={images[index]} alt={`NFT ${nft.tokenId}`} onError={handleError} />
                        <p>Price: {nft.price}</p>
                    </div>
                ))}
            </div>
            <button className="withdraw-btn" onClick={handleWithdraw}>
                Withdraw
            </button>
        </div>
    );
};

export default Withdraw;
