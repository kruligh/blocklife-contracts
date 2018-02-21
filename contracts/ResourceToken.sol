pragma solidity 0.4.19;

import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import { StandardToken } from "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import { DetailedERC20 } from "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import { MintableResource } from "./resource/MintableResource.sol";


/**
 * @title ResourceToken
 * @dev
 * @author kruligh
 */
contract ResourceToken is MintableResource, StandardToken, DetailedERC20 {

    function ResourceToken(string _name, string _symbol, uint8 _decimals)
        public
        DetailedERC20(_name, _symbol, _decimals)
    {

    }
}

