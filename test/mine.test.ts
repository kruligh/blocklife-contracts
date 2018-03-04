import {assert} from 'chai';

import BigNumber from 'bignumber.js';
import {CostSet, GoldMine, Resource} from 'project';
import {ContractContextDefinition} from 'truffle';
import {
  assertNumberAlmostEqual,
  assertNumberEqual,
  assertReverts,
  findLastLog,
  getNetworkTimestamp,
  ZERO_ADDRESS
} from './helpers/common.helper';
import {MineHelper} from './helpers/mine.helper';
import {ResourceHelper} from './helpers/resource.helper';

declare const contract: ContractContextDefinition;

contract('Abstract Mine', (accounts: Address[]) => {
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

  describe('#setCost', () => {

    describe('is minting manager', () => {

      beforeEach(async () => {
        assert.isTrue(await resourceA.isMintingManager(mine.address));
      });

      it('should set cost', async () => {
        const amount = new BigNumber(500);
        await mine.setCost([resourceA.address], [amount], {from: owner});

        const resourceCost = MineHelper.parseResourceCost(await mine.getCost(0));

        assertNumberEqual(resourceCost.amount, amount);
        assert.equal(resourceCost.resource, resourceA.address);
      });

      it('should emit CostSet', async () => {
        const tx = await mine.setCost([resourceA.address], [new BigNumber(500)], {from: owner});

        assert.isOk(findLastLog(tx, 'CostSet') as CostSet);
      });

      it('should set multiple resources cost', async () => {
        const mineCosts = new Map<Resource, BigNumber>();
        mineCosts.set(resourceA, new BigNumber(500));
        mineCosts.set(resourceB, new BigNumber(5));
        mineCosts.set(resourceC, new BigNumber(5));

        await mine.setCost(
          toArray<Resource>(mineCosts.keys()).map(res => res.address),
          toArray<BigNumber>(mineCosts.values()),
          {from: owner});

        const costCount = (await mine.getCosts()).toNumber();
        assertNumberEqual(costCount, new BigNumber(mineCosts.size));

        for (let i = 0; i < costCount; i++) {
          const actualCost = MineHelper.parseResourceCost(await mine.getCost(i));
          assertNumberEqual(actualCost.amount, findCostByAddress(mineCosts, actualCost.resource));
        }
      });

      it('should revert if not owner', async () => {
        await assertReverts(async () => {
          await mine.setCost([resourceA.address], [new BigNumber(500)], {
            from: notOwner
          });
        });
      });

      it('should revert if price already set', async () => {
        await mine.setCost([resourceA.address], [new BigNumber(500)], {
          from: owner
        });

        await assertReverts(async () => {
          await mine.setCost([resourceA.address], [new BigNumber(500)], {
            from: owner
          });
        });
      });

      it('should revert if amounts.length>resources.length', async () => {
        await assertReverts(async () => {
          await mine.setCost([resourceA.address], [new BigNumber(500), new BigNumber(600)], {from: owner});
        });
      });

      it('should revert if resources.length>amounts.length', async () => {
        const resource2 = await resourceHelper.createContract();
        await resource2.addMintingManager(mine.address, {from: owner});
        assert.isTrue(await resource2.isMintingManager(mine.address));

        await assertReverts(async () => {
          await mine.setCost([resourceA.address, resource2.address], [new BigNumber(500)], {from: owner});
        });
      });

      it('should revert if resource address is zero', async () => {
        await assertReverts(async () => {
          await mine.setCost([ZERO_ADDRESS], [new BigNumber(500)], {
            from: owner
          });
        });
      });

      it('should revert if amount is zero', async () => {
        await assertReverts(async () => {
          await mine.setCost([resourceA.address], [new BigNumber(0)], {
            from: owner
          });
        });
      });
    });

    it('should revert if is not minting manager', async () => {
      const resource = await resourceHelper.createContract();
      assert.isFalse(await resource.isMintingManager(mine.address));

      await assertReverts(async () => {
        await mine.setCost([resource.address], [new BigNumber(500)], {
          from: owner
        });
      });
    });

  });

  describe('#getCost', async () => {
    it('Should revert if index array out of bounds', async () => {
      await assertReverts(async () => {
        await mine.getCost(3);
      });
    });
  });

  describe('#getInstance', async () => {
    const buyer = notOwner;

    it('Should revert if index array out of bounds', async () => {
      await assertReverts(async () => {
        await mine.getInstance(3, {from: buyer});
      });
    });
  });

  describe('#buildInstance', async () => {
    const buyer = notOwner;

    it('Should revert if costs not set', async () => {
      await assertReverts(async () => {
        await mine.buildInstance({from: buyer});
      });
    });

    describe('cost set', async () => {

      let mineCosts: Map<Resource, BigNumber>;

      beforeEach(async () => {
        mineCosts = new Map<Resource, BigNumber>();
        mineCosts.set(resourceA, new BigNumber(500));
        mineCosts.set(resourceB, new BigNumber(5));
        mineCosts.set(resourceC, new BigNumber(5));

        await mine.setCost(
          toArray<Resource>(mineCosts.keys()).map(res => res.address),
          toArray<BigNumber>(mineCosts.values()),
          {from: owner});
      });

      it('Should emit BuildRejected if cant afford', async () => {
        const buildTx = await mine.buildInstance({from: buyer});

        const buildRevertedEvent = findLastLog(buildTx, 'BuildRejected');
        assert.isOk(buildRevertedEvent);
      });

      it('Should not transfer any resources if there is lack of first one', async () => {
        await testCantAffordResourceByIndex(findByIndex(mineCosts.keys(), 0));
      });

      it('Should not transfer any resources if there is lack of last one', async () => {
        await testCantAffordResourceByIndex(findByIndex(mineCosts.keys(), mineCosts.size - 1));
      });

      it('Should not transfer any resources if there is lack of middle one', async () => {
        await testCantAffordResourceByIndex(findByIndex(mineCosts.keys(), Math.floor(mineCosts.size / 2)));
      });

      async function testCantAffordResourceByIndex(lackingResource: Resource) {
        for (const [resource, amount] of mineCosts) {
          if (resource !== lackingResource) {
            await resource.mint(buyer, amount, {from: owner});
            assertNumberEqual(await resource.balanceOf(buyer), amount);
            await resource.approve(mine.address, amount, {from: buyer});
          }
        }

        const buildTx = await mine.buildInstance({from: buyer});

        const buildRevertedEvent = findLastLog(buildTx, 'BuildRejected');
        assert.isOk(buildRevertedEvent);

        for (const [resource, amount] of mineCosts) {
          if (resource !== lackingResource) {
            assertNumberEqual(await resource.balanceOf(buyer), amount);
          }
        }
      }

      describe('buyer can afford', async () => {

        beforeEach(async () => {
          for (const [resource, amount] of mineCosts) {
            await resource.mint(buyer, amount, {from: owner});
            assertNumberEqual(await resource.balanceOf(buyer), amount);
            await resource.approve(mine.address, amount, {from: buyer});
          }
        });

        it('Should build', async () => {
          const expectedBuildTime: BigNumber = await getNetworkTimestamp();

          await mine.buildInstance({from: buyer});

          assertNumberEqual(await mine.getInstances({from: buyer}), new BigNumber(1));
          const mineInstance = MineHelper.parseMineInstance(await mine.getInstance(0, {from: buyer}));
          assertNumberAlmostEqual(mineInstance.buildTime, expectedBuildTime, 1);
          assertNumberEqual(mineInstance.buildTime, mineInstance.lastMiningTime);
          assertNumberEqual(mineInstance.mined, new BigNumber(0));
        });

        it('Should emit InstanceBuild event', async () => {
          const buildInstanceTx = await mine.buildInstance({from: buyer});

          const instanceBuildEvent = findLastLog(buildInstanceTx, 'InstanceBuild');
          assert.isOk(instanceBuildEvent);
        });

        it('Should transfer token resources', async () => {
          for (const [resource, amount] of mineCosts) {
            assertNumberEqual(await resource.balanceOf(buyer), amount);
            assertNumberEqual(await resource.balanceOf(mine.address), new BigNumber(0));
          }

          await mine.buildInstance({from: buyer});

          for (const [resource, amount] of mineCosts) {
            assertNumberEqual(await resource.balanceOf(buyer), new BigNumber(0));
            assertNumberEqual(await resource.balanceOf(mine.address), amount);
          }
        });
      });
    });
  });
});

function toArray<T>(iterator: IterableIterator<T>): T[] {
  let result: T[] = [];
  for (const item of iterator) {
    result = [...result, item];
  }
  return result;
}

function findByIndex<T>(iterator: IterableIterator<T>, index: number): T {
  let i = 0;
  for (const item of iterator) {
    if (i === index) {
      return item;
    }
    i++;
  }
}

function findCostByAddress(mineCosts: Map<Resource, BigNumber>, addr: Address): BigNumber {
  for (const [resource, amount] of mineCosts) {
    if (resource.address === addr) {
      return amount;
    }
  }
}
