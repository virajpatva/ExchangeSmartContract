const wBTC = artifacts.require('WrappedBTC');
const PriceFeedContract = artifacts.require("PriceConsumerV3");
const ExchangeContract = artifacts.require("ExchangeContract");
const Web3 = require('web3');
const chainID = config.network_id;
const truffleAssert = require('truffle-assertions');
const { NetworkConfig } = require('../../helper-truffle-config');
(1 == chainID ? contract : contract.skip)
("Contract Name : Exchange Contract", async (accounts) => {
    const ETH_BTC = NetworkConfig[chainID].ETH_BTC;
    var contractInstance ;
    var wBTCInstance ;
    var PriceFeedInstance ; 
    var price;
    before(async () => { 
        contractInstance = await ExchangeContract.deployed();
        wBTCInstance = await wBTC.deployed();
        PriceFeedInstance = await PriceFeedContract.deployed();
        price = await PriceFeedInstance.getLatestPrice(ETH_BTC);
        console.log(price.toNumber());
        console.log("Exchange Contract", contractInstance.address);
        console.log("wBTC Contract", wBTCInstance.address);
        console.log("Price Feed Contract", PriceFeedContract.address);
    });

    it("Test Case 1 : Minting Coins and approving" , async () => {
        
        await wBTCInstance.mint(accounts[2],1);
        
        balance =await wBTCInstance.balanceOf(accounts[2]);
        console.log("wBTC Balance of Account 2 : ",balance.toNumber());
        
        assert.equal(balance.toNumber(), 1 * 100000000,"Token aren't minted");
        
        contractAddress = await contractInstance.address;
        
        await wBTCInstance.approve(contractAddress,1 * 100000000,{from : accounts[2]});
        
        let approvedTokens  =  await wBTCInstance.allowance(accounts[2],contractInstance.address);
        
        console.log("Approved Tokens ==> ", approvedTokens.toNumber());
        assert.equal(approvedTokens.toNumber(),1 * 100000000,"Token aren't approved");
    });

    
    it("Test Case 2 : Sending Ethers to smart contract" , async () => {
        await contractInstance.sendTransaction({from : accounts[0], value : 15000000000000000000});
        contractBalance =await web3.eth.getBalance(contractInstance.address);
        assert.equal(contractBalance, 15000000000000000000,"Contract Ether Transfer Failed");
    });
    
    it("Test Case 3 : Exchanging Ethers from smart contract", async () => {
        userBalance = await web3.eth.getBalance(accounts[2]);
        await contractInstance.wBTCToEth(13,{from : accounts[2]});
        userUpdatedBalance = await web3.eth.getBalance(accounts[2]);
        console.log("Balance Before : ", userBalance);
        console.log("Balance after : ", userUpdatedBalance);
        assert(userUpdatedBalance > userBalance + 12990000000000000000);
    });
    
   
   
    it("Test Case 4 : Withdrawing ERC20 Tokens" , async() => {
        await truffleAssert.reverts(
            contractInstance.TransferwBTC({from : accounts[1]}),
            "Only Owner"
        ); 
        await contractInstance.TransferwBTC({from : accounts[0]});
        ownerBalance = await wBTCInstance.balanceOf(accounts[0]);
        assert.equal(ownerBalance,13 * price);
    });
});