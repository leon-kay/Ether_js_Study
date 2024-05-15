/**MerkleTree.js是构建Merkle Tree和Merkle Proof的Javascript包。可以用npm安装他 */
import { MerkleTree } from "merkletreejs";
//1、创建白名单地址数组。
const tokens = [
  "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
  "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
];
//2、将数据进行keccak256哈希（与solidity使用的哈希函数匹配），创建叶子结点
const leaf = tokens.map((x) => ethers.keccak256(x));
//3、创建Merkle Tree，哈希函数仍然选择keccak256，可选参数sortPairs: true（constructor函数文档），与Merkle Tree合约处理方式保持一致
/**第二个参数 ethers.keccak256 的作用是告诉 Merkle 树的构造函数，在构建树的过程中要使用 ethers.keccak256 这个哈希函数来计算节点的哈希值 */
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
//4、获得Merkle Tree的root
const root = merkletree.getHexRoot();
//5、获得第0个叶子节点的proof
const proof = merkletree.getHexProof(leaf[0]);
console.log("Leaf:");
console.log(leaf);
console.log("\nMerkleTree:");
console.log(merkletree.toString());
console.log("\nProof:");
console.log(proof);
console.log("\nRoot:");
console.log(root);

const ALCHEMY_GOERLI_URL =
  "https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l";
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey =
  "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b";
const wallet = new ethers.Wallet(privateKey, provider);

// NFT的abi
const abiNFT = [
  "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
  "function ownerOf(uint256) view returns (address)",
  "function balanceOf(address) view returns (uint256)",
];
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);
console.log("\n 利用contractFactory部署NFT合约");
// 部署合约，填入constructor的参数
const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root);
console.log(`合约地址: ${contractNFT.target}`);
console.log("等待合约部署上链");
await contractNFT.waitForDeployment();
console.log("合约已上链");

console.log(
  "\n 调用mint()函数，利用merkle tree验证白名单，给第一个地址铸造NFT"
);
console.log(`NFT名称: ${await contractNFT.name()}`);
console.log(`NFT代号: ${await contractNFT.symbol()}`);
let tx = await contractNFT.mint(tokens[0], "0", proof);
console.log("铸造中，等待交易上链");
await tx.wait();
console.log(
  `mint成功，地址${tokens[0]} 的NFT余额: ${await contractNFT.balanceOf(
    tokens[0]
  )}\n`
);
/**在生产环境使用Merkle Tree验证白名单发行NFT主要有以下步骤：
1、确定白名单列表。
2、在后端生成白名单列表的Merkle Tree。
3、部署NFT合约，并将Merkle Tree的root保存在合约中。
4、用户铸造时，向后端请求地址对应的proof。
5、用户调用mint()函数进行铸造NFT。 */
