const { ethers, utils } = require("ethers");
const fs = require('fs');

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = JSON.parse(fs.readFileSync('./artifacts/contracts/' + configs.contract_name + '.sol/' + configs.contract_name + '.json').toString())
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const contract = new ethers.Contract(configs.contract_address, ABI.abi, wallet)
    const tokens = await contract.tokensOfOwner(wallet.address)
    if (tokens.length > 0) {
        console.log("Transferring ", tokens[0].toString())
        const receiver = "0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248"
        const transfer = await contract.transferFrom(wallet.address, receiver, tokens[0])
        console.log(transfer)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
