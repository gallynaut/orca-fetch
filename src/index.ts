import { Connection, PublicKey } from "@solana/web3.js";
import {
  getOrca,
  Orca,
  OrcaPoolConfig,
  getTokenCount,
  PoolTokenCount,
  OrcaU64,
  OrcaPoolToken,
  OrcaToken,
} from "@orca-so/sdk";
import { orcaPoolConfigs } from "@orca-so/sdk/dist/constants/pools";
import { usdcToken } from "@orca-so/sdk/dist/constants/tokens";
import Decimal from "decimal.js";

const usdc = usdcToken;
const usdcMint = usdc.mint.toString();

async function main() {
  try {
    // establish connection to orca
    const connection = new Connection(
      "https://api.mainnet-beta.solana.com",
      "singleGossip"
    );
    const orca = getOrca(connection);

    // get public key of pool
    const poolConfig = OrcaPoolConfig.USDC_USDT;
    console.log(`Pool: ${new PublicKey(poolConfig).toString()}`);
    const pool = orca.getPool(poolConfig);

    const poolParams = orcaPoolConfigs[poolConfig];
    const tokenA = pool.getTokenA();
    const tokenB = pool.getTokenB();

    // get current amount of each token in the pool
    const tokenCount: PoolTokenCount = await getTokenCount(
      connection,
      poolParams,
      tokenA,
      tokenB
    );
    const numTokenA = new OrcaU64(
      tokenCount.inputTokenCount,
      tokenA.scale
    ).toNumber();
    const numTokenB = new OrcaU64(
      tokenCount.outputTokenCount,
      tokenB.scale
    ).toNumber();

    // get current quote for each token
    const priceA =
      tokenA.mint.toString() === usdcMint
        ? 1
        : await getUSDCPrice(orca, tokenA.mint.toString());
    const priceB =
      tokenB.mint.toString() === usdcMint
        ? 1
        : await getUSDCPrice(orca, tokenB.mint.toString());

    console.log(
      `${tokenA.name}: N=${numTokenA} @ $${priceA} = $${numTokenA * priceA}`
    );
    console.log(
      `${tokenB.name}: N=${numTokenB} @ $${priceB} = $${numTokenB * priceB}`
    );

    // calculate LP token price
    const poolLiquidity = numTokenA * priceA + numTokenB * priceB;
    console.log(`Total Liquidity = $${poolLiquidity}`);
    const supply = (await pool.getLPSupply()).toNumber();
    console.log(`# LP Tokens = ${supply}`);
    const lpTokenPrice = poolLiquidity / supply;
    console.log(`LP Token Price: ${lpTokenPrice} USDC`);
  } catch (e) {
    // catch
    console.log(e);
  }
}

// Look in Orca configs for a given base and quote mint address
async function findPool(
  baseMint: string,
  quoteMint: string
): Promise<OrcaPoolConfig> {
  for (const k in orcaPoolConfigs) {
    const pair = orcaPoolConfigs[k].tokenIds;
    if (
      pair.length >= 2 &&
      pair.includes(baseMint) &&
      pair.includes(quoteMint)
    ) {
      return k as OrcaPoolConfig;
    }
  }
  throw `couldnt find pool for ${baseMint}/${quoteMint}`;
}

// Return the latest quote for a given USDC pool
async function getUSDCPrice(orca: Orca, baseMint: string): Promise<number> {
  const poolConfig = await findPool(baseMint, usdcMint);
  const pool = orca.getPool(poolConfig);
  return (
    await pool.getQuote(
      pool.getTokenA(),
      new Decimal(1),
      new Decimal(0.5) // low slippage
    )
  )
    .getRate()
    .toNumber();
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
