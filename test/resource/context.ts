import { Resource } from 'project';

export class ResourceTestContext {
  public token: Resource;

  public constructor(
    public accounts: Address[],
    public owner: Address
  ) {}
}
