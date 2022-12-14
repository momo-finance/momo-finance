import { ethers } from "hardhat";

async function main() {
  const proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];
  const proposals = [];
  for(let i = 0; i < proposalNames.length; i++) {
    const proposal = ethers.utils.formatBytes32String(proposalNames[i]);
    proposals.push(proposal);
  }
  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy(proposals);

  await ballot.deployed();

  console.log(`Proposals ${proposalNames} deployed to ${ballot.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
