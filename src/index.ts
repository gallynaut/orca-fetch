import { Connection, PublicKey } from "@solana/web3.js";
import {
  getOrca,
  OrcaPoolConfig,
  getTokenCount,
  PoolTokenCount,
  OrcaU64,
} from "@orca-so/sdk";
import { orcaPoolConfigs } from "@orca-so/sdk/dist/constants/pools";
import Decimal from "decimal.js";

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
    const supply = (await pool.getLPSupply()).toNumber();
    const poolParams = orcaPoolConfigs[pk.toString()];
    const tokenA = pool.getTokenA();
    const tokenB = pool.getTokenB();

    // get current amount of each token in the pool
    const tokenCount: PoolTokenCount = await getTokenCount(
      connection,
      poolParams,
      tokenA,
      tokenB
    );
    const tokenAAmount = new OrcaU64(
      tokenCount.inputTokenCount,
      tokenA.scale
    ).toNumber();
    const tokenBAmount = new OrcaU64(
      tokenCount.outputTokenCount,
      tokenB.scale
    ).toNumber();

    // get current rate of pool tokenA/tokenB
    const rate = (
      await pool.getQuote(
        pool.getTokenA(),
        new Decimal(1),
        new Decimal(0.5) // low slippage
      )
    )
      .getRate()
      .toNumber();

    // calculate price
    const price = (tokenAAmount * rate + tokenBAmount) / supply;
    console.log(`$${price} ${tokenA.tag}/${tokenB.tag}`);

    // check if tokenB is USDC
    if (tokenB.tag !== "USDC") {
      // find tokenB/USDC
    }
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
