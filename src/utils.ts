// import { Connection, AccountInfo, PublicKey } from "@solana/web3.js";

// export type RpcParams = {
//   methodName: string;
//   args: Array<any>;
// };

// export type RpcBatchRequest = (requests: RpcParams[]) => any;

// export interface ConnectionInternal extends Connection {
//   _rpcBatchRequest: RpcBatchRequest;
// }

// export async function fetchBatchedAccountInfos(
//   connection: ConnectionInternal,
//   pubkeys: PublicKey[]
// ): Promise<AccountInfo<Buffer>[] | null> {
//   const requests = pubkeys.map((pubkey) => ({
//     methodName: "getAccountInfo",

//     // Passing "jsonParsed" as the encoding allows the address to be treated as a base58 string
//     args: connection._buildArgs(
//       [pubkey.toBase58()],
//       "singleGossip",
//       "jsonParsed"
//     ),
//   }));

//   const results: any = await connection._rpcBatchRequest(requests);

//   return (
//     results
//       // Convert from RPC request response to AccountInfo<Buffer>
//       .map((res: any) =>
//         res.result.value
//           ? Object.assign({}, res.result.value, {
//               // This Buffer conversion is based on
//               // https://github.com/solana-labs/solana-web3.js/blob/master/src/connection.ts#L57
//               // Below, data[0] is the actual data, data[1] is the format (base64)
//               data: Buffer.from(res.result.value.data[0], "base64"),
//             })
//           : null
//       )
//   );
// }

// /**
//  *
//  * @param connection A Solana RPC connection
//  * @param farmPubkeys The public keys for the GlobalFarm accounts
//  * @returns An array of GlobalFarm models
//  */
// export async function fetchGlobalFarms(
//   connection: ConnectionInternal,
//   farmPubkeys: PublicKey[],
//   programId: PublicKey
// ): Promise<GlobalFarm[]> {
//   const accountInfos = await fetchBatchedAccountInfos(connection, farmPubkeys);

//   return Promise.all(
//     accountInfos.map(
//       async (accountInfo: AccountInfo<Buffer> | null, i: number) => {
//         if (!accountInfo) {
//           throw new Error("GlobalFarm not found");
//         }

//         const decoded = decodeGlobalFarmBuffer(accountInfo);
//         const publicKey = farmPubkeys[i];
//         const authority = (await getAuthorityAndNonce(publicKey, programId))[0];
//         return new GlobalFarm({
//           ...decoded,
//           publicKey,
//           authority,
//         });
//       }
//     )
//   );
// }
