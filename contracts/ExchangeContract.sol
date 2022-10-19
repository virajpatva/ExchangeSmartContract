// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./PriceFeedContract.sol";
import "./USDTContract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract ExchangeContract{ 

    PriceConsumerV3 PriceFeedInstance;
    IERC20 USDTContractInstance;
    address owner ; 

    constructor(address PriceFeedAddress,address USDTContractAddress){
        PriceFeedInstance = PriceConsumerV3(PriceFeedAddress);      
        USDTContractInstance = IERC20(USDTContractAddress);
        owner = msg.sender;
    }

    modifier OnlyOwner(){
        require(msg.sender == owner , 'Only Owner');
        _;
    }

    function USDTtoETH (uint EthQty) public payable{
        require(address(this).balance >= EthQty * 10 ** 18,"Invalid Quantity");
        uint latestPrice = uint(PriceFeedInstance.getLatestPrice());
        uint USDTQty = latestPrice * EthQty;
        USDTContractInstance.transferFrom(msg.sender,address(this),USDTQty);
        payable (msg.sender).transfer(EthQty * 10 ** 18);
    }

    fallback () external payable{

    }

    function WithdrawEth() public payable OnlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function TransferUSDT() public OnlyOwner{
        uint contractBalance = USDTContractInstance.balanceOf(address(this));
        require(contractBalance >= 0 , "Zero Balance");
        USDTContractInstance.transfer(msg.sender,contractBalance);
    }
}