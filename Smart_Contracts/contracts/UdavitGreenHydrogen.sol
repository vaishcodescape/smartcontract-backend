// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UdavitGreenHydrogen {
    // Owner of the contract
    address public owner;

    // Mapping to track subsidies per address
    mapping(address => uint256) public subsidies;

    // Total subsidy pool
    uint256 public totalSubsidyPool;

    // Events
    event SubsidyAdded(address indexed user, uint256 amount);
    event SubsidyWithdrawn(address indexed user, uint256 amount);
    event SubsidyPoolFunded(address indexed from, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Fund the subsidy pool (owner can fund)
    function fundSubsidyPool() external payable {
        require(msg.value > 0, "Must send ETH to fund pool");
        totalSubsidyPool += msg.value;
        emit SubsidyPoolFunded(msg.sender, msg.value);
    }

    // Add subsidy for a user (owner only)
    function addSubsidy(address _user, uint256 _amount) external onlyOwner {
        require(_amount <= totalSubsidyPool, "Not enough funds in pool");
        subsidies[_user] += _amount;
        totalSubsidyPool -= _amount;
        emit SubsidyAdded(_user, _amount);
    }

    // Withdraw subsidy (user)
    function withdrawSubsidy() external {
        uint256 amount = subsidies[msg.sender];
        require(amount > 0, "No subsidy available");
        subsidies[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit SubsidyWithdrawn(msg.sender, amount);
    }

    // Get subsidy balance for a user
    function getSubsidy(address _user) external view returns (uint256) {
        return subsidies[_user];
    }

    // Owner can withdraw leftover funds from contract
    function withdrawRemaining() external onlyOwner {
        uint256 remaining = address(this).balance;
        require(remaining > 0, "No funds to withdraw");
        payable(owner).transfer(remaining);
    }

    // Receive function to accept ETH directly
    receive() external payable {
        totalSubsidyPool += msg.value;
        emit SubsidyPoolFunded(msg.sender, msg.value);
    }
}
