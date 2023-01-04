import { ethers } from "hardhat";

const investableCap = 2000;
const openWeekday = 7;
const openHour = 0;
const openDuration = 24;

module.exports = [
    ethers.utils.parseEther(investableCap.toString()), openWeekday, openHour, openDuration
]