const USDT = artifacts.require('USDT');
const PriceFeedContract = artifacts.require("PriceConsumerV3");
const ExchangeContract = artifacts.require("ExchangeContract");
const Web3 = require('web3');
const chainID = config.network_id;

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
    });
    it("Test Case 1 : Minting new coins to account 2" , async () => {
        
        await USDTTokenInstance.mint(accounts[2],3000);
        BALANCE =await USDTTokenInstance.balanceOf(accounts[2]);
        console.log(BALANCE.toNumber());
        assert.equal(BALANCE.toNumber(), 3000 * 100000000,"Token aren't minted");
    });
    it("Test Case 2 : Approving Tokens to smart contract", async () => {
        await USDTTokenInstance.approve(contractInstance.address,price,{from : accounts[2]});
        let approvedTokens  =  await USDTTokenInstance.allowance(accounts[2],contractInstance.address);
        assert.equal(approvedTokens.toNumber(),price,"Token aren't approved");
    });

    it("Test Case 3 : Sending Ethers to smart contract" , async () => {
        await contractInstance.sendTransaction({from : accounts[0], value : 1000000000000000000});
        contractBalance =await web3.eth.getBalance(contractInstance.address);
        assert.equal(contractBalance, 1000000000000000000,"Contract Ether Transfer Failed");
    });

    it('Test Case 4 : Exchanging Ether to USDT ')
});