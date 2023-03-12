import { run, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades } from 'hardhat';
import { Table } from './utils';
import { Shop, Shop__factory, USDC, USDC__factory } from '../typechain-types';

const table = new Table();

async function main() {
  const isLocalNetwork = ['hardhat', 'local'].includes(network.name);

  // Loading accounts
  const [deployer, owner, signer, ...users]: SignerWithAddress[] = await ethers.getSigners();

  // Get contracts artifacts
  const Shop_factory: Shop__factory = await ethers.getContractFactory('Shop');
  const USDC_factory: USDC__factory = await ethers.getContractFactory('USDC');

  // Deploy contracts
  console.log('============DEPLOYING CONTRACTS============');

  // const Shop: Shop = Shop_factory.attach('0x3973F77b42Cb8AA79D5E2D5C4bc7851660d30287');
  const Shop: Shop = (await upgrades.deployProxy(Shop_factory, [owner.address, signer.address])) as Shop;
  await Shop.deployed();
  const materialVerifyAddress: string = await upgrades.erc1967.getImplementationAddress(Shop.address);
  table.add([
    {
      name: 'Shop',
      type: 'proxy',
      address: Shop.address,
    },
    {
      name: 'Shop',
      type: 'verify',
      address: materialVerifyAddress,
    },
  ]);

  let USDCAddress: string = process.env.USDC_ADDRESS!;
  if (isLocalNetwork) {
    const USDC: USDC = await USDC_factory.deploy(
      [deployer, owner, signer, ...users].map((user) => user.address),
      ethers.utils.parseEther('1000')
    );
    await USDC.deployed();
    USDCAddress = USDC.address;
  }

  table.add([
    {
      name: 'USDC',
      type: 'deploy',
      address: USDCAddress,
    },
  ]);

  table.log();

  console.log('============EARLY TRANSACTIONS============');
  await Shop.connect(owner).setPermittedToken(USDCAddress, true);
  console.log('done');

  console.log('============SAVE CONTRACTS ADDRESS============');
  await table.save('deployed', `${network.name}_${new Date().toISOString()}.json`);

  if (!isLocalNetwork) {
    console.log('============VERIFY CONTRACTS============');
    const jobs = table.toArray(['proxy']).map((row) =>
      run('verify:verify', {
        address: row[2],
      }).catch(console.log)
    );

    await Promise.all(jobs);
    console.log('done');
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
