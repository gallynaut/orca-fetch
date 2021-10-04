import { Connection, PublicKey } from "@solana/web3.js";
import {
  getOrca,
  OrcaPoolConfig,
  getTokenCount,
  PoolTokenCount,
  U64Utils,
  OrcaU64,
} from "@orca-so/sdk";
import { orcaPoolConfigs } from "@orca-so/sdk/dist/constants/pools";

async function main() {
  try {
    // establish connection to orca
    const connection = new Connection(
      "https://api.mainnet-beta.solana.com",
      "singleGossip"
    );
    const orca = getOrca(connection);

    // get public key of pool
    const pk = new PublicKey(OrcaPoolConfig.SOL_USDC);
    console.log(pk.toString());

    const pool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    const poolParams = orcaPoolConfigs[pk.toString()];
    const tokenA = pool.getTokenA();
    const tokenB = pool.getTokenB();

    const tokenCount: PoolTokenCount = await getTokenCount(
      connection,
      poolParams,
      tokenA,
      tokenB
    );
    const tokenAAmount = new OrcaU64(tokenCount.inputTokenCount, tokenA.scale);
    const tokenBAmount = new OrcaU64(tokenCount.outputTokenCount, tokenB.scale);
    console.log(tokenAAmount.toNumber());
    console.log(tokenBAmount.toNumber());
  } catch (e) {
    // catch
  }
}

main().then(
  () => {
    // logger.info("Ran node successfully.");
    // process.exit();
  },
  (err) => {
    // logger.error("Node failure.");
    // logger.error(err);
    console.log(err);
    process.exit(-1);
  }
);
