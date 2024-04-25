import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";

// ================================= TASKS =========================================

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts: string[] =  PRIVATE_KEY ? [PRIVATE_KEY] : [];

// ================================= CONFIG =========================================
const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["hardhat","buildbear"], //(multiChainProvider) injects provider for these networks
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.buildbear.io/striped-magik-9191e2ce`,
        //blockNumber:1 ,
      },
    },

    // Shared Testnet
   buildbear: {
      accounts,
      chainId: 1,
      url: `https://rpc.buildbear.io/striped-magik-9191e2ce`,
    },
   
  },
  etherscan: {
    apiKey: {
      buildbear: "verifyContract",
    },
    customChains: [
      {
        network: "buildbear",
        chainId: 1,
        urls: {
          apiURL: "https://rpc.buildbear.io/verify/etherscan/striped-magik-9191e2ce",
          browserURL: "https://explorer.buildbear.io/striped-magik-9191e2ce",
        },
      },
    ],
  },

  solidity: {
    compilers: [
      {
        version: "0.8.23",

        settings: {
          evmVersion: 'paris',
          optimizer: { enabled: true , runs:200},
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

};

export default config;
