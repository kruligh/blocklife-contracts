import { assert } from 'chai';

import * as Web3 from 'web3';

import { ProjectArtifacts, Resource } from 'project';

import BigNumber from 'bignumber.js';
import { propOr } from 'ramda';
import { ContractContextDefinition } from 'truffle';
import { AnyNumber } from 'web3';
import { ResourceTestContext } from './resource/context';
import {
  testAddMintingManager,
  testMint
} from './resource/mintableresource.test';

declare const web3: Web3;
declare const artifacts: ProjectArtifacts;
declare const contract: ContractContextDefinition;

const ResourceContract = artifacts.require('./ResourceToken.sol');

const tokenName = 'token1';
const tokenSymbol = 't1';
const tokenDecimals = new BigNumber(18);

contract('ResourceToken', (accounts: Address[]) => {
  const owner = accounts[9];
  let resource: Resource;

  describe('#ctor', () => {
    it('should create contract', async () => {
      resource = await createResourceContract();
      assert.isOk(contract);
    });

    // todo check name, symbol, decimals
  });

  context('Given deployed token contract', () => {
    const ctx: ResourceTestContext = new ResourceTestContext(
        accounts.filter(acc => acc !== owner),
        owner
    );

    beforeEach(async () => {
      ctx.token = await createResourceContract();
    });

    describe('MintableResource', () => {
      describe('#mint', () => testMint(ctx));
      describe('#addMintingManager', () => testAddMintingManager(ctx));
    });
  });

  async function createResourceContract(
    options?: Partial<ResourceContractOptions>
  ): Promise<Resource> {
    return await ResourceContract.new(
      propOr(tokenName, 'name', options),
      propOr(tokenSymbol, 'symbol', options),
      propOr(tokenDecimals, 'decimals', options),
      { from: propOr(owner, 'from', options) }
    );
  }
});

interface ResourceContractOptions {
  name: string;
  symbol: string;
  decimals: AnyNumber;
  from: Address;
}
