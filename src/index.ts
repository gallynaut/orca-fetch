import { OrcaPoolConfig } from "@orca-so/sdk";
import OrcaExchange from "./OrcaExchange";

async function main() {
  const orca = new OrcaExchange(); // can supply optional rpcEndpoint

  // mSOL/SOL LP Token Price
  const pubkey = OrcaPoolConfig.mSOL_SOL as string;
  console.log(
    `The LP Token price of mSOL/SOL is ${await orca.getOrcaLpTokenPrice(
      pubkey
    )} USDC`
  );

  // SOL/USDC LP Token Price
  console.log(
    `The LP Token price of SOL/USDC is ${await orca.getOrcaLpTokenPrice(
      OrcaPoolConfig.SOL_USDC as string
    )} USDC`
  );

  // USDC/USDT LP Token Price
  console.log(
    `The LP Token price of USDC/USDT is ${await orca.getOrcaLpTokenPrice(
      OrcaPoolConfig.USDC_USDT as string
    )} USDC`
  );

  // Incorrect Pool PubKey for error handling example
  console.log(
    `The LP Token price of incorrect PubKey is ${await orca.getOrcaLpTokenPrice(
      "XXXzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPcy"
    )} USDC`
  );
}

main().then(
  () => {
    console.log("Ran node successfully.");
    process.exit();
  },
  (err) => {
    console.log(err);
    process.exit(-1);
  }
);
