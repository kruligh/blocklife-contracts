pragma solidity 0.4.19;

import {Ownable} from "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ResourceToken {
    function isTransferManager(address addr) public returns (bool);

    function isMintingManager(address addr) public returns (bool);
}


contract Mine is Ownable {

    struct MineInstance {
        uint256 buildTime;
        uint256 lastMiningTime;
        uint256 totalMined;
    }

    struct ResourceCost {
        ResourceToken resource;
        uint256 amount;
    }

    mapping(address => MineInstance) private instancesByOwner;

    ResourceCost[] private resourceCosts;

    modifier onlyEqual(uint256 a, uint256 b) {
        require(a == b);
        _;
    }

    function Mine(ResourceToken[] resources, uint256[] amounts)
    public
    onlyEqual(resources.length, amounts.length)
    {
        for (uint256 i = 0; i < resources.length; i++) {
            require(resources[i] != address(0));
            require(amounts[i] > 0);
            require(resources[i].isTransferManager(this));
            require(resources[i].isMintingManager(this));

            resourceCosts.push(ResourceCost({
                resource : resources[i],
                amount : amounts[i]
                }));

        }
    }

    function buildMine() public {

        instancesByOwner[msg.sender] = MineInstance({
            buildTime : now,
            lastMiningTime : now,
            totalMined : 0
            });
    }

}