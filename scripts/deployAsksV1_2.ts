import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as fs from 'fs-extra';
import assert from 'assert';

export async function deployAsksV1_2(_, hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const [deployer] = await hre.ethers.getSigners();
  const { chainId } = await deployer.provider.getNetwork();

  const addressPath = `${process.cwd()}/addresses/${chainId}.json`;
  const addressBook = JSON.parse(await fs.readFileSync(addressPath));

  assert(
    addressBook.ERC20TransferHelper,
    `missing ERC20TransferHelper in ${addressPath}`
  );
  assert(
    addressBook.ERC721TransferHelper,
    `missing ERC721TransferHelper in ${addressPath}`
  );
  assert(
    addressBook.ZoraProtocolFeeSettings,
    `missing ZoraProtocolFeeSettings in ${addressPath}`
  );
  assert(addressBook.WETH, `missing WETH in ${addressPath}`);
  assert(
    addressBook.RoyaltyEngineV1,
    `missing RoyaltyEngineV1 in ${addressPath}`
  );

  console.log(`Deploying AsksV1_2 from address ${await deployer.getAddress()}`);

  // @ts-ignore
  const AsksFactory = await hre.ethers.getContractFactory('AsksV1_2');
  const asks = await AsksFactory.deploy(
    addressBook.ERC20TransferHelper,
    addressBook.ERC721TransferHelper,
    addressBook.RoyaltyEngineV1,
    addressBook.ZoraProtocolFeeSettings,
    addressBook.WETH
  );
  console.log(
    `Deploying AsksV1_2 with tx ${asks.deployTransaction.hash} to address ${asks.address}`
  );

  await asks.deployed();
  addressBook.AsksV1_2 = asks.address;
  await fs.writeFile(addressPath, JSON.stringify(addressBook, null, 2));
  console.log(`Deployed AsksV1_2`);
}