import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
import "./Deposit.css";

const Deposit = () => {

    // Get NFT by owner
    const [ownedNFT, setOwnedNFT] = useState([]);

    const getNFTByOwner = async () => {

    }

    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Deposit to the contract</p>
            </div>
        </div>

    );
}

export default Deposit;