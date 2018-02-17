pragma solidity 0.4.19;


/**
 * @title Exchange
 * @dev Exchange contract allows to..
 * @author kruligh 
 */
contract Exchange {
    
    uint256 public exampleAttribute;

    modifier onlyExampleCondition(uint256 value) {
        require(value > 10);
        _;
    }

    event ExampleAttributeChanged(uint256 newValue);

    function Exchange() public {
        exampleAttribute = 10;
    }

    function exampleFunction(uint256 newValue)
        public
        onlyExampleCondition(newValue)
    {
        exampleAttribute = newValue;

        ExampleAttributeChanged(newValue);
    }
}
