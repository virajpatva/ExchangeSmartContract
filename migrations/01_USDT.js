const USDT = artifacts.require('USDT');

module.exports = function (deployer){
    process.env.NETWORK = deployer.network;
    console.log(process.env.NETWORK);
    deployer.deploy(USDT);
}

