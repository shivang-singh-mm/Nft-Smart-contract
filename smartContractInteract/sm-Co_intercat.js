const { Web3 } = require("web3");
require('dotenv').config()
const {ethers} = require('ethers');

const  abi  = require("../artifacts/contracts/OceanToken.sol/OceanToken.json");

const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/093faf083af74767b434602dfead162a'));
BigInt.prototype.toJSON = function() { return this.toString() };

const mintNewTokens = async(req,res) => {
    const data = {
        account: req.body.account,
        amount: req.body.amount,
        contract_adress: req.body.contractAdress 
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contract_adress);
        myContract.handleRevert = true;

        const totalSupplyBeforeMinting = 
    await myContract.methods.totalSupply().call()
        const balanceOfMintingAccountBeforeMinting = await myContract.methods.balanceOf(data.account).call();

        const nonce =   await web3.eth.getTransactionCount(data.account);
        console.log(nonce);

        // Build the transaction object
        const transactionObject = {
            from: data.account,
            to: data.contract_adress,
            gas: 10000000, // You may need to adjust the gas limit based on your transaction
            gasPrice: await web3.eth.getGasPrice(),
            nonce: nonce,
            data: myContract.methods.mintAfterDeployment(data.account,data.amount).encodeABI(),
        };

        // Sign the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, process.env.PRIVATE_KEY);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        
        console.log('Transaction sent. Transaction hash:', receipt.transactionHash);

        const totalSupplyAfterMinting = await myContract.methods.totalSupply().call();
        const balanceOfMintingAccountAfterMinting =await myContract.methods.balanceOf(data.account).call();

        return res.json({txhash: receipt.transactionHash, totalSupplyBeforeMinting: totalSupplyBeforeMinting,balanceOfMintingAccountBeforeMinting:balanceOfMintingAccountBeforeMinting,totalSupplyAfterMinting:totalSupplyAfterMinting,balanceOfMintingAccountAfterMinting:balanceOfMintingAccountAfterMinting});
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const burnTokens = async(req,res) => {
    const data = {
        account: req.body.account,
        amount: req.body.amount,
        contract_adress: req.body.contractAdress
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contract_adress);
        myContract.handleRevert = true;

        const nonce =   await web3.eth.getTransactionCount(data.account);
        // web3.eth.getTransactionCount(data.contract_adress);

        // Build the transaction object
        const transactionObject = {
            from: data.account,
            to: data.contract_adress,
            gas: 1000000, // You may need to adjust the gas limit based on your transaction
            gasPrice: await web3.eth.getGasPrice(),
            nonce: nonce,
            data: myContract.methods.burnAfterDeployment(data.account,data.amount).encodeABI(),
        };

        // Sign the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, process.env.PRIVATE_KEY);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log('Transaction sent. Transaction hash:', receipt.transactionHash);
        return res.json(receipt.transactionHash);
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const transactionDetails =async (req,res)=> {
    const data = {
        txn_hash: req.body.txnHash,
        contract_adress: req.body.contractAdress
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contract_adress);
        myContract.handleRevert = true;
        const txn = await  web3.eth.getTransaction(data.txn_hash);
        return res.json(txn)
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const contractInfo = async (req,res) => {
    const data = {
        contractAdress: req.body.contractAdress
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contractAdress);
        myContract.handleRevert = true;
        // const receipt = await web3.eth.getTransac(data.contractAdress);

        // const txHash = await web3.eth.getTransaction()
        // const block = await web3.eth.getBlock("4708800");
        // const deploymentTimestamp = 
        // new Date(Number(block.timestamp) * 10000).toLocaleString()
        // .toString();
        const eventFilter = {
            fromBlock: 0, // Replace with the block number or 'latest' to start from the latest block
            toBlock: 'latest',
            address: data.contractAdress,
            // topics: [web3.utils.sha3('PreMint')],
          };
          
         await  myContract.getPastEvents('allEvents', {
            // filter: eventFilter,
            fromBlock: 0,
            toBlock: 'latest'
          }, (error, events) => {
            if (error) {
              console.error('Error retrieving events:', error);
            } else {
              console.log('Filtered Events:', events);
              // Process the filtered events as needed
            }
        }).then((data)=>{return res.json(data[0])})
        // l.on('data', event => {
        //     console.log('Event Data:', event);
        //     // console.log('Transaction Hash:', event.transactionHash);
        // })
        // .on('error', error => {
        //     console.error('Error:', error);
        // });
        // const maxTokens = await myContract.methods.maxTokens().call();
        // const totalTokens = await myContract.methods.totalTokens().call();
        // const cooldownTime = await myContract.methods.cooldownTime().call();
        // // await Promise.all([maxTokens,totalTokens,cooldownTime])
        // const decimal = 1000000000000000000n;
        // return res.json({maxTokens:maxTokens/decimal,totalTokens:totalTokens/decimal,cooldownTime:cooldownTime + " seconds"});

    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const checkBalance = async(req,res) => {
    const data = {
        number: req.body.number,
        account: req.body.account,
        contract_adress: req.body.contractAdress
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contract_adress);
        myContract.handleRevert = true;
        
        const balance = await myContract.methods.balanceOf(data.account).call();
        console.log('Balance: ', balance/1000000000000000000n);
        return res.json({balance: balance/1000000000000000000n});
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const checkHistory = async (req,res) => {
    
    const data = {
        contractAdress: req.body.contractAdress
    }
    
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contractAdress);
        // myContract.handleRevert = true;
        const mintEvents = await myContract.getPastEvents('mintAfterDeployment', {
      filter: { _from: "0x2c0524e100ba11a9096d619d37b372994b960d1a" },
      fromBlock: "4708800",
      toBlock: "4708800",
    });

    console.log(mintEvents);
        const history = await web3.eth.getPastLogs({fromBlock:'0x0',address:data.contractAdress});
        // console.log(await )
        return res.json(history);
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

const airdrop = async(req,res) => {
    const data = {
        account: req.body.account,
        // ?JSON.parse(req.body.account):null,
        amount: req.body.amount,
        contractAdress: req.body.contractAdress
    }
    try{
        const myContract = new web3.eth.Contract(abi.abi, data.contractAdress);
        myContract.handleRevert = true;

        const nonce =   await web3.eth.getTransactionCount(data.account[0]);
        // web3.eth.getTransactionCount(data.contract_adress);

        // Build the transaction object
        const transactionObject = {
            from: data.account[0],
            to: data.contractAdress,
            gas: 10000000000, // You may need to adjust the gas limit based on your transaction
            gasPrice: await web3.eth.getGasPrice(),
            nonce: nonce,
            data: myContract.methods.airDrop(data.account,data.amount).encodeABI(),
        };

        // Sign the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, process.env.PRIVATE_KEY);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log('Transaction sent. Transaction hash:', receipt.transactionHash);
        return res.json(receipt.transactionHash);
    }
    catch(err){
        console.log(err);
        return res.json(err);
    }
}

module.exports = {
    checkBalance,
    burnTokens,
    mintNewTokens,
    airdrop,
    checkHistory,
    transactionDetails,
    contractInfo
}