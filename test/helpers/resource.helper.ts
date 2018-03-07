import BigNumber from 'bignumber.js';
import {assert} from 'chai';
import {Mine, ProjectArtifacts, Resource} from 'blocklife-contracts';
import { propOr } from 'ramda';
import {Address, AnyNumber} from 'common';

declare const artifacts: ProjectArtifacts;

const ResourceContract = artifacts.require('./ResourceToken.sol');

export class ResourceHelper {
    public constructor(
        private owner: Address,
        private tokenName = 'tokenName1',
        private tokenSymbol = 'tknCode1',
        private tokenDecimals = new BigNumber(18)
    ) {}

    public async createContract(options?: Partial<ResourceContractOptions>): Promise<Resource> {
        return await ResourceContract.new(
            propOr(this.tokenName, 'name', options),
            propOr(this.tokenSymbol, 'symbol', options),
            propOr(this.tokenDecimals, 'decimals', options),
            { from: propOr(this.owner, 'from', options) }
        );
    }

  public async createResource(owner: Address, mine: Mine) {
    const resource = await this.createContract();
    assert.isOk(resource);
    await resource.addMintingManager(mine.address, {from: owner});
    assert.isTrue(await resource.isMintingManager(mine.address));
    await resource.addMintingManager(owner, {from: owner});
    assert.isTrue(await resource.isMintingManager(owner));
    return resource;
  }

}

export interface ResourceContractOptions {
    name: string;
    symbol: string;
    decimals: AnyNumber;
    from: Address;
}
