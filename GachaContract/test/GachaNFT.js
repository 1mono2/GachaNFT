const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

async function deployGachaNFTFixture() {
    [owner] = await ethers.getSigners();
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const erc721Mock = await ERC721Mock.deploy("TestNFT", "TNFT");

    const GachaNFT = await ethers.getContractFactory("GachaNFT");
    const gachaNFT = await GachaNFT.deploy();

    return { erc721Mock, gachaNFT };
}

async function depositedNFTFixture() {

    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const erc721Mock = await ERC721Mock.deploy("TestNFT", "TNFT");

    const GachaNFT = await ethers.getContractFactory("GachaNFT");
    const gachaNFT = await GachaNFT.deploy();

    const [owner, user1, user2] = await ethers.getSigners();
    console.log("ERC721 Contract address: " + erc721Mock.address + "\nGacha contract address: " + gachaNFT.address + "\nOwner: " + owner.address + "\nuser1: " + user1.address + "\nuser2: " + user2.address);

    let oneEth = ethers.utils.parseEther("1.0");

    await erc721Mock.mint(owner.address, 1);
    await erc721Mock.approve(gachaNFT.address, 1);
    await gachaNFT.deposit(erc721Mock.address, 1, oneEth);

    await erc721Mock.mint(owner.address, 2);
    await erc721Mock.approve(gachaNFT.address, 2);
    await gachaNFT.deposit(erc721Mock.address, 2, ethers.utils.parseEther("2.0"));

    await erc721Mock.connect(user1).mint(user1.address, 3);
    await erc721Mock.connect(user1).approve(gachaNFT.address, 3);
    await gachaNFT.connect(user1).deposit(erc721Mock.address, 3, ethers.utils.parseEther("3.0"));

    await erc721Mock.connect(user2).mint(user2.address, 4);
    await erc721Mock.connect(user2).approve(gachaNFT.address, 4);
    await gachaNFT.connect(user2).deposit(erc721Mock.address, 4, ethers.utils.parseEther("4.0"));

    return { erc721Mock, gachaNFT, owner, user1, user2 };
}

describe("GachaNFT", function () {
    describe("Deposit", function () {
        it("Should deposit an NFT and create a new offer", async function () {
            const { erc721Mock, gachaNFT } = await deployGachaNFTFixture();
            const [owner, user1, user2] = await ethers.getSigners();
            //console.log("Contract address: " + gachaNFT.address + "\nOwner: " + owner.address + "\n user1: " + user1.address + "\n user2: " + user2.address);
            const tokenId = 1;
            const price = 100;

            await erc721Mock.mint(owner.address, tokenId);
            await erc721Mock.approve(gachaNFT.address, tokenId);
            await gachaNFT.deposit(erc721Mock.address, tokenId, price);

            await erc721Mock.mint(owner.address, 2);
            await erc721Mock.approve(gachaNFT.address, 2);
            await gachaNFT.deposit(erc721Mock.address, 2, price);

            await erc721Mock.connect(user1).mint(user1.address, 3);
            await erc721Mock.connect(user1).approve(gachaNFT.address, 3);
            await gachaNFT.connect(user1).deposit(erc721Mock.address, 3, 200);

            await erc721Mock.connect(user2).mint(user2.address, 4);
            await erc721Mock.connect(user2).approve(gachaNFT.address, 4);
            await gachaNFT.connect(user2).deposit(erc721Mock.address, 4, 10000);

            let offers = await gachaNFT.getOffersByOwner();
            expect(offers[0].nftContract).to.equal(erc721Mock.address);
            expect(offers[0].owner).to.equal(owner.address);
            expect(offers[0].tokenId.toNumber()).to.equal(tokenId);
            expect(offers[0].price.toNumber()).to.equal(price);
            expect(offers[1].nftContract).to.equal(erc721Mock.address);
            expect(offers[1].owner).to.equal(owner.address);
            expect(offers[1].tokenId.toNumber()).to.equal(2);


            offers = await gachaNFT.connect(user1).getOffersByOwner();
            expect(offers[0].nftContract).to.equal(erc721Mock.address);
            expect(offers[0].owner).to.equal(user1.address);
            expect(offers[0].tokenId.toNumber()).to.equal(3);
            expect(offers[0].price.toNumber()).to.equal(200);

            offers = await gachaNFT.connect(user2).getOffersByOwner();
            expect(offers[0].nftContract).to.equal(erc721Mock.address);
            expect(offers[0].owner).to.equal(user2.address);
            expect(offers[0].tokenId.toNumber()).to.equal(4);
            expect(offers[0].price.toNumber()).to.equal(10000);

        });

        it("Should be enable users to withdraw their owned NFT", async function () {
            const { erc721Mock, gachaNFT, owner, user1, user2 } = await depositedNFTFixture();
            let offers = await gachaNFT.connect(owner).getOffersByOwner();
            //console.log(offers);
            expect(offers.length).to.equal(2);
            expect(await erc721Mock.ownerOf(1)).to.equal(gachaNFT.address);
            gachaNFT.connect(owner).withdraw(erc721Mock.address, 1);
            offers = await gachaNFT.connect(owner).getOffersByOwner();
            expect(offers.length).to.equal(1);
            expect(await erc721Mock.ownerOf(1)).to.equal(owner.address);
        });
    });

    describe("Purchase", function () {
        it("Should choose a random NFT", async function () {
            const { erc721Mock, gachaNFT, owner, user1, user2 } = await depositedNFTFixture();

            async function selectRandomNFT() {
                let oneEth = ethers.utils.parseEther("4");
                const tokenId = await gachaNFT.connect(owner).selectRandomNFT(oneEth);
                let offer = await gachaNFT.connect(owner).getOffer(tokenId);
                console.log("Token Id: " + offer.tokenId +
                    "\nToken owner: " + offer.owner +
                    "\nToken price: " + ethers.utils.formatEther(offer.price) + " ETH");
            }

            for (let i = 0; i < 1; i++) {
                await selectRandomNFT();
                time.increase(1000);
            }

        });

        it("Should be able to purchase an NFT", async function () {
            const { erc721Mock, gachaNFT, owner, user1, user2 } = await depositedNFTFixture();
            async function purchaseNFT() {
                let oneEth = ethers.utils.parseEther("4");
                const tokenId = await gachaNFT.connect(owner).selectRandomNFT(oneEth);
                await gachaNFT.connect(user1).getOffer(tokenId);
                let offer = await gachaNFT.connect(owner).getOffer(tokenId);
                console.log("Token Id: " + offer.tokenId +
                    "\nToken owner: " + offer.owner +
                    "\nToken price: " + ethers.utils.formatEther(offer.price) + " ETH");
                let token = await gachaNFT.connect(user2).purchase(tokenId, oneEth, { value: oneEth });

                const balanceOwner = await ethers.provider.getBalance(owner.address);
                const balanceUser1 = await ethers.provider.getBalance(user1.address);
                const balanceUser2 = await ethers.provider.getBalance(user2.address);
                console.log("Owner: " + ethers.utils.formatEther(balanceOwner)
                    + "\nUser1: " + ethers.utils.formatEther(balanceUser1)
                    + "\nUser2: " + ethers.utils.formatEther(balanceUser2));
            }

            for (let i = 0; i < 4; i++) {
                await purchaseNFT();
                time.increase(1000);
            }
        });
    });
});
