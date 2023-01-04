import { expect } from "chai";
import { network, ethers } from "hardhat";

const WETH_MAINNET_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH_ARBITRUM_MAINNET_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

const USDC_MAINNET_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ARBITRUM_MAINNET_ADDRESS = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const USDC_GOERLI_TESTNET_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

describe("SimpleSwap", function () {
  it("Should swap USDC from eth", async function () {
    const signer = await ethers.getSigner("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    var balance = await signer.getBalance();
    console.log("ETH balance: ", ethers.utils.formatEther(balance), "ETH");
    const WETH = new ethers.Contract(WETH_ARBITRUM_MAINNET_ADDRESS, ercAbi, signer);
    console.log("wrap 10 eth ...");
    const deposit = await WETH.deposit({value: ethers.utils.parseEther('10')});
    await deposit.wait();
    var wethBalance = await WETH.balanceOf(signer.address);
    balance = await signer.getBalance();
    console.log("ETH balance: ", ethers.utils.formatEther(balance), "ETH");
    console.log("WETH balance: ", ethers.utils.formatEther(wethBalance), "WETH");
    
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap", signer);
    const simpleSwap = await SimpleSwap.deploy(SwapRouterAddress);

    console.log("approve 10 WETH ...");
    await WETH.approve(simpleSwap.address, ethers.utils.parseEther('10'));
    console.log("swap 1 WETH for USDC ...");
    const swap = await simpleSwap.swapWETHForUSDC(ethers.utils.parseEther('1'));
    swap.wait();

    const USDC = new ethers.Contract(USDC_ARBITRUM_MAINNET_ADDRESS, ercAbi, signer);
    const usdcBalance = await USDC.balanceOf(signer.address);
    wethBalance = await WETH.balanceOf(signer.address);
    console.log("WETH balance: ", ethers.utils.formatEther(wethBalance), "WETH");
    console.log("USDC balance: ", ethers.utils.formatUnits(usdcBalance, 6), "USDC");

    
    /* Deploy the SimpleSwap contract */


    /* Connect to weth9 and wrap some eth  */

    
    /* Check Initial DAI Balance */ 


    /* Approve the swapper contract to spend weth9 for me */

    
    /* Execute the swap */
 
    
    /* Check DAI end balance */

    
    /* Test that we now have more DAI than when we started */


  });
});
