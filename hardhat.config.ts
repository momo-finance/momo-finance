import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Go to https://etherscan.io/myapikey, and create a new API key.
const ETHERSCAN_API_KEY = "K734X6PN5884ND3M3GX6GYM6FBUPD5WVRU";

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "DmiwRaxOdCpZFibXPfQmG_jxqXfSjOq2";

// Replace this private key with your Goerli account private key.
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key.
// Beware: NEVER put real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "4eda8a462858c3a0777ba770a9df77446c6602363bea53698e3c98e3119d7487";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    }
  }
};

export default config;
