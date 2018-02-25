import BigNumber from 'bignumber.js';
import {ProjectArtifacts, Resource} from 'project';
import {propOr} from 'ramda';
import {AnyNumber} from 'web3';

declare const artifacts: ProjectArtifacts;

const ResourceContract = artifacts.require('./ResourceToken.sol');

export class ResourceHelper {
    public constructor(private owner: Address,
                       private tokenName = 'tokenName1',
                       private tokenSymbol = 'tknCode1',
                       private tokenDecimals = new BigNumber(18)) {
    }

    public async createContract(options?: Partial<ResourceContractOptions>): Promise<Resource> {
        return await ResourceContract.new(
            propOr(this.tokenName, 'name', options),
            propOr(this.tokenSymbol, 'symbol', options),
            propOr(this.tokenDecimals, 'decimals', options),
            {from: propOr(this.owner, 'from', options)}
        );
    }
}

export interface ResourceContractOptions {
    name: string;
    symbol: string;
    decimals: AnyNumber;
    from: Address;
}
