// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../libraries/DateTime.sol";

contract Vault {

    uint public constant SECONDS_IN_A_HOUR = 3600;

    // Investors currently depositing money in this vault
    struct Investor {
        uint amount;
    }

    address public owner;

    uint public totalInvested;

    // Vault investable capacity
    uint public investableCap;

    // What day of the week to open the vault
    uint public openDayInWeek;

    // What hour does the vault open
    uint public openHour;

    // How long is the vault open
    uint public openDuration;

    // Store investor struct for each possible address.
    mapping(address => Investor) public investors;

    constructor(uint _investableCap, uint _openDayInWeek, uint _openHour, uint _openDuration) {
        owner = msg.sender;
        investableCap = _investableCap; 
        openDayInWeek = _openDayInWeek;
        openHour = _openHour;
        openDuration = _openDuration;
    }

    function setInvestableCap(uint _investableCap) external {
        require(msg.sender == owner, "Only owner can set investable cap");
        investableCap = _investableCap;
    }

    function setOpenTime(uint _openDayInWeek, uint _openHour, uint _openDuration) external {
        require(msg.sender == owner, "Only owner can set open time");
        openDayInWeek = _openDayInWeek;
        openHour = _openHour;
        openDuration = _openDuration;
    }    

    function isOpen() public view returns (bool) {
        uint thisWeekOpenTime = DateTime.getThisWeekday(block.timestamp, openDayInWeek);
        thisWeekOpenTime = DateTime.timestampFromDate(DateTime.getYear(thisWeekOpenTime), DateTime.getMonth(thisWeekOpenTime), DateTime.getDay(thisWeekOpenTime)) + openHour * 1 hours;
        uint thisWeekCloseTime = thisWeekOpenTime + openDuration * 1 hours;
        if (block.timestamp >= thisWeekOpenTime && block.timestamp < thisWeekCloseTime) {
            return true;
        }
        return false;
    }

    function getNextOpenTime() public view returns (uint) {
        uint nextWeekOpenTime = DateTime.getNextWeekday(block.timestamp, openDayInWeek);
        nextWeekOpenTime = DateTime.timestampFromDate(DateTime.getYear(nextWeekOpenTime), DateTime.getMonth(nextWeekOpenTime), DateTime.getDay(nextWeekOpenTime)) + openHour * 1 hours;
        uint nextWeekCloseTime = nextWeekOpenTime + openDuration * 1 hours;
        if (block.timestamp >= nextWeekCloseTime) {
            nextWeekOpenTime += 1 weeks;
        }
        return nextWeekOpenTime;
    }

    function getNextCloseTime() public view returns (uint) {
        uint nextWeekOpenTime = DateTime.getNextWeekday(block.timestamp, openDayInWeek);
        nextWeekOpenTime = DateTime.timestampFromDate(DateTime.getYear(nextWeekOpenTime), DateTime.getMonth(nextWeekOpenTime), DateTime.getDay(nextWeekOpenTime)) + openHour * 1 hours;
        uint nextWeekCloseTime = nextWeekOpenTime + openDuration * 1 hours;
        if (block.timestamp >= nextWeekCloseTime) {
            nextWeekCloseTime += 1 weeks;
        }
        return nextWeekCloseTime;
    }

    function deposit() public payable {
        require(isOpen(), "Vault is not open");
        require(totalInvested + msg.value <= investableCap, "Vault is full");
        investors[msg.sender].amount += msg.value;
        totalInvested += msg.value;
    }

    function withdraw() public {
        require(isOpen(), "Vault is not open");
        require(investors[msg.sender].amount > 0, "You have no money in this vault");
        uint amount = investors[msg.sender].amount;
        investors[msg.sender].amount = 0;
        totalInvested -= amount;
        payable(msg.sender).transfer(amount);
    }
}