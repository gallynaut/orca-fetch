import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import {
  Orca,
  getOrca,
  OrcaPoolConfig,
  OrcaFarmConfig,
  ORCA_FARM_ID,
  getTokenCount,
  PoolTokenCount,
  solUsdcPool,
} from "@orca-so/sdk";
import jsonpath from "jsonpath";
import { OrcaPoolStats } from "./types/types";
// import { OrcaPoolStats } from "./types/types";

async function main() {
  try {
    // establish connection to orca
    const connection = new Connection(
      "https://api.mainnet-beta.solana.com",
      "singleGossip"
    );
    const orca = getOrca(connection);
    const pk = new PublicKey(OrcaPoolConfig.SOL_USDC);
    console.log(pk.toString());
    const poolParams: OrcaPoolParams = solUsdcPool;
    const tokenCount: PoolTokenCount = await getTokenCount(
      connection,
      poolParams
    );

    // const r = await (await connection.getParsedAccountInfo(pk)).value;
    // const r = await connection.getAccountInfo(pk);
    // if (!r) {
    //   throw "Account data is empty";
    // }
    // const accountData = r.data;
    // console.log(JSON.stringify(accountData, null, 2));
    // const y = accountData.toLocaleString();
    // console.log(y);

    // const one = new Decimal(1); // quote amount and slippage
    // calculateLpToken(orca, OrcaPoolConfig.SOL_USDC);

    // const q = await fetchOrcaLPQuote(orca, OrcaPoolConfig.USDC_USDT);
  } catch (e) {
    // catch
  }
}

export async function parseAccountData(
  connection: Connection,
  address: PublicKey
): Promise<Buffer> {
  const accountInfo = await connection.getAccountInfo(address);
  if (accountInfo == null) {
    throw new Error(
      `Failed to fetch information on account ${address.toBase58()}.`
    );
  }
  const data = accountInfo.data;
  if (data.length == 0) {
    throw new Error(
      `Switchboard account parser was not provided with a bundle auth account: ${address.toBase58()}`
    );
  }
  console.log(data.toJSON());
  return data;
}

// async function calculateLpToken(
//   orca: Orca,
//   poolConfig: OrcaPoolConfig
// ): Promise<number> {
//   //get pool config
//   const pool = orca.getPool(poolConfig);
//   const poolName = `${pool.getTokenA().name}/${pool.getTokenB().name}`;
//   const mintAddress = poolConfig as string;

//   // get total supply of lp
//   const supply = (await pool.getLPSupply()).toNumber();
//   console.log(poolName, `Supply: ${supply}`);

//   // get liquidity of pool from API
//   try {
//     // const response: Response = await fetch("https://api.orca.so/pools");
//     const poolData: OrcaPoolStats[] = await getOrcaPoolStats();
//     console.log(poolData);
//   } catch (err) {
//     console.log(err);
//   }

//   return 0;
// }
// async function getOrcaPoolStats(): Promise<OrcaPoolStats[]> {
//   // For now, consider the data is stored on a static `users.json` file
//   const response: Response = await fetch("https://api.orca.so/pools");
//   const body = await response.json();
//   return body as OrcaPoolStats[];
// }

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
