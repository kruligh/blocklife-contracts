import { assert } from 'chai';

import * as Web3 from 'web3';

import {ProjectArtifacts, Resource} from 'project';

import { ContractContextDefinition } from 'truffle';

declare const web3: Web3;
declare const artifacts: ProjectArtifacts;
declare const contract: ContractContextDefinition;

const ResourceContract = artifacts.require('./ResourceToken.sol');

contract('ResourceToken', accounts => {
  const owner = accounts[9];
  let resource: Resource;

  describe('#ctor', () => {
    it('should create contract', async () => {
      resource = await ResourceContract.new({ from: owner });
      assert.isOk(contract);
    });
  });
});
