import { Connection } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig, OrcaU64 } from "@orca-so/sdk";

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

    // Get an instance of the ETH-USDC orca pool
    const pool = orca.getPool(OrcaPoolConfig.USDC_USDT);
    const supply = await pool.getLPSupply();
    console.log(supply.toNumber());

    console.log(await pool.getTokenA());
    console.log(await pool.getTokenB());
  } catch (e) {
    // catch
  }
}

// main().then(
//   () => {
//     // logger.info("Ran node successfully.");
//     // process.exit();
//   },
//   (err) => {
//     // logger.error("Node failure.");
//     // logger.error(err);
//     // process.exit(-1);
//   }
// );
