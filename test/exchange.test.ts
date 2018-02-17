import { assert } from 'chai';

import * as Web3 from 'web3';

import { Exchange, ProjectArtifacts } from 'project';

import { ContractContextDefinition } from 'truffle';

declare const web3: Web3;
declare const artifacts: ProjectArtifacts;
declare const contract: ContractContextDefinition;

const ExchangeContract = artifacts.require('./Exchange.sol');

contract('Exchange', accounts => {
  const owner = accounts[9];

  describe('#ctor', () => {
    let exchange: Exchange;

    it('should create contract', async () => {
      exchange = await ExchangeContract.new({ from: owner });
      assert.isOk(contract);
    });
  });
});
