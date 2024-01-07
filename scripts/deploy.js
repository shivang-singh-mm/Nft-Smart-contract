const hre = require("hardhat");
require('dotenv').config()


async function main() {
  const OceanToken = await hre.ethers.getContractFactory("OceanToken");
  const oceanToken = await OceanToken.deploy(1000,100,"0x2c0524E100bA11A9096d619D37b372994b960D1a","0x2c0524E100bA11A9096d619D37b372994b960D1a");

  await oceanToken.waitForDeployment();
  const adress = await oceanToken.getAddress();

  console.log("Ocean Token deployed: ", adress);
  // // await oceanToken.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  // console.log(oceanToken.signer)
  // console.log(`Verifying contract on Etherscan...`);
  // oceanToken._mint(20,0x2c0524E100bA11A9096d619D37b372994b960D1a)

  // await run(`verify:verify`, {
  //   address: oceanToken.address,
  //   constructorArguments: [10000000,50],
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
