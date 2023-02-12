import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat";
import { Shop, Shop__factory, USDC, USDC__factory } from "../typechain-types";
import { BN, ZERO_ADDRESS, BalanceTracker as BT } from "./utils";

describe("Material Flow Test", function () {
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let signer: SignerWithAddress;
  let users: SignerWithAddress[];

  let Shop__factory: Shop__factory;
  let Shop: Shop;

  let USDC__factory: USDC__factory;
  let USDC: USDC;

  before(async () => {
    const signers = await ethers.getSigners();
    [deployer, owner, signer] = signers.slice(0, 3);
    users = signers.slice(3, 20);

    // Setup balance tracker
    const userBTs = users.map((user) => new BT(user.address));

    // Get contracts artifacts
    Shop__factory = await ethers.getContractFactory("Shop");
    USDC__factory = await ethers.getContractFactory("USDC");

    // Deploy contracts
    Shop = (await upgrades.deployProxy(Shop__factory, [owner.address, signer.address])) as Shop;
    USDC = await USDC__factory.deploy(
      users.map((user) => user.address),
      1000
    );

    userBTs.forEach((userBT) => {
      userBT.addToken(USDC.address);
      userBT.takeSnapshot("0");
    });
  });

  describe("Set permitted token", () => {
    it("[Fail]: Caller is not owner", async () => {
      await expect(Shop.connect(users[0]).setPermittedToken(USDC.address, true)).revertedWith("Ownable: caller is not the owner");
    });

    it("[Fail]: Invalid payment token", async () => {
      await expect(Shop.connect(owner).setPermittedToken(ZERO_ADDRESS, true)).revertedWith("Invalid payment token");
    });

    it("[OK]", async () => {
      expect(await Shop.permittedTokens(USDC.address)).to.equal(false);
      await Shop.connect(owner).setPermittedToken(USDC.address, true);
      expect(await Shop.permittedTokens(USDC.address)).to.equal(true);
    });
  });

  describe("Make order", () => {
    let customer: SignerWithAddress;
    const price = 200;
    const data = JSON.stringify({
      name: "Cigar1",
      amount: 2,
      date: 123123,
    });

    let txMessage: string;
    let signature: string;

    beforeEach(async () => {
      customer = users[0];
      txMessage = await Shop.generateTxMessage(customer.address, USDC.address, price, data);
      signature = await signer.signMessage(ethers.utils.arrayify(txMessage));
    });

    it("[Fail]: Invalid payment token", async () => {
      const USDCFake: USDC = await USDC__factory.deploy([customer.address], 1000000);
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDCFake.address, price, data)).to.revertedWith("Invalid payment token");
    });

    it("[Fail]: Invalid price", async () => {
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, 0, data)).to.revertedWith("Invalid price");
    });

    it("[Fail]: Invalid transaction message", async () => {
      txMessage = await Shop.generateTxMessage(users[1].address, USDC.address, price, data);
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, price, data)).to.revertedWith("Invalid transaction message");

      const USDCFake: USDC = await USDC__factory.deploy([customer.address], 1000000);
      txMessage = await Shop.generateTxMessage(customer.address, USDCFake.address, price, data);
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, price, data)).to.revertedWith("Invalid transaction message");

      txMessage = await Shop.generateTxMessage(customer.address, USDC.address, 1, data);
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, price, data)).to.revertedWith("Invalid transaction message");

      txMessage = await Shop.generateTxMessage(customer.address, USDC.address, price, "xxx");
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, price, data)).to.revertedWith("Invalid transaction message");
    });

    it("[Fail]: Invalid signature", async () => {
      txMessage = await Shop.generateTxMessage(customer.address, USDC.address, 1, data);
      signature = await customer.signMessage(ethers.utils.arrayify(txMessage));
      await expect(Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, 1, data)).to.revertedWith("Invalid signature");
    });

    it("[OK]", async () => {
      await USDC.connect(users[0]).increaseAllowance(Shop.address, ethers.constants.MaxUint256);

      const txMessage = await Shop.generateTxMessage(customer.address, USDC.address, price, data);
      const signature = signer.signMessage(ethers.utils.arrayify(txMessage));

      await Shop.connect(customer).makeOrder(txMessage, signature, USDC.address, price, data);
    });
  });
});
