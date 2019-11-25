const { ethers } = require('ethers')
const AirdropDuoABI = require('../abi/AirdropDuo.json').abi
const CappedVotingABI = require('../abi/CappedVoting.json').abi
const HarbergerABI = require('../abi/Harberger.json').abi
const KernelABI = require('../abi/Kernel.json').abi
const SubscribeABI = require('../abi/Subscribe.json').abi
const TippingABI = require('../abi/Tipping.json').abi
const TokenABI = require('../abi/Token.json').abi
const TokenManagerABI = require('../abi/TokenManager.json').abi
// import ethers from 'ethers'
// import { abi as AirdropDuoABI } from '../abi/AirdropDuo.json'
// import { abi as CappedVotingABI } from '../abi/CappedVoting.json'
// import { abi as HarbergerABI } from '../abi/Harberger.json'
// import { abi as KernelABI } from '../abi/Kernel.json'
// import { abi as SubscribeABI } from '../abi/Subscribe.json'
// import { abi as TippingABI } from '../abi/Tipping.json'
// import { abi as TokenABI } from '../abi/Token.json'
// import { abi as TokenManagerABI } from '../abi/TokenManager.json'
const { utils, Contract } = ethers
const tokenManagerNamehash = utils.namehash('token-manager.aragonpm.eth')
const apps = {}
apps[utils.namehash('capped-voting-app.open.aragonpm.eth')] = {name: 'voting', abi: CappedVotingABI}
apps[utils.namehash('harberger-app.open.aragonpm.eth')] = {name: 'harberger', abi: HarbergerABI}
apps[utils.namehash('subscribe-app.open.aragonpm.eth')] = {name: 'subscribe', abi: SubscribeABI}
apps[utils.namehash('tipping-app.open.aragonpm.eth')] = {name: 'tipping', abi: TippingABI}

async function getContracts(daoAddress, provider){
  const kernel = new Contract(daoAddress, KernelABI, provider)
  const fromBlock = (await kernel.getInitializationBlock()).toNumber()
  const toBlock = 'latest'
  const NewAppProxyEvent = kernel.filters.NewAppProxy()
  const logs = await kernel.queryFilter(NewAppProxyEvent, fromBlock, toBlock)
  const contracts = {}
  for (const log of logs) {
      const [address,,appId] = kernel.interface.parseLog(log).values
      if(appId == tokenManagerNamehash){
        if(!contracts['contribManager']) {
          contracts['contribManager'] = new Contract(address, TokenManagerABI, provider)
          contracts['contrib'] = new Contract(await contracts['contribManager'].token(), TokenABI, provider)
        } else {
          contracts['currencyManager'] = new Contract(address, TokenManagerABI, provider)
          contracts['currency'] = new Contract(await contracts['currencyManager'].token(), TokenABI, provider)
        }
      } else if(apps[appId])
        contracts[apps[appId].name] = new Contract(address, apps[appId].abi, provider)
  }
  return contracts
}

// export default getContracts
module.exports.default = getContracts

if(typeof window === "undefined" && process.argv.length){
  (async ()=>{
    // const SOME_DAO_ADDRESS = "0xa23434b973dA1Af103Da4037F04C5b44ba7BDFcF"
    const contracts = await getContracts(process.argv[2], ethers.getDefaultProvider(process.argv[3] || 'rinkeby'))
    for (const c in contracts) console.log(`${c}: ${contracts[c].address}`)
  })()
}
