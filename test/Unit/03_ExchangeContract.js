const USDT = artifacts.require('USDT');
const PriceFeedContract = artifacts.require("PriceConsumerV3");
const ExchangeContract = artifacts.require("ExchangeContract");
const Web3 = require('web3');
const chainID = config.network_id;
const truffleAssert = require('truffle-assertions');

(1 == chainID ? contract : contract.skip)
("Contract Name : Exchange Contract", async (accounts) => {
    var contractInstance ;
    var USDTTokenInstance ;
    var PriceFeedInstance ; 
    var price;
    before(async () => { 
        contractInstance = await ExchangeContract.deployed();
        USDTTokenInstance = await USDT.deployed();
        PriceFeedInstance = await PriceFeedContract.deployed();
        price = await PriceFeedInstance.getLatestPrice();

        console.log("Exchange Contract", contractInstance.address);
        console.log("USDT Contract", USDTTokenInstance.address);
        console.log("Price Feed Contract", PriceFeedContract.address);
            
    });

    it("Test Case 1 : Minting new coins to account 2" , async () => {
        
        await USDTTokenInstance.mint(accounts[2],3000);
        balance =await USDTTokenInstance.balanceOf(accounts[2]);
        console.log("USDT Balance of Account 2 : ",balance.toNumber());
        assert.equal(balance.toNumber(), 3000 * 100000000,"Token aren't minted");
    });
    it("Test Case 2 : Approving Tokens to smart contract", async () => {
        contractAddress = await contractInstance.address;
        await USDTTokenInstance.approve(contractAddress,price,{from : accounts[2]});
        let approvedTokens  =  await USDTTokenInstance.allowance(accounts[2],contractInstance.address);
        console.log("Approved Tokens ==> ", approvedTokens.toNumber());
        assert.equal(approvedTokens.toNumber(),price,"Token aren't approved");
    });

    it("Test Case 3 : Sending Ethers to smart contract" , async () => {
        await contractInstance.sendTransaction({from : accounts[0], value : 2000000000000000000});
        contractBalance =await web3.eth.getBalance(contractInstance.address);
        assert.equal(contractBalance, 2000000000000000000,"Contract Ether Transfer Failed");
    });
    
    it("Test Case 4 : Exchanging Ethers from smart contract", async () => {
        userBalance = await web3.eth.getBalance(accounts[2]);
        await contractInstance.USDTtoETH(1,{from : accounts[2]});
        userUpdatedBalance = await web3.eth.getBalance(accounts[2]);
        console.log("Balance Before : ", userBalance);
        console.log("Balance after : ", userUpdatedBalance);
        assert(userUpdatedBalance > userBalance + 990000000000000000);
    });
    
    it('Test Case 5 : Withdrawing Ethers ', async () => {
        await truffleAssert.reverts(
            contractInstance.WithdrawEth({from : accounts[2]}),
            "Only Owner"
        );             
        await contractInstance.WithdrawEth({from : accounts[0]});
        contractBalance =await web3.eth.getBalance(contractInstance.address);
        assert.equal(contractBalance, 0,"Contract Ether Transfer Failed");
    });

    it("Test Case 6 : Failing Exchanging Ethers from smart contract", async () => {
        await truffleAssert.reverts(
            contractInstance.USDTtoETH(1,{from : accounts[2]}),
            "Invalid Quantity"
        ); 
    });

    it("Test Case 7 : Withdrawing ERC20 Tokens" , async() => {
        await truffleAssert.reverts(
            contractInstance.TransferUSDT({from : accounts[1]}),
            "Only Owner"
        ); 
        await contractInstance.TransferUSDT({from : accounts[0]});
        ownerBalance = await USDTTokenInstance.balanceOf(accounts[0]);
        assert.equals(ownerBalance,price);
    });
});