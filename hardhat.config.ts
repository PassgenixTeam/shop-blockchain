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
			accounts: [process.env.LOCAL_DEPLOYER!, process.env.LOCAL_OWNER!],
		},
		polygon_test: {
			url: process.env.POLYGON_TEST_RPC,
			accounts: [process.env.POLYGON_TEST_DEPLOYER!, process.env.POLYGON_TEST_OWNER!],
			chainId: 80001,
		},
	},
	etherscan: {
		apiKey: {
			polygonMumbai: process.env.POLYGON_TEST_API_KEY!,
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
		reporterOptions: {
			configFile: "./mocha-report.json",
		},
	},
};

export default config;
