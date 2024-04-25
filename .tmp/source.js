// web3-functions/simple/index.ts
import {
  Web3Function
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";
import ky from "ky";
var SIMPLE_COUNTER_ABI = [
  "function increment() external",
  "function updatePrice(uint256)"
];
Web3Function.onRun(async (context) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();
  const oracleAddress = userArgs.oracle ?? "0x71B9B0F6C999CBbB0FeF9c92B80D54e4973214da";
  let oracle = new Contract(oracleAddress, SIMPLE_COUNTER_ABI, provider);
  const currency = userArgs.currency ?? "ethereum";
  let price = 0;
  try {
    const coingeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`;
    const priceData = await ky.get(coingeckoApi, { timeout: 5e3, retry: 0 }).json();
    price = Math.floor(priceData[currency].usd);
  } catch (err) {
    return { canExec: false, message: `Coingecko call failed` };
  }
  console.log(`Updating price: ${price}`);
  return {
    canExec: true,
    callData: [
      {
        to: oracleAddress,
        data: oracle.interface.encodeFunctionData("updatePrice", [price])
      },
      {
        to: oracleAddress,
        data: oracle.interface.encodeFunctionData("increment", [])
      }
    ]
  };
});
