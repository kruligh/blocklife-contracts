import {ProjectArtifacts} from 'project';
import {Deployer} from 'truffle';

declare const artifacts: ProjectArtifacts;

const Resource = artifacts.require('./ResourceToken.sol');

async function deploy(deployer: Deployer) {
  const resName = 'Gold';
  const resCode = 'GLDXD';
  const resDecimals = 18;
  await deployer.deploy(Resource, resName, resCode, resDecimals);
}

function migrate(deployer: Deployer) {
  deployer.then(() => deploy(deployer));
}

export = migrate;
