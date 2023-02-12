import { HardhatUserConfig } from "hardhat/config";

// Loading env configs for deploying and public contract source
import * as dotenv from "dotenv";
dotenv.config();

// All necessary tools for hardhat contracts
import "@nomicfoundation/hardhat-toolbox";

// Openzeppelin upgrade contract feature
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: { count: 20 },
    },
    local: {
      url: process.env.LOCAL_RPC,
      accounts: [process.env.LOCAL_DEPLOYER!, process.env.LOCAL_OWNER!, process.env.LOCAL_SIGNER!],
    },
    bscTestnet: {
      url: process.env.BSC_TEST_RPC,
      accounts: [process.env.BSC_TEST_DEPLOYER!, process.env.BSC_TEST_OWNER!, process.env.BSC_TEST_SIGNER!],
      chainId: 97,
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_SCAN_API_KEY!,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 400000,
    color: true,
    reporter: "mocha-multi-reporters",
  },
};

export default config;
