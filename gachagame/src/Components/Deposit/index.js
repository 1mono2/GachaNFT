import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { CONTRACT_ADDRESS, SEPOLIA_NETWORK } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
import IERC721 from "../../Utils/IERC721.json";
import "./Deposit.css";
import NO_IMAGE_URL from "../../Utils/no_image.jpg";

const Deposit = () => {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [ownedNFT, setOwnedNFT] = useState([]);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [price, setPrice] = useState(0);

    const handleError = (e) => {
        e.target.src = NO_IMAGE_URL; // ここに代替イメージのURLを指定
    };

    async function depositNFT(nftContractAddress, tokenId, price) {
        try {
            // GachaNFTコントラクトのインスタンスを作成
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gachaNFTContract = new ethers.Contract(CONTRACT_ADDRESS, gachaNFT.abi, signer);

            // NFTコントラクトのインスタンスを作成
            const nftContract = new ethers.Contract(nftContractAddress, IERC721.abi, signer);

            // ユーザーがNFTをGachaNFTコントラクトにデポジットするためのアプルーブを実行
            const approveTx = await nftContract.approve(CONTRACT_ADDRESS, tokenId);
            await approveTx.wait();

            // GachaNFTコントラクトのdeposit関数を呼び出す
            const depositTx = await gachaNFTContract.deposit(nftContractAddress, tokenId, price);
            await depositTx.wait();

            console.log("NFT deposited successfully");
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleSelection = (nft) => {
        console.log("Selected NFT:", nft.name);
        setSelectedNFT(nft);
    };

    const handleDeposit = () => {
        if (selectedNFT && price > 0) {
            console.log("Depositing NFT:", selectedNFT);
            const weiPrice = ethers.utils.parseEther(price.toString());
            depositNFT(selectedNFT.token_address, selectedNFT.token_id, weiPrice);
        } else {
            console.log("No NFT selected");
            alert("Please select an NFT and set a price");
        }
    };


    useEffect(() => {
        // get user's wallet address
        async function getAddress() {
            try {
                const { ethereum } = window;
                if (!ethereum) {
                    console.log('MetaMaskが見つかりませんでした。');
                    return;
                } else {
                    const accounts = await ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length !== 0) {
                        const account = accounts[0];
                        // ユーザーのウォレットアドレスを状態変数に格納します。
                        setCurrentAccount(account);
                    } else {
                        console.log("No authorized account found");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        getAddress();
    }, []);


    useEffect(() => {
        // Get NFT by owner using Moralis API
        async function getNFTByOwner() {
            try {

                const response = await Moralis.EvmApi.nft.getWalletNFTs({
                    "chain": SEPOLIA_NETWORK,
                    "format": "decimal",
                    "tokenAddresses": [],
                    "mediaItems": false,
                    "address": currentAccount,
                });

                let results = response.toJSON().result; // toJSON is Moralis' method
                setOwnedNFT(results);
                console.log(results);

            } catch (e) {
                console.error(e);
            }
        }

        if (currentAccount) {
            getNFTByOwner();
        }
    }, [currentAccount]);



    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Deposit your NFTs</p>
                {ownedNFT.length > 0 ? (
                    <div className="image-grid">
                        {ownedNFT.map((result) => {
                            let metadata = JSON.parse(result.metadata);
                            return (
                                <div key={result.token_hash}
                                    className={`nft-container 
                                    ${selectedNFT
                                            && selectedNFT.token_hash === result.token_hash
                                            && selectedNFT.token_id === result.token_id
                                            && selectedNFT.token_address === result.token_address
                                            ? "selected"
                                            : ""
                                        }`}
                                    onClick={() => handleSelection(result)}
                                >
                                    <img src={metadata.image} alt={metadata.name} onError={handleError} />
                                    <p className="text">{metadata.name}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>Your owned NFT not found</p>
                )}
                <div className="price-container">
                    <label htmlFor="price">Price: </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                    />
                    <label htmlFor="symbol"> ETH</label>
                </div>
                <button className="deposit-btn" onClick={handleDeposit}>Deposit</button>
            </div>
        </div>

    );
}

export default Deposit;