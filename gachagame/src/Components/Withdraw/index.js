import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { CONTRACT_ADDRESS } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";
//import "";

const Withdraw = () => {

    // Get NFT by owner
    const [ownedNFT, setOwnedNFT] = useState([]);

    const getNFTByOwner = async () => {

    }

    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Withdraw your NFT form the contract.</p>
            </div>
        </div>

    );
}

export default Withdraw;