// SPDX-License-Identifier: MIT


pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OceanToken is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public cooldownTime = 3 minutes;
    uint256 public lastMintedTimestamp;
    uint256 public lastBurnedTimestamp;
    uint256 public totalTokens;

    event PreMint(uint256 timeStamp,address payable mintAddress, uint256 amount);
    event MintDetails(uint256 timeStamp, address mintAddress, uint256 amount);
    event BurnDetails(uint256 timeStamp, address mintAddress, uint256 amount);

    constructor(uint256 max_token, uint256 amount, address payable mintAdress, address payable ownerAccount) ERC20("OceanToken", "OCT") ERC20Capped(max_token * (10 ** decimals())) {
        owner = ownerAccount; 
        _mint(mintAdress, amount * (10 ** decimals()));
        cooldownTime = 3 minutes;
        emit PreMint(block.timestamp, mintAdress, amount);
    }



    function mintAfterDeployment(address payable account, uint256 amount) external onlyOwner(){
        require(block.timestamp-lastMintedTimestamp>=cooldownTime, "Cooldown time warning. Cannot mint before 3 minutes"); 
        require( ERC20.totalSupply() + amount * (10 ** decimals())<=cap(),"Minting amount of tokens cannnot exceed capped value");
        _mint(account,amount * (10 ** decimals()));
        lastMintedTimestamp= block.timestamp;
        emit MintDetails(block.timestamp, account, amount);
    }
    function burnAfterDeployment(address account, uint256 amount) external onlyOwner(){
        require(block.timestamp-lastBurnedTimestamp>=cooldownTime, "Burn time warning. Cannot burn before 3 minutes.");
        require( amount * (10 ** decimals())<=balanceOf(account),"Burning amount could not be more than nft present");
        _burn(account,amount * (10 ** decimals()));
        lastBurnedTimestamp = block.timestamp;
        emit BurnDetails(block.timestamp, account, amount);
    }
    function airDrop (address[10] memory dropAddress, uint256 amount )public{
        require(block.timestamp-lastMintedTimestamp>=cooldownTime, "Minting time warning. Cannot mint before 3 minutes.");
        // require(totalTokens+amount * (10 ** decimals())<=maxTokens, "Minting amount of tokens cannnot exceed total supply");
        _mint(payable(dropAddress[0]),(amount * (10 ** decimals()))/2);
        for(uint i=1;i<dropAddress.length;i++){
            _mint(dropAddress[i],amount * (10 ** decimals()));
        }
        lastMintedTimestamp= block.timestamp;
        totalTokens += amount * (10 ** decimals());
    }
   

    // function destroy() public onlyOwner {
    //     selfdestruct(owner);
    // }

    function _update(address from, address to, uint256 value) internal override (ERC20,ERC20Capped){
        ERC20Capped._update(from, to, value);
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}