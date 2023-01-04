import { ethers } from "hardhat";

async function main() {
  const investableCap = 2000;
  const openWeekday = 7;
  const openHour = 0;
  const openDuration = 24;
  
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(ethers.utils.parseEther(investableCap.toString()), openWeekday, openHour, openDuration);

  await vault.deployed();

  console.log(`Vault deployed to ${vault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
