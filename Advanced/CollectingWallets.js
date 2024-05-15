const { ethers } = require("ethers");
const ALCHEMY_ID =
  "https://eth-mainnet.g.alchemy.com/v2/2JHx4xEYH7LbkXVy0XsGy2wEQRxQX_7V";
const provider = new ethers.JsonRpcProvider(ALCHEMY_ID);
const privateKey =
  "55dd09900e891a9d7ddbac17e0d0ef0fd9277e61124409aa19d9d5138b31505d";
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];
// WETH合约地址（Goerli测试网）
const addressWETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // WETH Contract
// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

//创建HD钱包，用于管理多个钱包
console.log("\n1. 创建HD钱包");
const mnemonic = "";
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
console.log(hdNode);

//衍生钱包
const number = 20;
const basePath = "44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < number; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  wallets.push(walletNew);
  console.log(walletNew.address);
}
const amount = ethers.parseEther("0.0001");
console.log("发送数额：${amount}");

async function readLeonBalance() {
  console.log("\n3. 读取一个地址的ETH和WETH余额");
  const balanceWETH = await contractWETH.balanceWETH(wallets[19].address);
  console.log(`WETH持仓: ${ethers.formatEther(balanceWETH)}`);
  const balanceETH = await provider.getBalance(wallets[19].address);
  console.log(`ETH持仓: ${ethers.formatEther(balanceETH)}\n`);
}
readLeonBalance();

console.log("\n4. 批量归集20个钱包的ETH");
const txSendETH = {
  to: wallet.address,
  value: amount,
};
for (let i = 0; i < numWallet; i++) {
  // 将钱包连接到provider
  let walletWithProvider = wallets[i].connect(provider);
  var tx = await walletWithProvider.sendTransaction(txSendETH);
  console.log(`第 ${i + 1} 个钱包 ${walletWithProvider.address} ETH 归集开始`);
}
await tx.wait();
console.log(`ETH 归集结束`);

for (let i = 0; i < numWallet; i++) {
  // 将钱包连接到provider
  let walletWithProvider = wallets[i].connect(provider);
  // 将合约连接到新的钱包
  let contractConnected = contractWETH.connect(walletWithProvider);
  var tx = await contractConnected.transfer(wallet.address, amount);
  console.log(`第 ${i + 1} 个钱包 ${wallets[i].address} WETH 归集开始`);
}
await tx.wait();
console.log(`WETH 归集结束`);

console.log("\n6. 读取一个地址在归集后的ETH和WETH余额");
// 读取WETH余额
const balanceWETHAfter = await contractWETH.balanceOf(wallets[19]);
console.log(`归集后WETH持仓: ${ethers.formatEther(balanceWETHAfter)}`);
// 读取ETH余额
const balanceETHAfter = await provider.getBalance(wallets[19]);
console.log(`归集后ETH持仓: ${ethers.formatEther(balanceETHAfter)}\n`);
