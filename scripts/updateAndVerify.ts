import fs from "fs/promises";
import { run, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";
import { Table } from "./utils";
import { Material, Material__factory } from "../typechain-types";

const table = new Table();

async function main() {
  const isLocalNetwork = ["hardhat", "local"].includes(network.name);

  // Loading accounts
  const [deployer, ...signers]: SignerWithAddress[] = await ethers.getSigners();

  // Get contracts artifacts
  const Material_factory: Material__factory = await ethers.getContractFactory("Material");

  // Deploy contracts
  console.log("============UPGRADING CONTRACTS============");

  const Material: Material = (await upgrades.upgradeProxy(contractAddresses.Material, Material_factory)) as Material;
  await Material.deployed();
  const MaterialVerifyAddress = await getImplementationAddress(ethers.provider, Material.address);
  table.push(["Material", "proxy", Material.address], ["Material", "verify", MaterialVerifyAddress]);

  console.log(table.toString());

  console.log("============SAVE CONTRACTS ADDRESS============");
  const contracts = {
    ...contractAddresses,
    setting: Setting.address,
    settingVerify: settingVerifyAddress,
    soulFactory: SoulFactory.address,
    soulFactoryVerify: soulFactoryVerifyAddress,
    community: Community.address,
    communityVerify: communityVerifyAddress,
  };

  await fs.writeFile(`deployed/updated_${network.name}_${Date.now()}.json`, JSON.stringify(contracts));
  console.log("done");

  if (!isLocalNetwork) {
    console.log("============VERIFY CONTRACTS============");
    const jobs = [
      run("verify:verify", {
        address: contracts.settingVerify,
      }),
      run("verify:verify", {
        address: contracts.soul721,
      }),
      run("verify:verify", {
        address: contracts.soulFactoryVerify,
      }),
      run("verify:verify", {
        address: contracts.communityVerify,
      }),
    ];

    await Promise.all(jobs.map((job) => job.catch(console.log)));
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
