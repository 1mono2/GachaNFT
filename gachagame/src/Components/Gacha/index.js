import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../constant";
import gachaNFT from "../../Utils/GachaNFT.json";

const Gacha = () => {

    // Get NFT by owner
    const [ownedNFT, setOwnedNFT] = useState([]);

    const getNFTByOwner = async () => {

    }

    return (
        <div className="container">
            <div className="header-container">
                <p className="header gradient-text">Gacha Gacha</p>
            </div>
        </div>

    );
}

export default Gacha;