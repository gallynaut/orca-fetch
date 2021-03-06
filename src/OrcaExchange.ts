import { Connection } from "@solana/web3.js";
import {
  getOrca,
  Orca,
  OrcaPoolConfig,
  getTokenCount,
  OrcaU64,
  OrcaToken,
  OrcaPoolToken,
  OrcaPool,
} from "@orca-so/sdk";
import { orcaPoolConfigs } from "@orca-so/sdk/dist/constants/pools";
import { usdcToken } from "@orca-so/sdk/dist/constants/tokens";
import Decimal from "decimal.js";
import { OrcaPoolParams } from "@orca-so/sdk/dist/model/orca/pool/pool-types";

export default class OrcaExchange {
  private connection: Connection;
  private orca: Orca;
  private usdc: OrcaToken = usdcToken;
  private usdcMint: string = this.usdc.mint.toString();

  constructor(rpcEndpoint?: string) {
    const url: string = rpcEndpoint || "https://api.mainnet-beta.solana.com";
    this.connection = new Connection(url, "singleGossip");
    this.orca = getOrca(this.connection);
  }

  public async getOrcaLpTokenPrice(pubkey: string): Promise<Decimal | null> {
    // get public key of pool
    let poolConfig: OrcaPoolConfig;
    let pool: OrcaPool;
    let poolParams: OrcaPoolParams;
    let tokenA: OrcaPoolToken;
    let tokenB: OrcaPoolToken;
    try {
      poolConfig = pubkey as OrcaPoolConfig;
      pool = this.orca.getPool(poolConfig);
      poolParams = orcaPoolConfigs[poolConfig];
      tokenA = pool.getTokenA();
      tokenB = pool.getTokenB();
    } catch (err) {
      console.error(`No matching pool found for ${pubkey}`);
      return null;
    }

    // get current amount of each token in the pool
    const tokenCount = await getTokenCount(
      this.connection,
      poolParams,
      tokenA,
      tokenB
    );
    const numTokenA = new OrcaU64(
      tokenCount.inputTokenCount,
      tokenA.scale
    ).toDecimal();
    const numTokenB = new OrcaU64(
      tokenCount.outputTokenCount,
      tokenB.scale
    ).toDecimal();

    // get current quote for each token
    const priceA =
      tokenA.mint.toString() === this.usdcMint
        ? new Decimal(1)
        : await this.getOrcaTokenPrice(tokenA.mint.toString());
    const priceB =
      tokenB.mint.toString() === this.usdcMint
        ? new Decimal(1)
        : await this.getOrcaTokenPrice(tokenB.mint.toString());

    // calculate LP token price
    const poolLiquidity = Decimal.add(
      Decimal.mul(numTokenA, priceA),
      Decimal.mul(numTokenB, priceB)
    );
    const supply = (await pool.getLPSupply()).toDecimal();
    const lpTokenPrice = Decimal.div(poolLiquidity, supply);
    return lpTokenPrice;
  }
  // Look in Orca configs for a given base and quote mint address
  public async findPool(
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
  public async getOrcaTokenPrice(baseMint: string): Promise<Decimal> {
    const poolConfig = await this.findPool(baseMint, this.usdcMint);
    const pool = this.orca.getPool(poolConfig);
    return (
      await pool.getQuote(
        pool.getTokenA(),
        new Decimal(1),
        new Decimal(0.5) // low slippage
      )
    ).getRate();
  }
}
