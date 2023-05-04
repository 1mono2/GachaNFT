const hre = require("hardhat");

async function main() {
    const GachaNFTFactory = await hre.ethers.getContractFactory("GachaNFT");
    const GachaNFT = await GachaNFTFactory.deploy();
    await GachaNFT.deployed();

    console.log("GachaNFT deployed to:", GachaNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});