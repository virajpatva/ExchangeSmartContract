// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IPriceConsumerV3 {
    function getLatestPrice() external view returns (int price);
    function getLatestPrice(address aggreator) external view returns (int price);
}