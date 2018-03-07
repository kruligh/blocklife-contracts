import { Resource } from 'blocklife-contracts';
import { Address } from 'common';

export class ResourceTestContext {
    public token: Resource;

    public constructor(public accounts: Address[], public owner: Address) {}
}
