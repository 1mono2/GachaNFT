import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { CONTRACT_ADDRESS, SEPOLIA_NETWORK, MORALIS_API_KEY } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
import "./Deposit.css";

const Deposit = () => {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [ownedNFT, setOwnedNFT] = useState([]);

    useEffect(() => {
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

        async function getNFTByOwner() {
            try {

                await Moralis.start({
                    apiKey: MORALIS_API_KEY,
                });

                console.log("mol" + currentAccount);
                const response = await Moralis.EvmApi.nft.getWalletNFTs({
                    "chain": SEPOLIA_NETWORK,
                    "format": "decimal",
                    "tokenAddresses": [],
                    "mediaItems": false,
                    "address": currentAccount,
                });

                console.log(response.toJSON().result[0].token_address);
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
                <p className="header gradient-text">Deposit to the contract</p>
            </div>
        </div>

    );
}

export default Deposit;