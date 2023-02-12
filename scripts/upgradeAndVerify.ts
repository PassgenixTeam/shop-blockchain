import fs from "fs/promises";
import { run, network } from "hardhat";
import { ethers, upgrades } from "hardhat";
import { Table } from "./utils";
import { Shop, Shop__factory } from "../typechain-types";

import * as contractAddress from "../deployed/local_2023-02-12T04:41:40.995Z.json";

const table = new Table();

async function main() {
  const isLocalNetwork = ["hardhat", "local"].includes(network.name);

  // Get contracts artifacts
  const Shop_factory: Shop__factory = await ethers.getContractFactory("Shop");

  // Deploy contracts
  console.log("============UPGRADING CONTRACTS============");

  const Shop: Shop = (await upgrades.upgradeProxy(contractAddress.Shop_proxy, Shop_factory)) as Shop;
  await Shop.deployed();
  const shopVerifyAddress = await upgrades.erc1967.getImplementationAddress(Shop.address);
  table.push(["Shop", "proxy", Shop.address], ["Shop", "verify", shopVerifyAddress]);

  console.log(table.toString());

  console.log("============SAVE CONTRACTS ADDRESS============");
  const contracts = {
    ...contractAddress,
    ...table.toObject("all"),
  };

  const filePath = `deployed/upgraded_${network.name}_${new Date().toISOString()}.json`;
  await fs.writeFile(filePath, JSON.stringify(contracts));
  console.log(`Saved at: ${filePath}`);
  console.log("done");

  if (!isLocalNetwork) {
    console.log("============VERIFY CONTRACTS============");
    const jobs = table.toArray(["proxy"]).map((row) =>
      run("verify:verify", {
        address: row[2],
      }).catch(console.log)
    );

    await Promise.all(jobs);
    console.log("done");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
