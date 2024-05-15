const { ethers } = require("ethers");

//链下签名白名单铸造NFT
//1、创建provider和wallet，其中wallet是用于签名的钱包。
const ALCHEMY_GOERLI_URL =
  "https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l";
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey =
  "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b";
const wallet = new ethers.Wallet(privateKey, provider);

//2、根据白名单地址和他们能铸造的tokenId生成消息并签名。
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
const tokenId = "0";
// 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
//被签名的消息是一组数据的keccak256哈希，为bytes32类型
const msgHash = ethers.solidityPackedKeccak256(
  ["address", "uint256"],
  [account, tokenId]
);
console.log(`msgHash：${msgHash}`);
// msgHash：0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c
// 为了避免用户误签了恶意交易，EIP191提倡在消息前加上"\x19Ethereum Signed Message:\n32"字符，再做一次keccak256哈希得到以太坊签名消息，然后再签名。
const messageHashBytes = ethers.getBytes(msgHash);
const signature = await wallet.signMessage(messageHashBytes);
console.log(`签名：${signature}`);
//注意，如果消息为string类型，则需要利用arrayify()函数处理下。
// 签名：0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c

//3、创建合约工厂，为部署NFT合约做准备
// NFT的人类可读abi
const abiNFT = [
  "constructor(string memory _name, string memory _symbol, address _signer)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
  "function ownerOf(uint256) view returns (address)",
  "function balanceOf(address) view returns (uint256)",
];
// 合约字节码，在remix中，你可以在两个地方找到Bytecode
// i. 部署面板的Bytecode按钮
// ii. 文件面板artifact文件夹下与合约同名的json文件中
// 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
// "object": "608060405260646000553480156100...
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

//4、利用合约工厂部署NFT合约
// 部署合约，填入constructor的参数
const contractNFT = await factoryNFT.deploy(
  "WTF Signature",
  "WTF",
  wallet.address
);
console.log(`合约地址: ${contractNFT.target}`);
console.log("等待合约部署上链");
await contractNFT.waitForDeployment();
// 也可以用 contractNFT.deployTransaction.wait()
console.log("合约已上链");

//5、调用NFT合约的mint()函数，利用链下签名验证白名单，为account地址铸造NFT
console.log(`NFT名称: ${await contractNFT.name()}`);
console.log(`NFT代号: ${await contractNFT.symbol()}`);
let tx = await contractNFT.mint(account, tokenId, signature);
console.log("铸造中，等待交易上链");
await tx.wait();
console.log(
  `mint成功，地址${account} 的NFT余额: ${await contractNFT.balanceOf(
    account
  )}\n`
);

/**在生产环境使用数字签名验证白名单发行NFT主要有以下步骤：
1、确定白名单列表。
2、在后端维护一个签名钱包，生成每个白名单对应的消息和签名。
3、部署NFT合约，并将签名钱包的公钥signer保存在合约中。
4、用户铸造时，向后端请求地址对应的签名。
5、用户调用mint()函数进行铸造NFT。
 */
/**Merkle Tree和链下数字签名是目前最主流也最经济的发放白名单方式。如果合约部署的时候已经确定好白名单列表，那么建议用Merkle Tree；如果在合约部署之后要不断添加白名单，例如Galaxy Project的OAT，那么建议用链下签名的方式，不然就要不断更新合约中Merkle Tree的root，耗费更多的gas。 */
