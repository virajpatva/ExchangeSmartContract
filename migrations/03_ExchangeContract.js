const ExchangeContract = artifacts.require('ExchangeContract');
const USDT = artifacts.require('USDT');
const PriceFeedContract = artifacts.require("PriceConsumerV3");
module.exports = function (deployer){
    deployer.deploy(ExchangeContract,PriceFeedContract.address,USDT.address);
}