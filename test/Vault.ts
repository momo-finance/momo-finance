import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVaultFixture() {
    const investableCap = 2_000;

    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(investableCap, 7, 8, 2);

    return { vault, owner, investableCap };
  }

  describe("Deployment", function () {
    it("Should set the right investableCap", async function () {
      const { vault, investableCap } = await loadFixture(deployVaultFixture);

      expect(await vault.investableCap()).to.equal(investableCap);
    });

    it("Should set the right owner", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);

      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should set correct time", async function () {
      const investableCap = 2_000;
      const openWeekday = 7;
      const openHour = 0;
      const openDuration = 6;
      
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy(investableCap, openWeekday, openHour, openDuration);
      
      const openTime = new Date(await vault.getNextOpenTime() * 1000);
      const closeTime = new Date(await vault.getNextCloseTime() * 1000);
      const offset = openTime.getTimezoneOffset()/60;
      expect(openTime.getDay()==0?7:openTime.getDay()).to.equal(openWeekday) &&
      expect(openTime.getHours()+offset).to.equal(openHour) &&
      expect(closeTime.getTime()).to.equal(openTime.getTime()+openDuration*60*60*1000);
    });

    it("Should revert if vault is not open", async function () {
      const ONE_GWEI = 1_000_000_000;

      const investableCap = 2_000;
      const openWeekday = 7;
      const openHour = 0;
      const openDuration = 6;
      
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy(investableCap, openWeekday, openHour, openDuration);

      const now = await time.latest();
      const closeTime = Number(await vault.getNextCloseTime());
      if (now < closeTime) {
        await time.increaseTo(closeTime);
      }
      const [otherAccount] = await ethers.getSigners();
      await expect(vault.connect(otherAccount).deposit({value: ONE_GWEI})).to.be.revertedWith("Vault is not open");
    });

    it("Should revert if vault is full", async function () {
      const investableCap = 2_000;
      const openWeekday = 7;
      const openHour = 0;
      const openDuration = 6;
      
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy(investableCap, openWeekday, openHour, openDuration);
      
      const openTime = Number(await vault.getNextOpenTime());
      const now = await time.latest();
      if (now < openTime) {
        await time.increaseTo(openTime);
      }
      const [otherAccount] = await ethers.getSigners();
      await expect(vault.connect(otherAccount).deposit({value: investableCap+1})).to.be.revertedWith("Vault is full");
    });

    it("Should can be withdraw", async function () {
      const amount = 100;

      const investableCap = 2_000;
      const openWeekday = 7;
      const openHour = 0;
      const openDuration = 6;
      
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy(investableCap, openWeekday, openHour, openDuration);
      
      const openTime = Number(await vault.getNextOpenTime());
      const now = await time.latest();
      if (now < openTime) {
        await time.increaseTo(openTime);
      }
      const [otherAccount] = await ethers.getSigners();
      await vault.connect(otherAccount).deposit({value: amount});

      await expect(vault.connect(otherAccount).withdraw()).to.changeEtherBalances(
        [otherAccount, vault],
        [amount, -amount]
      );
    });
  });
});
