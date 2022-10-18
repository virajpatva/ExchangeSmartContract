const PriceFeedContract = artifacts.require("PriceConsumerV3");

require('dotenv').config("");
const { NetworkConfig } = require('../helper-truffle-config.js');
const Web3 = require("web3");

module.exports = async (deployer)=>{
    let network_Id =await web3.eth.net.getId();
    
    let address = NetworkConfig[network_Id].ETH_USD;
    await deployer.deploy(PriceFeedContract,address);
}
