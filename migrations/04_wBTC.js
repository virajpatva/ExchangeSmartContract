const wBTC = artifacts.require('WrappedBTC');

module.exports = function (deployer){
    deployer.deploy(wBTC);
}
