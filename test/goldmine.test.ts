import {assert} from 'chai';
import {GoldMine, Resource} from 'blocklife-contracts';
import {ContractContextDefinition} from 'truffle';
import {MineHelper} from './helpers/mine.helper';
import {ResourceHelper} from './helpers/resource.helper';
import {Address} from 'common';

declare const contract: ContractContextDefinition;

contract('Gold Mine', (accounts: Address[]) => {
  const owner = accounts[9];
  const notOwner = accounts[8];
  let resourceA: Resource;
  let resourceB: Resource;
  let resourceC: Resource;
  let resourceHelper: ResourceHelper;
  let mine: GoldMine;
  let mineHelper: MineHelper;

  beforeEach(async () => {
    mineHelper = new MineHelper(owner);
    mine = await mineHelper.createContract();
    assert.isOk(mine);

    resourceHelper = new ResourceHelper(owner);

    resourceA = await resourceHelper.createResource(owner, mine);
    resourceB = await resourceHelper.createResource(owner, mine);
    resourceC = await resourceHelper.createResource(owner, mine);
  });

  describe('#ctor', () => {
    it('should create contract', async () => {
      assert.isOk(mine);
    });
  });

});
