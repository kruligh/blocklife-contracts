import { assert } from 'chai';

import * as Web3 from 'web3';

import { Mine, Artifacts } from '';

import { ContractContextDefinition } from 'truffle';
import {
  assertNumberEqual,
  assertReverts,
  findLastLog,
  ZERO_ADDRESS
} from './helpers';

declare const web3: Web3;
declare const artifacts: Artifacts;
declare const contract: ContractContextDefinition;

const MineContract = artifacts.require('./Mine.sol');

contract('Mine', accounts => {
  const owner = accounts[0];
  let myContract: Mine;

  describe('#ctor', () => {
    it('should create contract', async () => {
      myContract = await MineContract.new({ from: owner });
      assert.isOk(contract);
    });
  });
});
