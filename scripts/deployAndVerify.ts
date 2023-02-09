import { run, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";
import { Table } from "./utils";

const table = new Table();

async function main() {
  const isLocalNetwork = ["hardhat", "local"].includes(network.name);

  // Loading accounts
  const [deployer, owner, ...signers]: SignerWithAddress[] = await ethers.getSigners();

  // Get contracts artifacts
  const Material_factory: Material__factory = await ethers.getContractFactory("Material");
  const HomeLab_factory: HomeLab__factory = await ethers.getContractFactory("HomeLab");

  // Deploy contracts
  console.log("============DEPLOYING CONTRACTS============");

  const Material: Material = (await upgrades.deployProxy(Material_factory, [owner.address])) as Material;
  await Material.deployed();
  const materialVerifyAddress: string = await upgrades.erc1967.getImplementationAddress(Material.address);
  table.add([
    {
      name: "Material",
      type: "proxy",
      address: Material.address,
    },
    {
      name: "Material",
      type: "verify",
      address: materialVerifyAddress,
    },
  ]);

  const HomeLab: HomeLab = (await upgrades.deployProxy(HomeLab_factory, [owner.address])) as HomeLab;
  await HomeLab.deployed();
  const homeLabVerifyAddress: string = await upgrades.erc1967.getImplementationAddress(HomeLab.address);
  table.add([
    {
      name: "HomeLab",
      type: "proxy",
      address: HomeLab.address,
    },
    {
      name: "HomeLab",
      type: "verify",
      address: homeLabVerifyAddress,
    },
  ]);

  table.log();

  if (isLocalNetwork) {
    console.log("============EARLY TRANSACTIONS============");
    console.log("done");
  }

  console.log("============SAVE CONTRACTS ADDRESS============");
  await table.save("deployed", `${network.name}_${Date.now()}.json`);

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
