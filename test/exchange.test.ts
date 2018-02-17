import { assert } from 'chai';

import * as Web3 from 'web3';

import {
  Exchange,
  ExampleAttributeChangedEvent,
  ProjectArtifacts,
} from 'project';

import { ContractContextDefinition } from 'truffle';
import {
  assertNumberEqual,
  assertReverts,
  findLastLog,
  ZERO_ADDRESS
} from './helpers';

declare const web3: Web3;
declare const artifacts: ProjectArtifacts;
declare const contract: ContractContextDefinition;

const ExchangeContract = artifacts.require('./Exchange.sol');

contract('Exchange', accounts => {
  const owner = accounts[9];
  let myContract: Exchange;

  describe('#ctor', () => {
    it('should set exampleAttribute', async () => {
      myContract = await ExchangeContract.new({ from: owner });
      assert.isOk(contract);
      assertNumberEqual(await myContract.exampleAttribute(), 10);
    });
  });

  describe('#exampleFunction', () => {
    const newValue = 15;

    beforeEach(async () => {
        myContract = await ExchangeContract.new({ from: owner });
    });

    it('should set exampleAttribute to newValue', async () => {
      await myContract.exampleFunction(newValue, { from: owner });
      assertNumberEqual(await myContract.exampleAttribute(), newValue);
    });

    it('should emit ExampleAttributeChanged event', async () => {
      const tx = await myContract.exampleFunction(newValue, { from: owner });

      const log = findLastLog(tx, 'ExampleAttributeChanged');
      assert.isOk(log);

      const event = log.args as ExampleAttributeChangedEvent;
      assertNumberEqual(event.newValue, newValue);
    });

    it('should revert for invalid value', async () => {
      await assertReverts(async () => {
        await myContract.exampleFunction(5, { from: owner });
      });
    });
  });
});
