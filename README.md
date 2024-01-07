Run docker compose and wait for the build to finish.

To deploy the contract run 
        npm i; npx hardhat run --network sepolia scripts/deploy.js 
NOTE=> To configure deployment script, change the deploy.js file in scripts.
       Changing the arguments can help in so.
       OceanToken.deploy(cappedAmount,preMintTokens,adressForInitialMintOfTokens,adressOfOwnerOfToken);

Rest can be tested by postman.
