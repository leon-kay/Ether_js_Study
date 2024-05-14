// //HD钱包（Hierarchical Deterministic Wallet，多层确定性钱包）是一种数字钱包 ，通常用于存储比特币和以太坊等加密货币持有者的数字密钥。通过它，用户可以从一个随机种子创建一系列密钥对，更加便利、安全、隐私

// //BIP32可以用一个随机种子衍生多个私钥，更方便的管理多个钱包。钱包的地址由衍生路径决定。
const { ethers } = require("ethers");

// const crypto = require("crypto");

// // 生成随机助记词
// const mnemonic = ethers.Mnemonic.entropyToPhrase(crypto.randomBytes(32));
// // 创建HD钱包
// const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
// console.log("创建的HD钱包：");
// console.log(hdNode);

// const numWallet = 20;

// //BIP44为BIP32的衍生路径提供了一套通用规范，适配比特币、以太坊等多链。这一套规范包含六级
// /*
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// m: 固定为"m"
// purpose：固定为"44"
// coin_type：代币类型，比特币主网为0，比特币测试网为1，以太坊主网为60
// account：账户索引，从0开始。
// change：是否为外部链，0为外部链，1为内部链，一般填0.
// address_index：地址索引，从0开始，想生成新地址就把这里改为1，2，3。
// */

// // 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包

// let basePath = "m/44'/60'/0'/0/0"; // 根路径
// let walletIndex = 1; // 钱包索引

// // 派生指定路径下的 HD 钱包节点
// let hdNodeNew = hdNode.derivePath(`${basePath}`);
// // let walletNew = new ethers.Wallet(hdNodeNew.privateKey);

// // console.log(`第1个钱包地址： ${walletNew.address}`);

// // let wallets = [];
// // for (let i = 0; i < numWallet; i++) {
// //   let hdNodeNew = hdNode.derivePath(basePath + "/" + i);

// //   /**********************
// //    *疑问：用私钥创建wallet对象  不应该是const wallet2 = new ethers.Wallet(privateKey, provider)吗？
// //    *回答：只是创建了一个本地的钱包，而不是连接到区块链网络。
// //    */
// //   let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
// //   console.log(`第${i + 1}个钱包地址： ${walletNew.address}`);
// //   wallets.push(walletNew);
// // }

// // const wallet = ethers.Wallet.fromPhrase(mnemonic);
// // console.log("通过助记词创建钱包：");
// // console.log(wallet);

// // // 异步函数：加密钱包
// // async function encryptWallet() {
// //   // 加密json用的密码，可以更改成别的
// //   const pwd = "password";
// //   const json = await wallet.encrypt(pwd);
// //   console.log("钱包的加密json：");
// //   console.log(json);

// //   // 调用异步函数，从加密json读取钱包
// //   await readEncryptedWallet(json, pwd);
// // }

// // // 异步函数：从加密json读取钱包
// // async function readEncryptedWallet(json, pwd) {
// //   const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
// //   console.log("\n4. 从加密json读取钱包：");
// //   console.log(wallet2);
// // }

// // // 调用异步函数
// // encryptWallet();
