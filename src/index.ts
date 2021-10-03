import { Connection } from "@solana/web3.js";
import { Orca, getOrca, OrcaPool, OrcaPoolConfig, OrcaU64 } from "@orca-so/sdk";
import Decimal from "decimal.js";

async function main() {
  // let connection = new Connection("https://api.mainnet-beta.solana.com");
  // let orcaPool = new OrcaPoolImpl(connection, ORCA_MSOL_USDC_POOL);
  // let quote = await orcaPool.getQuote(orcaPool.getTokenA(), new Decimal(1));
  // console.log(quote);
  // console.log(quote.getRate());
  // console.log(quote.getExpectedOutputAmount().toNumber());
  // process.exit(1);
  try {
    const connection = new Connection(
      "https://api.mainnet-beta.solana.com",
      "singleGossip"
    );
    const orca = getOrca(connection);
    const q = await fetchOrcaLPQuote(orca, OrcaPoolConfig.USDC_USDT);
  } catch (e) {
    // catch
  }
}
async function fetchOrcaLPQuote(
  orca: Orca,
  poolConfig: OrcaPoolConfig
): Promise<number> {
  const pool = orca.getPool(poolConfig);
  const one = new Decimal(1);
  const quote = await pool.getQuote(pool.getTokenA(), one, one);
  console.log(quote);
  console.log(poolConfig, quote.getRate());
  console.log(quote.getExpectedOutputAmount().toNumber());
  return 0;
}

main().then(
  () => {
    // logger.info("Ran node successfully.");
    // process.exit();
  },
  (err) => {
    // logger.error("Node failure.");
    // logger.error(err);
    // process.exit(-1);
  }
);
