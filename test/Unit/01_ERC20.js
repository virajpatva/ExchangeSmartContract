const USDT = artifacts.require('USDT');
const Web3 = require('web3');
const chainID = config.network_id;

(1 == chainID ? contract : contract.skip)
('Contract Name : USDT ', async (accounts) => {   
        var contractInstance ;
        before(async function(){
            console.log('Contract Address : ' , USDT.address);
            contractInstance = await USDT.deployed();          
        });
        
        it('Test Case 1 : Contract is Deployed Properly' , async () => {
            assert(contractInstance.address != null , "Contract Instance isn't deployed properly");
        });
        it('Test Case 2 : Minting Tokens' , async () => {
            await contractInstance.mint(accounts[0],10000,{from : accounts[0]});
            balance =await contractInstance.balanceOf(accounts[0]);
            assert( balance.toNumber() === 1000000000000, 'Token Minted Properly');
        });
    });

