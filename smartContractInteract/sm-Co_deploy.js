const hre= require("hardhat");
const { upgrades } = require('hardhat');
require('dotenv').config()

async function main(maxTokens,amount,initialMintAccountAddress,ownerAccount) {
    const OceanToken = await hre.ethers.getContractFactory("OceanToken");
    const oceanToken = await OceanToken.deploy(maxTokens,amount,initialMintAccountAddress,ownerAccount);
  
    await oceanToken.waitForDeployment();
    const adress = await oceanToken.getAddress();
  
    console.log("Ocean Token deployed: ", adress);
  }

const deployContract = async (req,res) =>{
    const data = {
        maxTokens: req.body.maxTokens,
        amount: req.body.amount,
        accountAdress: req.body.accountAdress,
        mintAdress: req.body.initialMintAccountAddress
    }
    try{
        const networkConfig = {
            sepolia: {
                url: process.env.INFURA_GOERLI_ENDPOINT,
                accounts: [process.env.PRIVATE_KEY]
            },
          };
        //   hre.network = 'sepolia';
        //   hre.config = networkConfig;
          // Deploy the contract
          const YourContract = await hre.ethers.getContractFactory('OceanToken');
          const yourContract = await YourContract.deploy(data.maxTokens,data.amount,data.mintAdress,data.accountAdress);
          await yourContract.waitForDeployment();
      
          console.log('YourContract deployed to:', yourContract.address);
      
          res.status(200).json({ success: true, contractAddress: yourContract.address });
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

module.exports = {
    deployContract
}
